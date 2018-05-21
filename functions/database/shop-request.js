
const admin = require('firebase-admin');
const db = admin.firestore()
const collection = db.collection("shops")

const getShop = (id) => {
    return new Promise((res,rej) => {
      var docRef = collection.doc(id);

      return docRef.get().then( doc => {
        if (doc.exists) {
          res(doc)
       } else {
            rej(new Error("No such shop " + id))
        }
      return
      }).catch(err =>{
        console.log("Error getting Shops", err)
         rej(err)
         return
      })
    }) 
}
  
  module.exports = {
    getShop
  }
