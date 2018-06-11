const admin = require('firebase-admin')
const db = admin.firestore()


const collection = db.collection("coupons")
var Validator = require("../validator")

const RendundatData = require('./rendundantData')
var FieldValue = require('firebase-admin').firestore.FieldValue;

const getCoupon = (id) => {
    return new Promise((res,rej) => {
      var docRef = collection.doc(id)

     return docRef.get().then( doc => {
        if (doc.exists) {
          res(doc)
      } else {
          rej(new Error("No such Coupon: " + id))
      }
      return
      }).catch(err =>{
        console.log("Error getting Coupon" ,err)
        rej(err)
        return
      })
    }) 
}

const inactivateCouponsFromShop = (idShop) => {
  return new Promise((res,rej) => {
   let query = collection.where('shopId','==',idShop).where('active', '==', true)

   return query.get().then( coupons => {
      coupons.forEach(element =>{
        updateCouponActiveStatus(element,false)
        console.log("Changed cuopon.active to false ID:" ,element.id)
      })
     res()
     return
    }).catch(err =>{
      console.log("Error getting coupons idShop:" ,idShop)
      rej(err)
      return
    })
  }) 
}


const updateCouponActiveStatus = (couponDoc,isActive) => {
    couponDoc.ref.update({active:isActive})
    console.log("Updated cuopon active to:" +isActive + " ID: " + couponDoc.id)
   return 
}

const updateShopDataOnAllCoupons = (shopDoc) => {
  return new Promise((res,rej) => {
   let query = collection.where('shopId','==',shopDoc.id)

   return query.get().then( coupons => {
      coupons.forEach(element =>{
        updateShopDataOnCoupon(element,shopDoc)
      })
     res()
     return
    }).catch(err =>{
      console.log("Error getting coupons in Shop ID:" ,shopDoc.id)
      rej(err)
      return
    })
  }) 
}


const updateShopDataOnCoupon = (couponDoc,shopDoc) => {
   couponDoc.ref.update(RendundatData.makeRedundantShopData(shopDoc))
   console.log("Updated cuopon.shop ID: " + couponDoc.id)
  return 
}

const createRemainingOnCoupon = (couponDoc) => {

  couponDoc.ref.update({
    "type.remaining":couponDoc.data().type.limit || null
  })

  console.log("Updated remanings cuopon ID: " + couponDoc.id)
 return 
}

const createTimestamp = (couponDoc) => {
  couponDoc.ref.update({
    createAt:FieldValue.serverTimestamp()
  })

  console.log("Create createdAt cuopon.shop ID: " + couponDoc.id)
 return 
}

const updateCountsOnCoupon = (couponId) => {
      var docRef = collection.doc(couponId);

          return  db.runTransaction(function(transaction) {
            // This code may get re-run multiple times if there are conflicts.
            return transaction.get(docRef).then(function(doc) {
                if (!doc.exists) {
                    throw Error("Document does not exist! couponId:" + couponId);
                }

                if (doc.data().type.type === "limited"){
                  var newRemaining = doc.data().type.remaining - 1
                   transaction.update(docRef, { "type.remaining": newRemaining || 0})
                   
                   if (newRemaining === 0) {
                    updateCouponActiveStatus(doc,false)
                    console.log("coupon inactivated remaining = 0 couponId:" + couponId)
                   }
                }
                var redeems = doc.data().numRedeems
                if (!redeems){
                   redeems = 0
                }
                var newRedeems = redeems + 1
                transaction.update(docRef, { "numRedeems": newRedeems})
                return
            });
          })
}

const aggregateCouponRating = (couponId,ratingVal) => {
     var docRef = collection.doc(couponId);

      return  db.runTransaction(function(transaction) {
        // This code may get re-run multiple times if there are conflicts.
        return transaction.get(docRef).then(function(doc) {
            if (!doc.exists) {
                throw Error("Document does not exist! couponId:" + couponId)
            }

            if (typeof ratingVal !== 'number')
            {
              throw Error("ratingVal is not a number")
            }

            var oldNumRatings =  doc.data().numRatings || 0 
            var newNumRatings = oldNumRatings + 1
            var oldAvgRating = doc.data().avgRating || 0
            // Compute new average rating
            var oldRatingTotal = oldAvgRating * oldNumRatings;
            var newAvgRating = (oldRatingTotal + ratingVal) / newNumRatings;
    
            // Update restaurant info
            return transaction.update(docRef, {
              avgRating: newAvgRating,
              numRatings: newNumRatings
            });
        });
      })
}


/*


*/
  
  module.exports = {
    getCoupon,
    inactivateCouponsFromShop,
    updateShopDataOnAllCoupons,
    updateShopDataOnCoupon,
    updateCouponActiveStatus,
    createTimestamp,
    createRemainingOnCoupon,
    updateCountsOnCoupon,
    aggregateCouponRating
  }
