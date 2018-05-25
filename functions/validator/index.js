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
                    let error = new Error("shop.userId " + shop.data().userId + " no match with userId " + userId)
                    error.name = "WRONG_OWNER"
                    console.log(error.name)
                    rej(error)
                }
                return
             }).catch( err =>{
                 let error = new Error("Error getting shop: " + err)
                 error.name = "SERVER_ERROR"
                 console.log(error.name)
                rej(error)
                return
             })
    
        }).catch(err =>{
            let error =new Error("Error getting coupon: " + err)
            error.name = "SERVER_ERROR"
            console.log(error.name)
            rej(error)
            return
        })
    }) 
  }


  const validateCouponActive = (cuponID) => {
    return new Promise((res,rej) => {
        let cuponReq = Cupons.getCoupon(cuponID)

        return cuponReq.then( coupon => {
             if (coupon.data().active){
                 res()
             }else{
                let error = new Error("Coupon is inactive id:"+cuponID )
                error.name = "INACTIVE_COUPON"
                console.log(error.message)
                 rej(error)
             }
             return
        }).catch(err =>{
            let error = new Error("Error getting coupon: " + err)
            error.name = "SERVER_ERROR"
            console.log(error.message)
            rej(error)
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
                    let error = new Error("Coupon is out of stock")
                    error.name = "OUT_OF_STOCK"
                    console.log(error.message)
                    rej(error)
                 }else{
                    res()
                }
             }
             else{
                let error = new Error("Invalid coupon type:" + coupon.data().type.type)
                error.name = "SERVER_ERROR"
                console.log(error.message)
                rej(error)
             }
             return
        }).catch(err =>{
            let error = new Error("Error getting coupon: " + err)
            error.name = "SERVER_ERROR"
            rej(error)
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

