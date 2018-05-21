const functions = require('firebase-functions');
const CouponRequester = require('../database/coupon-request')

let aggregateCouponRating = functions.firestore
    .document('ratings/{rankinId}')
    .onCreate(rankingDoc => {
        let couponId = rankingDoc.data().couponId
       // let userId = rankingDoc.data().userId
         var ratingVal = rankingDoc.data().rating;
        return CouponRequester.aggregateCouponRating(couponId,ratingVal).then(() => {
              console.log("Transaction  successfully committed! couponId:"+couponId);
              return 0
       }).catch(err =>{
              console.log("Transaction failed: ", err);
             return 0
        })
});

 module.exports = {
    aggregateCouponRating
}