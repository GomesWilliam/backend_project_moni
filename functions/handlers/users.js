const { admin, db } = require('../util/Admin');
const config = require('../util/config');
const firebase = require('firebase');

firebase.initializeApp(config)

const { validateSignupData, validateLoginData, validateSignupPCDData} = require('../util/validators');


//create monitor account
exports.signup = (req, res) => {
    const newUser = {
      email: req.body.email,
      password: req.body.password,
      confirmPassword: req.body.confirmPassword,
      ra: req.body.ra,
      nome: req.body.nome,
      sobrenome: req.body.sobrenome,
      ano_ingresso: req.body.ano_ingresso,
      campus: req.body.campus,
      curso_base: req.body.curso_base,
      curso_pos_bi: req.body.curso_pos_bi
    }

    const { valid, errors} = validateSignupData(newUser);

    if(!valid) return res.status(400).json(errors);

    const noImg = 'no-img.png';

    let token, userId;
    db
      .doc(`/users/${newUser.ra}`)
      .get()
      .then(doc => {
        if(doc.exists){
          return res.status(400).json({ ra: 'esse RA já está em uso' });
        } else {
          return firebase
              .auth()
              .createUserWithEmailAndPassword(newUser.email, newUser.password)
        }
      })
      .then(data => {
        userId = data.user.uid;
        return data.user.getIdToken();
      })
      .then(idToken => {
        token = idToken;
        const userCredentials = {
          ra: newUser.ra,
          email: newUser.email,
          createdAt: new Date().toISOString(),
          imageUrl: `https://firebasestorage.googleapis.com/v0/b/${
            config.storageBucket
          }/o/${noImg}?alt=media`,
          userId: userId,
          nome: newUser.nome,
          sobrenome: newUser.sobrenome,
          ano_ingresso: newUser.ano_ingresso,
          campus: newUser.campus,
          curso_base: newUser.curso_base,
          curso_pos_bi: newUser.curso_pos_bi,
          isAdmin: true
        };
        return db
        .doc(`/users/${newUser.ra}`)
        .set(userCredentials);
      })
      .then(() => {
        return res.status(201).json({ token });
      })
      .catch(err => {
        console.error(err);
        if(err.code === 'auth/email-already-in-use'){
          return res.status(400).json({ email: 'Email já está em uso'});
        }else {
          return res.status(500).json({ error: err.code });
        }
      });
  };

//login monitor

  exports.login = (req, res) => {
    const user = {
      email: req.body.email,
      password: req.body.password
    }

    const { valid, errors} = validateLoginData(user);

    if(!valid) return res.status(400).json(errors);
    let id = '';
    let tokenn = '';
    firebase
      .auth()
      .signInWithEmailAndPassword(user.email, user.password)
      .then(data => {
        id = data.user.uid;
        return data.user.getIdToken();
      })
      .then(token => {
        tokken = token;
        //return res.status(201).json({tokenn});
        return db.collection('users').where('email', '==', user.email).get();
      })
      .then((data) => {
        let info = [];
        data.forEach((doc) => {
          info.push({
            userId: doc.id,
            nome: doc.data().nome,
            isAdmin: doc.data().isAdmin,
            all: doc.data()
          });
        });
        return res.json({isAdmin: info[0].isAdmin, token: tokken});
      })
      .catch(err => {
        console.error(err);
        if(err.code === 'auth/wrong-password'){
          return res.status(403).json({general: "Wrong Credentials"})
        } else {
            return res.status(500).json({error: err.code});
        }

      });
  };

