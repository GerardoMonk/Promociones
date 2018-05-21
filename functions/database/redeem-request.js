
const admin = require('firebase-admin');
const db = admin.firestore()
const collection = db.collection("redeems")
const collectionCoupon = db.collection("coupons")

var FieldValue = require('firebase-admin').firestore.FieldValue;


const redeemCoupon = (userId,couponId) => {
    return new Promise((res,rej) => {

        let coupRef = collectionCoupon.doc(couponId)

        return db.runTransaction(function(transaction) {
            // This code may get re-run multiple times if there are conflicts.
            return transaction.get(coupRef).then(function(couponDoc) {
                if (!couponDoc.exists) {
                    throw "Document does not exist!";
                }
        
                var newPopulation = sfDoc.data().population + 1;
                transaction.update(sfDocRef, { population: newPopulation });
            });
        })

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
