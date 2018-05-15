const functions = require('firebase-functions');
const express = require("express");
//const cors = require('cors');
const Shops = require('./controllers/Shops')
const shopApp = express();

// Automatically allow cross-origin requests
//app.use(cors({ origin: true }));

// Add middleware to authenticate requests
//app.use(myMiddleware);

shopApp.delete("/:id",Shops.deleteShop)
shopApp.post("/",Shops.createShop)

exports.v1_shops = functions.https.onRequest(shopApp)
