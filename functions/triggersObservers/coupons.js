const functions = require('firebase-functions');
const RendundatData = require('../database/rendundantData')
const CouponRequester = require('../database/coupon-request')
const ShopRequester = require('../database/shop-request')

let prepareNewCoupon = functions.firestore
    .document('coupons/{couponID}')
    .onCreate(couponDoc => {
        let shopId = couponDoc.data().shopId

        return ShopRequester.getShop(shopId).then(shopDoc =>{
            CouponRequester.updateShopDataOnCoupon(couponDoc,shopDoc)
            CouponRequester.updateCouponActiveStatus(couponDoc,true)
            CouponRequester.createTimestamp(couponDoc)
            if (couponDoc.data().type.type === "limited"){
              CouponRequester.createRemainingOnCoupon(couponDoc)
            }
            return 0
        }).catch(err =>{
            console.log("error getting Shop ID:"+ shopId ,err)
            return 0
        })
});


 module.exports = {
    prepareNewCoupon
}