// Monitor get info
exports.allInfoUser = (req, res) => {
  db.collection('users')
    .orderBy('nome', 'asc')
    .get()
    .then((data) => {
      let info = [];
      data.forEach((doc) => {
        info.push({
          userId: doc.id,
          nome: doc.data().nome,
          isAdmin: doc.data().isAdmin,
          all: doc.data()
        });
      });
      return res.json(info);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};

//User Info by email
exports.emailinfo = (req, res) => {
  const infoEmail = {
    email: req.body.email
  }
  db.collection('users')
    .where('email', '==', infoEmail.email)
    .get()
    .then((data) => {
      let info = [];
      data.forEach((doc) => {
        info.push({
          userId: doc.id,
          nome: doc.data().nome,
          isAdmin: doc.data().isAdmin,
          all: doc.data()
        });
      });
      return res.json(info);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};











// CREATE PCD INFO
  exports.pcdsignup = (req, res) => {
      const newUser = {
        email: req.body.email,
        ra: req.body.ra,
        nome: req.body.nome,
        sobrenome: req.body.sobrenome,
        ano_ingresso: req.body.ano_ingresso,
        turno: req.body.turno,
        campus: req.body.campus,
        curso_base: req.body.curso_base,
        curso_pos_bi: req.body.curso_pos_bi,
        deficiencia: req.body.deficiencia,
        situacao: req.body.situacao,
        descricao_acompanhamento: req.body.descricao_acompanhamento
      }

      const { valid, errors} = validateSignupPCDData(newUser);

      if(!valid) return res.status(400).json(errors);

      const noImg = 'no-img.png';

      db
        .doc(`/pcds/${newUser.ra}`)
        .get()
        .then(doc => {
          if(doc.exists){
            return res.status(400).json({ ra: 'esse RA já está em uso' });
          } else {
            const userCredentials = {
              ra: newUser.ra,
              email: newUser.email,
              createdAt: new Date().toISOString(),
              imageUrl: `https://firebasestorage.googleapis.com/v0/b/${
                config.storageBucket
              }/o/${noImg}?alt=media`,
              nome: newUser.nome,
              sobrenome: newUser.sobrenome,
              ano_ingresso: newUser.ano_ingresso,
              turno: newUser.turno,
              campus: newUser.campus,
              curso_base: newUser.curso_base,
              curso_pos_bi: newUser.curso_pos_bi,
              deficiencia: newUser.deficiencia,
              situacao: newUser.situacao,
              descricao_acompanhamento: newUser.descricao_acompanhamento,
              statusPcd: 'pcd'
            };
            return db
            .doc(`/pcds/${newUser.ra}`)
            .set(userCredentials);
          }
        })
        .then(() => {
          return res.status(201).json({ message: 'pcd cadastrado' });
        })
        .catch(err => {
          console.error(err);
            return res.status(500).json({ error: err.code });
        });
    };

//upload image
  exports.uploadImage = (req, res) => {
    const BusBoy = require('busboy');
    const path = require('path');
    const os = require('os');
    const fs = require('fs');

    const busboy = new BusBoy({ headers: req.headers });

    let imageToBeUploaded = {};
    let imageFileName;

    busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
      console.log(fieldname, file, filename, encoding, mimetype);
      if (mimetype !== 'image/jpeg' && mimetype !== 'image/png') {
        return res.status(400).json({ error: 'Wrong file type submitted' });
      }
      // my.image.png => ['my', 'image', 'png']
      const imageExtension = filename.split('.')[filename.split('.').length - 1];
      // 32756238461724837.png
      imageFileName = `${Math.round(
        Math.random() * 1000000000000
      ).toString()}.${imageExtension}`;
      const filepath = path.join(os.tmpdir(), imageFileName);
      imageToBeUploaded = { filepath, mimetype };
      file.pipe(fs.createWriteStream(filepath));
    });
    busboy.on('finish', () => {
      admin
        .storage()
        .bucket(`${config.storageBucket}`)
        .upload(imageToBeUploaded.filepath, {
          resumable: false,
          metadata: {
            metadata: {
              contentType: imageToBeUploaded.mimetype
            }
          }
        })
        .then(() => {
          const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${
            config.storageBucket
          }/o/${imageFileName}?alt=media`;
          return db.doc(`/users/${req.user.ra}`).update({ imageUrl });
        })
        .then(() => {
          return res.json({ message: 'image uploaded successfully' });
        })
        .catch((err) => {
          console.error(err);
          return res.status(500).json({ error: 'something went wrong' });
        });
    });
    busboy.end(req.rawBody);
  };
