
function deleteShop(req,res){
    res.status(200).send("deleted:  " + req.params.id)
}

function createShop(req,res){
    res.status(200).json(req.body)
}

module.exports = {
    deleteShop,
    createShop
}