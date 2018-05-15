const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();
const cookieParser = require('cookie-parser')();
const cors = require('cors');
const express = require("express");
const shopApp = express();
const Shops = require('./controllers/Shops')

/*
// Automatically allow cross-origin requests
shopApp.use(cors({ origin: true }));
shopApp.use(cookieParser);
shopApp.use(validateFirebaseIdToken);

// Add middleware to authenticate requests
//app.use(myMiddleware);
*/
shopApp.delete("/:id",Shops.deleteShop)
shopApp.post("/",Shops.createShop)

exports.v1_shops = functions.https.onRequest(shopApp)

/*
const validateFirebaseIdToken = (req, res, next) => {
    console.log('Check if request is authorized with Firebase ID token');
  
    if ((!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) &&
        !req.cookies.__session) {
      console.error('No Firebase ID token was passed as a Bearer token in the Authorization header.',
          'Make sure you authorize your request by providing the following HTTP header:',
          'Authorization: Bearer <Firebase ID Token>',
          'or by passing a "__session" cookie.');
      res.status(403).send('Unauthorized');
      return;
    }
  
    let idToken;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      console.log('Found "Authorization" header');
      // Read the ID Token from the Authorization header.
      idToken = req.headers.authorization.split('Bearer ')[1];
    } else {
      console.log('Found "__session" cookie');
      // Read the ID Token from cookie.
      idToken = req.cookies.__session;
    }
    admin.auth().verifyIdToken(idToken).then((decodedIdToken) => {
      console.log('ID Token correctly decoded', decodedIdToken);
      req.user = decodedIdToken;
      return next();
    }).catch((error) => {
      console.error('Error while verifying Firebase ID token:', error);
      res.status(403).send('Unauthorized');
    });
  };*/