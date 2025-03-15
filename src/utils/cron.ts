// import cron from 'node-cron';
// import services from './services';
// import { deleteOldFiles } from './delete_files';


// // ! delete old files every hour
// cron.schedule('0 * * * *', () => {
//   console.log('⚡ Deleting old files!')
//   deleteOldFiles()
//   console.log('✅ done')
// });

// // ! permanently deleting expired stories
// cron.schedule('3 * * * *', async () => {
//   console.log('⚡️ Deleting expired stories!')
//   services.deleteExpiredStories()
// });

// // ! Deleting quest searches older than 60 days
// cron.schedule('0 0 * * *', async () => {
//   console.log('⚡️ Deleting old quest searches!');
//   services.deleteOldQuestSearches();
// });

// export default cron