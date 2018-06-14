
const admin = require('firebase-admin');
const pushTokens = require('../database/pushTokens-request');


  function sendPushNotification(tokens, payload) {
    return new Promise((res, rej) => {
     /* for (let i = 0, len = tokens.length; i < len; i++) {
        let token = tokens[i]; */
        admin.messaging().sendToDevice(tokens, payload).catch(err => {
          console.log(`Error sending push notification to tokens: ${tokens} Error:${err}`);
        });
    //}
      res(`Notification Sent ${tokens}`);
    });
  }


  function sendToUsers(users, payload) {
    return new Promise((res, rej) => {
      return pushTokens.getTokensForUsers(users).then(tokens => sendPushNotification(tokens, payload))
        .then(result => res(result))
        .catch(err => rej(err))
    });
  }

  
function sendToTopic(topic, payload) {
  return admin.messaging().sendToTopic(topic,payload)
}


module.exports = {
   sendToUsers,
   sendToTopic
  }