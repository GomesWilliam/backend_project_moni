const functions = require('firebase-functions');
const app = require('express')();

const FBAuth = require('./util/fbAuth');


const { signup, login, uploadImage, pcdsignup, allInfoUser, emailinfo} = require('./handlers/users');
const { inscricaoAcompAdm, infoPCD, allInfoPCD, allAcompInfo } = require('./handlers/acomps');

//allowing cors
const cors = require('cors');
app.use(cors({ origin: true }));

// Add middleware to authenticate requests
//app.use(myMiddleware);


//users routes
app.post('/signup', signup);
app.post('/login', login);
app.post('/user/image', FBAuth, uploadImage);
app.post('/cadastrarpcd', pcdsignup);
app.get('/alluserinfo/', allInfoUser);
app.post('/emailinfo/', emailinfo);

//PCD routes
app.post('/cadastrardisciplina', inscricaoAcompAdm);
app.get('/pcdinfo/:pcdId', infoPCD);
app.get('/allpcdinfo/', allInfoPCD);
app.get('/allacompinfo', allAcompInfo)

exports.api = functions.https.onRequest(app);
