const functions = require('firebase-functions');
const RedeemRequester = require('../database/redeem-request')
const CouponRequester = require('../database/coupon-request')

let updateCouponsStatus = functions.firestore
    .document('redeems/{redeemId}')
    .onCreate(redeemDoc => {
        let couponId = redeemDoc.data().couponId
        let userId = redeemDoc.data().userId

        return CouponRequester.subtractOneRemaingOnCoupon(couponId).then(() => {
              console.log("Transaction Subtract successfully committed! couponId:"+couponId);
              return 0
       }).catch(err =>{
              console.log("Transaction failed: ", err);
             return 0
        })
});


 module.exports = {
    updateCouponsStatus
}