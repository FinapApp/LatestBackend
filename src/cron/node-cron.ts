import cron from 'node-cron';
import { QUEST_APPLICANT } from '../models/Quest/questApplicant.model';
import { QUESTS } from '../models/Quest/quest.model';
import { WALLET } from '../models/Wallet/wallet.model';

// Run every hour
cron.schedule('0 * * * *', async () => {
    console.log('Running balance update cron job...');
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    try {
        // Fetch approved applicants updated over a day ago
        const approvedApplicants = await QUEST_APPLICANT.find({
            status: 'approved',
            updatedAt: { $lte: oneDayAgo }
        });
        const questIds = [...new Set(approvedApplicants.map(app => app.quest.toString()))];
        const quests = await QUESTS.find({
            _id: { $in: questIds }
        }).select('avgAmountPerPerson');

        const questAmountMap = new Map(quests.map(q => [q._id.toString(), q.avgAmountPerPerson]));

        const walletBulkOps = approvedApplicants.map(applicant => {
            const amount = questAmountMap.get(applicant.quest.toString()) || 0;
            return {
                updateOne: {
                    filter: { user: applicant.user },
                    update: {
                        $inc: {
                            availableBalance: amount,
                            reservedBalance: -amount,
                            totalEarning: amount,
                            completedQuests: 1
                        }
                    }
                }
            };
        });
        if (walletBulkOps.length) {
            await WALLET.bulkWrite(walletBulkOps);
            console.log(`✅ Updated ${walletBulkOps.length} wallets.`);
        } else {
            console.log('No approved applicants to process.');
        }
    } catch (error) {
        console.error('❌ Error during balance update cron job:', error);
    }
});
