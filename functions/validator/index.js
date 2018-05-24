const Cupons = require("../database/coupon-request") 
const Shops = require("../database/shop-request") 


const validateCouponOwner = (cuponId, userId) => {
    return new Promise((res,rej) => {
        let cuponReq = Cupons.getCoupon(cuponId)

        cuponReq.then( coupon => {
             let shopId =  coupon.data().shopId

             let shopsReq = Shops.getShop(shopId)
    
             return shopsReq.then(shop => {
                if (shop.data().userId === userId){
                    res()
                }else{
                    console.log("shop.userId " + shop.data().userId + " no match with userId " + userId)
                    rej(new Error("shop.userId " + shop.data().userId + " no match with userId " + userId))
                }
                return
             }).catch( err =>{
                console.log("Error getting shop:", err)
                rej(new Error("Error getting shop: " + err))
                return
             })
    
        }).catch(err =>{
            console.log("Error getting coupon:", err)
            rej(new Error("Error getting coupon: " + err))
            return
        })
    }) 
  }


  const validateCouponActive = (cuponID) => {
    return new Promise((res,rej) => {
        let cuponReq = Cupons.getCoupon(cuponID)

        return cuponReq.then( coupon => {
             if (coupon.data().isActive){
                 res()
             }else{
                 rej(new Error("Coupon is inactive"))
             }
             return
        }).catch(err =>{
            console.log("Error getting coupon:", err)
            rej(new Error("Error getting coupon: " + err))
            return
        })
    }) 
  }

  const validateRemainingCoupons = (cuponID) => {
    return new Promise((res,rej) => {
        let cuponReq = Cupons.getCoupon(cuponID)
        return cuponReq.then( coupon => {
             if (coupon.data().type.type === "unlimited"){
                 res()
             }else if(coupon.data().type.type === "limited"){
                 if (coupon.data().type.remaining <= 0){
                    rej(new Error("Coupon is out of stock"))
                 }else{
                    res()
                }
             }
             else{
                rej(new Error("Ivalid coupon type:" + coupon.data().type.type ))
             }
             return
        }).catch(err =>{
            console.log("Error getting coupon:", err)
            rej(new Error("Error getting coupon: " + err))
            return
        })
    }) 
  }

  function anyValueNull(values) {
    for (let i = 0;i<values.length;i++)
    {
       let aux = values[i];
        if  (aux === null)
        {
            return true
        }
    }
    return false;
}

function areValuesTypeOf(values,typeOf) {
    for (let i = 0;i<values.length;i++)
    {
       let aux =  values[i];
        if  (typeof aux !== typeOf)
        {
            return false
        }
    }
    return true;
}
  
  module.exports = {
    validateCouponOwner,
    validateCouponActive,
    validateRemainingCoupons,
    anyValueNull,
    areValuesTypeOf
  }

