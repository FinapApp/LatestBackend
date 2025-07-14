import cron from 'node-cron';
import { QUEST_APPLICANT } from '../models/Quest/questApplicant.model';
import { QUESTS } from '../models/Quest/quest.model';
import { WALLET } from '../models/Wallet/wallet.model';
import { TRANSACTION } from '../models/Wallet/transaction.model';

cron.schedule('* * * * *', async () => {
    console.log('⏰ Running balance update cron job...');

    const oneDayAgo = new Date(Date.now() - 60);

    try {
        const approvedApplicants = await QUEST_APPLICANT.find({
            status: 'approved',
            isDeposited: false,
            updatedAt: { $lte: oneDayAgo }
        });
        if (!approvedApplicants.length) {
            console.log('🔍 No approved applicants to process.');
            return;
        }

        // 🔍 Extract unique questIds and userIds
        const questIds = [...new Set(approvedApplicants.map(app => app.quest.toString()))];
        const userIds = [...new Set(approvedApplicants.map(app => app.user.toString()))];

        // ✅ Fetch quests and build avgAmount map
        const quests = await QUESTS.find({ _id: { $in: questIds } }).select('avgAmountPerPerson');
        const questAmountMap = new Map(quests.map(q => [q._id.toString(), q.avgAmountPerPerson]));

        // ✅ Fetch all wallets in one query and build userId → wallet map
        const wallets = await WALLET.find({ user: { $in: userIds } });
        const walletMap = new Map(wallets.map(w => [w.user.toString(), w]));

        const walletBulkOps = [];
        const transactionsToCreate = [];
        const applicantIdsProcessed = [];

        for (const applicant of approvedApplicants) {
            try {
                const questId = applicant.quest.toString();
                const userId = applicant.user.toString();
                const amount = questAmountMap.get(questId) || 0;
                if (amount <= 0) continue;

                const existingTxn = await TRANSACTION.findOne({
                    user: userId,
                    quest: questId,
                    amount: amount,
                    type: 'quest',
                    status: 'succeeded'
                });

                if (existingTxn) {
                    console.log(`⚠️ Transaction already exists for user ${userId} and quest ${questId}`);
                    continue;
                }

                const wallet = walletMap.get(userId);
                if (!wallet || wallet.reservedBalance < amount) {
                    console.warn(`⚠️ Skipping user ${userId}, not enough reserved balance`);
                    continue;
                }

                // ✅ Update in-memory wallet balance (optional, to avoid overdrafting if needed)
                wallet.reservedBalance -= amount;

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
                    type: 'quest',
                    amount,
                    description: `Earning credited for quest ${questId}`,
                    quest: questId,
                    status: 'succeeded',
                    currency: 'USD',
                });
                applicantIdsProcessed.push(applicant._id);
            } catch (innerError) {
                console.error(`❌ Error processing applicant ${applicant._id}:`, innerError);
            }
        }

        if (walletBulkOps.length) {
            await WALLET.bulkWrite(walletBulkOps);
            console.log(`✅ Updated ${walletBulkOps.length} wallets.`);

            await TRANSACTION.insertMany(transactionsToCreate);
            console.log(`✅ Logged ${transactionsToCreate.length} deposit transactions.`);

            await QUEST_APPLICANT.updateMany(
                { _id: { $in: applicantIdsProcessed } },
                { $set: { isDeposited: true } }
            );
            console.log(`✅ Marked ${applicantIdsProcessed.length} applicants as deposited.`);
        }

    } catch (error) {
        console.error('❌ Error during balance update cron job:', error);
    }
});
