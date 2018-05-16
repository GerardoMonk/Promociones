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