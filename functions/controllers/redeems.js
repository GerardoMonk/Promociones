
const validator = require('../validator')
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
          return res.status(400).json({code:400,response:"Ok"})
          
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