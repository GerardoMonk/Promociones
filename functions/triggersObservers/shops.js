const functions = require('firebase-functions');
const couponRequester = require('../database/coupon-request')
const RendundatData = require('../database/rendundantData')

let inactivateCouponsOfInactiveShop= functions.firestore
    .document('shops/{shopID}')
    .onUpdate(event => {

        const newValue = event.after.data();

        const previousValue = event.before.data();

        //validar que el cambio este en el campo active y halla cambiado a false
      
        if  (newValue.active === false && previousValue.active === true)
        {

           return couponRequester.inactivateCouponsFromShop(event.before.id).then(() =>{
            console.log("change coupons to inactive Sussesfull Shop ID:" + event.before.id)
            return 0
           }).catch(err => {
            console.log("Error getting coupons" ,err)
            return 0
           })
          }
        console.log("No Inactivated shop")
        return 0
});


let updateShopRendundantData= functions.firestore
    .document('shops/{shopID}')
    .onUpdate(event => {

        const newValue = event.after.data();

        const previousValue = event.before.data();
        
        if (RendundatData.hasChangedSomeDataOnShop(event.after.data(), event.before.data())){
              return couponRequester.updateShopDataOnAllCoupons(event.after).then(() => {
                console.log("updated All coupons from Shop ID:"+ event.after.id)
                return 0

              }).catch(err =>{
                console.log("error updating Cupons.ShopData Shop ID:"+ event.after.id,err)
                return 0
              })
         }

        console.log("No redundant data changed")
        return 0
});


 module.exports = {
    inactivateCouponsOfInactiveShop,
    updateShopRendundantData
}