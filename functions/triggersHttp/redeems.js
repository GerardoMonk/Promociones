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
            return redeemData
        }).catch(err => {
          console.log("Error creating redeem:", err)
          
          throw new functions.https.HttpsError('internal',
                               "No se pudo redimir, intenta más tarde",
                               "Error creating redeem: "+err)
        })
          
      }).catch(error => {
        throw new functions.https.HttpsError('internal',
            "El cupón está agotado",
            error.message)
      })
    }).catch(error =>{
      throw new functions.https.HttpsError('internal',
              "El cupón no es vigente",
              error.message)

         })
  }).catch(error => {
    throw new functions.https.HttpsError('internal',
                "El cupón no pertenece alguno de tus comercios",
                error.message)
    })
}


module.exports = {
  createRedeem
}