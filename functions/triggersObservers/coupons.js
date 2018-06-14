const functions = require('firebase-functions');
const RendundatData = require('../database/rendundantData')
const CouponRequester = require('../database/coupon-request')
const ShopRequester = require('../database/shop-request')
const pushNot = require('../pushNotifications/pushNotification')
const topics = require('../pushNotifications/topics')


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


let notificationNewCoupon = functions.firestore
    .document('coupons/{couponId}')
    .onUpdate(event => {

        const newValue = event.after.data();

        const previousValue = event.before.data();
        
        if  (newValue.active === true && previousValue.active !== true)
        {
            let payload = {
                notification: {
                  title: newValue.title,
                  body: newValue.description,
                },
                data:{
                  couponId:event.after.id,
                }
              };

              return pushNot.sendToTopic(topics.new_coupons,payload).then((response) =>{
                console.log("Sent",response);
                return 0
              }).catch((err) => {
                console.log("Failed: ", err);
                return 0
              })
    
        }
      console.log("Not is active");
      return 0
});

 module.exports = {
    prepareNewCoupon,
    notificationNewCoupon
}