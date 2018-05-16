const admin = require('firebase-admin')

const validateFirebaseIdToken = (req, res, next) => {
  
    if ((!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) &&
        !req.cookies.__session) {
    //  console.error();
      res.status(403).send({code:403,error:{description:"Missing auth",userMessage:"No se pudo acceder al servicio"}});
      return;
    }
  
    let idToken;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      //console.log('Found "Authorization" header');
      // Read the ID Token from the Authorization header.
      idToken = req.headers.authorization.split('Bearer ')[1];
    } else {
     // console.log('Found "__session" cookie');
      // Read the ID Token from cookie.
      idToken = req.cookies.__session;
    }
    admin.auth().verifyIdToken(idToken).then((decodedIdToken) => {
     // console.log('ID Token correctly decoded', decodedIdToken);
      req.user = decodedIdToken;
      return next();
    }).catch((error) => {
      console.error('Error while verifying Firebase ID token:', error);
      res.status(403).send({code:403,error:{description:'Error while verifying Firebase ID token:' + error,userMessage:"No se pudo acceder al servicio"}})
      return
    });
  };

module.exports = validateFirebaseIdToken

