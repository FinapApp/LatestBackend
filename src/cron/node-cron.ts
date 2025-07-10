import cron from 'node-cron';
import { QUEST_APPLICANT } from '../models/Quest/questApplicant.model';
import { QUESTS } from '../models/Quest/quest.model';
import { WALLET } from '../models/Wallet/wallet.model';
import { TRANSACTION } from '../models/Wallet/transaction.model';

// Run every hour
cron.schedule('0 * * * *', async () => {
    console.log('Running balance update cron job...');
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    try {
        // Step 1: Get approved applicants whose status was updated over 24h ago
        const approvedApplicants = await QUEST_APPLICANT.find({
            status: 'approved',
            updatedAt: { $lte: oneDayAgo }
        });

        if (!approvedApplicants.length) {
            console.log('No approved applicants to process.');
            return;
        }

        // Step 2: Get average amount for each quest
        const questIds = [...new Set(approvedApplicants.map(app => app.quest.toString()))];
        const quests = await QUESTS.find({ _id: { $in: questIds } }).select('avgAmountPerPerson');

        const questAmountMap = new Map(quests.map(q => [q._id.toString(), q.avgAmountPerPerson]));

        // Step 3: Prepare bulk wallet updates and transaction creations
        const walletBulkOps = [];
        const transactionsToCreate = [];

        for (const applicant of approvedApplicants) {
            const questId = applicant.quest.toString();
            const userId = applicant.user;
            const amount = questAmountMap.get(questId) || 0;

            // Skip if amount is 0
            if (amount <= 0) continue;

            // Update wallet balances
            walletBulkOps.push({
                updateOne: {
                    filter: { user: userId },
                    update: {
                        $inc: {
                            availableBalance: amount,
                            reservedBalance: -amount,
                            totalEarning: amount,
                            completedQuests: 1
                        }
                    }
                }
            });

            // Prepare transaction entry
            transactionsToCreate.push({
                user: userId,
                type: 'deposit',
                amount,
                description: `Earning credited for quest ${questId}`,
                quest: questId,
                status: 'succeeded',
                currency: 'USD', // optional: use actual currency from WALLET if needed
            });
        }

        // Step 4: Execute bulk operations
        if (walletBulkOps.length) {
            await WALLET.bulkWrite(walletBulkOps);
            console.log(`✅ Updated ${walletBulkOps.length} wallets.`);

            await TRANSACTION.insertMany(transactionsToCreate);
            console.log(`✅ Logged ${transactionsToCreate.length} deposit transactions.`);
        }

    } catch (error) {
        console.error('❌ Error during balance update cron job:', error);
    }
});
