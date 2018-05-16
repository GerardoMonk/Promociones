
const validator = require('../validator')
const redeemRequester = require('../database_request/redeem-request')


const createRedeem = (req, res) => {
  let userOwnerId = req.user.uid
  let userId = req.body.userId
  let couponId = req.body.couponId

  if(validator.anyValueNull([userId,couponId]) || 
    !validator.areValuesTypeOf([userId,couponId],'string'))
    {
      res.status(400).json({code:400,error:{description:"parsing exception, missing parameters or some wrong typeof",
                                              userMessage:"Ocurrió un problema con el servidor"}});	
    }
  
  //validar cupon pertenesca al dueño
  validator.validateCouponOwner(couponId,userOwnerId).then(() => {

      //validar que este activo   
    return validator.validateCouponActive(couponId).then(()=>{

      //validar que este halla disponibles
      return validator.validateRemainingCoupons(couponId).then(() => {
        
        //insertar redencion
        return redeemRequester.createRedeem(userId,couponId).then(redeemData => {
            return res.status(200).json({code:200,redeem:redeemData})
        }).catch(err => {
          console.log("Error creating redeem:", err)
          return res.status(400).json({code:400,error:{description:"Error creating redeem: "+err,
            userMessage:"No se pudo redimir, intenta más tarde"}})
        })
          
      }).catch(error => {
        return res.status(400).json({code:400,error:{description:error.message,
          userMessage:"El cupón está agotado"}})
      })
    }).catch(error =>{
      return res.status(400).json({code:400,error:{description:error.message,
        userMessage:"El cupón no es vigente"}})
    })
  }).catch(error => {
    return res.status(400).json({code:400,error:{description:error.message,
                         userMessage:"El cupón no pertenece alguno de tus comercios"}})
     
  })
}

module.exports = {
  createRedeem
}