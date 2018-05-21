
let assert = require('assert')

function makeRedundantShopData(shopDoc){
    return { shop:{
        name:shopDoc.data().name || null,
        address:shopDoc.data().address || null,
        categoryId:shopDoc.data().categoryId || null,
     }
   }
 }

 function hasChangedSomeDataOnShop(newValue,oldValue){
   
     try {
        assert.deepEqual(newValue.name,oldValue.name)
        assert.deepEqual(newValue.address,oldValue.address)
        assert.deepEqual(newValue.categoryId,oldValue.categoryId)
     } catch (assertErro) {
         return true
     }
    
    return false
 }



 module.exports = {
    makeRedundantShopData,
    hasChangedSomeDataOnShop
 }