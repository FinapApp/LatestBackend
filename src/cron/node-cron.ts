import cron from 'node-cron';
import { QUEST_APPLICANT } from '../models/Quest/questApplicant.model';
import { QUESTS } from '../models/Quest/quest.model';
import { WALLET } from '../models/Wallet/wallet.model';
import { TRANSACTION } from '../models/Wallet/transaction.model';

cron.schedule('* * * * *', async () => {
    console.log('Running balance update cron job...');
    const oneDayAgo = new Date(Date.now() - 60)

    try {
        const approvedApplicants = await QUEST_APPLICANT.find({
            status: 'approved',
            updatedAt: { $lte: oneDayAgo }
        });

        if (!approvedApplicants.length) {
            console.log('No approved applicants to process.');
            return;
        }

        const questIds = [...new Set(approvedApplicants.map(app => app.quest.toString()))];
        const quests = await QUESTS.find({ _id: { $in: questIds } }).select('avgAmountPerPerson');
        const questAmountMap = new Map(quests.map(q => [q._id.toString(), q.avgAmountPerPerson]));

        const walletBulkOps = [];
        const transactionsToCreate = [];

        for (const applicant of approvedApplicants) {
            const questId = applicant.quest.toString();
            const userId = applicant.user;
            const amount = questAmountMap.get(questId) || 0;
            if (amount <= 0) continue;

            const existingTxn = await TRANSACTION.findOne({
                user: userId,
                quest: questId,
                amount: amount,
                type: 'deposit',
                status: 'succeeded'
            });

            if (existingTxn) {
                console.log(`⚠️ Transaction already exists for user ${userId} and quest ${questId}`);
                continue;
            }

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

            transactionsToCreate.push({
                user: userId,
                type: 'deposit',
                amount,
                description: `Earning credited for quest ${questId}`,
                quest: questId,
                status: 'succeeded',
                currency: 'USD',
            });
        }

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
