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
const RatingsObsv = require('./triggersObservers/ratings')

/*
redeemsApp.use(cors({ origin: true }));
redeemsApp.use(cookieParser);
redeemsApp.use(auth);
redeemsApp.post("/",RedeemsHttp.createRedeem)
*/

exports.v1_createRedeem = functions.https.onCall(RedeemsHttp.createRedeem);

exports.inactivateCouponsOfInactiveShop =  ShopsObsv.inactivateCouponsOfInactiveShop

exports.updateShopRendundantData =  ShopsObsv.updateShopRendundantData

exports.prepareNewCoupon =  CouponsObsv.prepareNewCoupon

exports.updateRedeemsCounts =  RedeemsObsv.updateRedeemsCounts

exports.aggregateCouponRanking =  RatingsObsv.aggregateCouponRating

