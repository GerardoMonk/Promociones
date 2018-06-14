const functions = require('firebase-functions');
const RedeemRequester = require('../database/redeem-request')
const CouponRequester = require('../database/coupon-request')
const pushNot = require('../pushNotifications/pushNotification')

let updateRedeemsCounts = functions.firestore
    .document('redeems/{redeemId}')
    .onCreate(redeemDoc => {
        let couponId = redeemDoc.data().couponId
        let userId = redeemDoc.data().userId

        return CouponRequester.updateCountsOnCoupon(couponId).then(() => {
              console.log("Transaction Subtract successfully committed! couponId:"+couponId);
              return 0
       }).catch(err =>{
              console.log("Transaction failed: ", err);
             return 0
        })
});


let notificationRedeem = functions.firestore
    .document('redeems/{redeemId}')
    .onCreate(redeemDoc => {
        let couponId = redeemDoc.data().couponId
        let userId = redeemDoc.data().userId

        return CouponRequester.getCoupon(couponId).then((couponDoc) =>{
          let payload = {
            notification: {
              title: "¡Felicidades!",
              body: "Tu promoción '" + couponDoc.data().title +"' ha sido validada",
            },
            data:{
              couponId:couponId,
            }
          };
          return pushNot.sendToUsers([userId], payload).then((result) => {
            console.log(result);
            return 0
           }) .catch(err =>{
            console.log("Failed: ", err);
            return 0
            });
        }).catch(err =>{
          console.log(err);
          return 0
        })

        
});

 module.exports = {
    updateRedeemsCounts,
    notificationRedeem
}