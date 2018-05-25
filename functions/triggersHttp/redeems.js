const functions = require('firebase-functions');
const validator = require('../validator')
const redeemRequester = require('../database/redeem-request')

const createRedeem = (data, context) => {
  // Checking that the user is authenticated.
  if (!context.auth) {
    
    throw new functions.https.HttpsError('failed-precondition',
    'No se pudo acceder al servicio',
    "Error while verifying Firebase ID token")
  }

  let userOwnerId = context.auth.uid;
  let userId = data.userId
  let couponId = data.couponId

  if(validator.anyValueNull([userId,couponId]) || 
    !validator.areValuesTypeOf([userId,couponId],'string'))
    {
         throw new functions.https.HttpsError('invalid-argument',
          'Ocurrió un problema con el servidor',
         "parsing exception, missing parameters or some wrong typeof")
    }
  
  //validar cupon pertenesca al dueño
  return validator.validateCouponOwner(couponId,userOwnerId).then(() => {

      //validar que este activo   
    return validator.validateCouponActive(couponId).then(()=>{

      //validar que este halla disponibles
      return validator.validateRemainingCoupons(couponId).then(() => {

        //insertar redencion
        return redeemRequester.createRedeem(userId,couponId).then(redeemData => {
           console.log("Redeem Created:",redeemData)
            return redeemData
        }).catch(error => {
          throw error
        })
      }).catch(error => {
        throw error
      })
    }).catch(error =>{
      throw error
    })
  }).catch(error => {
    console.log(error)
    throw new functions.https.HttpsError('internal',
                error.name,
                error.message)
    })
}


module.exports = {
  createRedeem
}