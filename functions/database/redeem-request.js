
const admin = require('firebase-admin');
const db = admin.firestore()
const collection = db.collection("redeems")

var FieldValue = require('firebase-admin').firestore.FieldValue;


const createRedeem = (userId,couponId) => {
    return new Promise((res,rej) => {

        let redeemDocData =  {
            userId: userId,
            couponId: couponId,
            createdAt:FieldValue.serverTimestamp()
        }

        var addDoc = collection.add(redeemDocData).then(ref => {
            res({ userId: userId,
                couponId: couponId,
                redeemId:ref.id})
            return
         }).catch(err => {
            console.log("Error to createRedeem", err)
            rej(err)
            return
         })
    })
}
  
module.exports = {
   createRedeem
}
