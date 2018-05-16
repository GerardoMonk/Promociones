const functions = require('firebase-functions');

const admin = require('firebase-admin');
admin.initializeApp();

const cookieParser = require('cookie-parser')();
const cors = require('cors');

const express = require("express");
const redeemsApp = express();
const auth = require('./midlewares/auth')
const Redeems = require('./controllers/redeems')

redeemsApp.use(cors({ origin: true }));
redeemsApp.use(cookieParser);
redeemsApp.use(auth);
redeemsApp.post("/",Redeems.createRedeem)

exports.v1_redeems= functions.https.onRequest(redeemsApp)


exports.v1_updateUser = functions.firestore
    .document('shops/{shopID}')
    .onUpdate(event => {
        // Get an object representing the document
        // e.g. {'name': 'Marie', 'age': 66}
        const newValue = event.data.data();

        // ...or the previous value before this update
        const previousValue = event.data.previous.data();


        
        // access a particular field as you would any JS property
        const name = newValue.name;

        // perform desired operations ...

        //validar que el cambio este en el campo isActive y halla cambiado a false

        //Ir por todos los cupones de ese shop

        //cambiar el isActive a false de todos los cupones
    });

/*
    exports.aggregateRatings = firestore
  .document('restaurants/{restId}/ratings/{ratingId}')
  .onWrite(event => {
    // Get value of the newly added rating
    var ratingVal = event.data.get('rating');

    // Get a reference to the restaurant
    var restRef = db.collection('restaurants').document(event.params.restId);

    // Update aggregations in a transaction
    return db.transaction(transaction => {
      return transaction.get(restRef).then(restDoc => {
        // Compute new number of ratings
        var newNumRatings = restDoc.data('numRatings') + 1;

        // Compute new average rating
        var oldRatingTotal = restDoc.data('avgRating') * restDoc.data('numRatings');
        var newAvgRating = (oldRatingTotal + ratingVal) / newNumRatings;

        // Update restaurant info
        return transaction.update(restRef, {
          avgRating: newAvgRating,
          numRatings: newNumRatings
        });
      });
    });
});
*/