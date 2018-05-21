const functions = require('firebase-functions');

const admin = require('firebase-admin');
admin.initializeApp();

const cookieParser = require('cookie-parser')();
const cors = require('cors');

const express = require("express");
const redeemsApp = express();
const auth = require('./midlewares/auth')
const RedeemsHttp = require('./triggersHttp/redeems')
const ShopsObsv = require('./triggersObservers/shops')
const CouponsObsv = require('./triggersObservers/coupons')
const RedeemsObsv = require('./triggersObservers/redeems')




redeemsApp.use(cors({ origin: true }));
redeemsApp.use(cookieParser);
redeemsApp.use(auth);
redeemsApp.post("/",RedeemsHttp.createRedeem)

exports.v1_redeems= functions.https.onRequest(RedeemsHttp.createRedeem)

exports.prueba = functions.https.onCall(RedeemsHttp.prueba);

exports.inactivateCouponsOfInactiveShop =  ShopsObsv.inactivateCouponsOfInactiveShop

exports.updateShopRendundantData =  ShopsObsv.updateShopRendundantData

exports.prepareNewCoupon =  CouponsObsv.prepareNewCoupon

exports.updateRemainingCoupons =  RedeemsObsv.updateRemainingCoupons

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