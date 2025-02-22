// import { Notification } from '../api/notifications/models'
// import helpers from './helpers'
// import { NotificationData } from './types'
// import { Session } from '../api/sessions/models'
// import { Story } from '../api/stories/models'
// import { RecentQuest } from '../api/quests/recent/models'
// import { USER, IUser } from '../models/User/user.model'



// async function deleteExpiredStories() {
//   try {
//     const now = new Date();
//     const expiredStories = await Story.find({ expirationTime: { $lte: now } }).select('_id userId');

//     if (expiredStories.length === 0) {
//       console.log('✅ No expired stories to delete.');
//       return;
//     }

//     let deleteCount = 0;
//     for (const story of expiredStories) {
//       try {
//         await Story.deleteOne({ _id: story._id });

//         const result = await USER.updateOne(
//           { _id: story.userId },
//           { $inc: { storiesCount: -1 } }
//         );
//         if (result.modifiedCount === 1) {
//           deleteCount++;
//         } else {
//           console.warn(`⚠️ Warning: Could not decrement storiesCount for user: ${story.userId}`);
//         }
//       } catch (error) {
//         console.error(`Error deleting story with ID ${story._id}:`, error);
//       }
//     }
//     console.log(`✅ Done: ${deleteCount} stories deleted.`);
//   } catch (error) {
//     console.error('Error deleting expired stories:', error);
//   }
// }



// // _reel.user as unknown as IUser,
// //   'A user has posted a comment on your flick',
// //   `${user.username} posted a comment on your flick`,
// // {
// //   category: 'comment',
// //   comment: _comment,
// //   user2: user
// // }
// async function sendPushNotification(user: IUser, title: string, message: string, data: NotificationData, addToList: boolean = true, isSilent: boolean = false) {
//   try {
//     const notificationData = {
//       user2: data.user2?._id.toString(),
//       battle: data.battle?._id.toString(),
//       reel: data.reel?._id.toString(),
//       comment: data.comment?._id.toString(),
//       like: data.like?._id.toString(),
//       reaction: data.reaction,
//       battleRequest: data.battleRequest?._id.toString(),
//       follower: data.follower?._id.toString(),
//       song: data.song?._id.toString(),
//       messaging: data.messaging?._id.toString(),
//       dataString: data.dataString,
//       category: data.category,
//     };
//     for (const [key, value] of Object.entries(notificationData)) {
//       if (!value) {
//         // @ts-ignore
//         delete notificationData[key];
//       }
//     }
//     const sessions = await Session.find({ user: user._id }, "fcmToken");
//     const tokens = sessions.map((e: { fcmToken: string }) => e.fcmToken)
//     const promises = tokens.map(token => helpers.sendPushNotification(token!, title, message, notificationData, addToList, isSilent));
//     await Promise.all(promises);

//     if (addToList) {
//       await Notification.create({
//         user: user._id,
//         title,
//         message,
//         ...notificationData,
//       });
//     }
//   } catch (error) {
//     console.log(error);
//   }
// }


// const services = {
//   expirePendingBattles,
//   expirePendingBattleRequests,
//   deleteExpiredStories,
//   deleteOldQuestSearches,
//   sendPushNotification
// }

// export default services
