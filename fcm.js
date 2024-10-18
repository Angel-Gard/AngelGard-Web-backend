


// const sendNotification = async (token) => {
//   try {
//     const title = 'Angel Guard';
//     const body = '아이의 상태를 확인해 주세요';

//     const response = await admin.messaging().send({
//       token: token,
//       notification: {
//         title: title,
//         body: body,
//       },
//     });
//     console.log('Successfully sent message:', response);
//     return response;  // Return response for further handling in app.js
//   } catch (error) {
//     console.error('Error sending message:', error);
//     throw error;  // Propagate error to be handled in app.js
//   }
// };

// // Export the connect function and sendNotification function
// module.exports = {
//   connect,
//   sendNotification,
// };
