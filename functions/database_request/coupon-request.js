
const admin = require('firebase-admin')
const db = admin.firestore()
const collection = db.collection("coupons")

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
        console.error("Error getting Coupon id:" + id ,err)
        rej(err)
        return
      })
    }) 
}
  
  module.exports = {
    getCoupon
  }
