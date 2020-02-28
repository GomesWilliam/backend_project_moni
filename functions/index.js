const functions = require('firebase-functions');
const app = require('express')();

const FBAuth = require('./util/fbAuth');


const { signup, login, uploadImage, pcdsignup } = require('./handlers/users');


//users routes
app.post('/signup', signup);
app.post('/login', login);
app.post('/user/image', FBAuth, uploadImage);
app.post('/cadastrarpcd', pcdsignup);

exports.api = functions.https.onRequest(app);
