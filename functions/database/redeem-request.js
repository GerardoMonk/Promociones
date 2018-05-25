
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
            res({ redemm:{
                    id:ref.id,
                    data:{
                        userId: userId,
                        couponId: couponId
                    }
                 } 
                })
            return
         }).catch(err => {
            console.log("Error creating redeem:", err)
            const error = new Error(err); 
            error.name = "SERVER_ERROR"        
            rej(error)
            return
         })
    })
}
  
module.exports = {
   createRedeem
}
