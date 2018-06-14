const admin = require('firebase-admin');
const db = admin.firestore()
const collection = db.collection("pushTokens")

function getTokensForUsers(users) {
    return new Promise((res, rej) => {
      let promises = [];
      let device_tokens = [];
  
      for (let i = 0, len = users.length; i < len; i++) {
        let userID = users[i];
        let userRef = collection.doc(userID);
        promises.push(userRef.get());
      }
  
      //WARNING: if any promise fail, all pomises will be cancelled, i am noob :( 
      Promise.all(promises).then((docs) => {
        docs.forEach(doc => {
          let token = doc.data().token;
          if (token) {
            device_tokens.push(token);
          }
          else {
            console.log(`Error Getting device_token in doc ${doc.id}`);
          }
        });
        res(device_tokens);
        return
      }).catch(err => {
        rej(err)
        return
      });
    });
}

module.exports = {
    getTokensForUsers
}
