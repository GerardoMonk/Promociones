
const admin = require('firebase-admin');
const db = admin.firestore()


function deleteShop(req,res){
    let shopId =  req.params.id

    let document =  db.collection('shops').doc(shopId)

    var getDoc = document.get().then(doc => {
        if (doc.exists) {
            document.delete()

            let result = { status:200,
                message:"shop: " + doc.id + " deleted",
                doc:doc.data()
            }
            res.status(200).json(result)
        } else {
            let result = { status:400,
                error:"shop: " + doc.id + " doesnt exist"
              }
            res.status(400).json(result)  
            console.log("delete","shop: " + doc.id + " doesnt exist")
            }
            return
    })
    .catch(err => {
        let result = { status:500,
            error:err
          }
        res.status(500).json(result)    
        console.log("delete",err)
        return
        });
}

module.exports = {
    deleteShop,
}