// import admin from '../config/firebase/firebase.config';
// import { notifyBugsnagError } from '../config/bugsnag/bugsnag.config';

// export const sendNotifications = async (tokens: any, title: string, body: string, image: string, content_available: boolean) => {
//     const messages: any = {
//         tokens: tokens,
//         notification: {
//             title,
//             body,
//         },
//         data: content_available ? { image } : {},
//     };

//     try {
//         const response = await admin.messaging().sendMulticast(messages);
//         if (response.failureCount > 0) {
//             const failedTokens: any = [];
//             response.responses.forEach((resp, idx) => {
//                 if (!resp.success) {
//                     failedTokens.push(tokens[idx]);
//                 }
//             });
//             return failedTokens;
//         }
//         return [];
//     } catch (error: any) {
//         notifyBugsnagError(error);
//         throw error;
//     }
// };