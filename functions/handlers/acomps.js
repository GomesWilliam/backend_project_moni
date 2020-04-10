const { db } = require('../util/Admin');


//Create a list of monitoring
exports.inscricaoAcompAdm = (req, res) => {
  const newinscricaoAdm = {
    ra_pcd: req.body.ra_pcd,
    disciplina: req.body.disciplina,
    aulaTeoria1: req.body.aulaTeoria1,
    horasTeoria1: req.body.horasTeoria1,
    aulaTeorica2: req.body.aulaTeorica2,
    horasTeoria2: req.body.horasTeoria2,
    aulaTeorica3: req.body.aulaTeorica3,
    horasTeoria3: req.body.horasTeoria3,
    docenteTeoria: req.body.docenteTeoria,
    aulaPratica1: req.body.aulaPratica1,
    horasPratica1: req.body.horasPratica1,
    aulaPratica2: req.body.aulaPratica2,
    horasPratica2: req.body.horasPratica2,
    aulaPratica3: req.body.aulaPratica3,
    horasPratica3: req.body.horasPratica3,
    docentePratica: req.body.docentePratica,
    turno: req.body.turno,
    quadAtual: req.body.quadAtual,
    anoAtual: req.body.anoAtual
  }

    const inscricaoAdm = {
      ra_pcd: newinscricaoAdm.ra_pcd,
      disciplina: newinscricaoAdm.disciplina,
      aulaTeoria1: newinscricaoAdm.aulaTeoria1,
      horasTeoria1: newinscricaoAdm.horasTeoria1,
      aulaTeorica2: newinscricaoAdm.aulaTeorica2,
      horasTeoria2: newinscricaoAdm.horasTeoria2,
      aulaTeorica3: newinscricaoAdm.aulaTeorica3,
      horasTeoria3: newinscricaoAdm.horasTeoria3,
      docenteTeoria: newinscricaoAdm.docenteTeoria,
      aulaPratica1: newinscricaoAdm.aulaPratica1,
      horasPratica1: newinscricaoAdm.horasPratica1,
      aulaPratica2: newinscricaoAdm.aulaPratica2,
      horasPratica2: newinscricaoAdm.horasPratica2,
      aulaPratica3: newinscricaoAdm.aulaPratica3,
      horasPratica3: newinscricaoAdm.horasPratica3,
      docentePratica: newinscricaoAdm.docentePratica,
      turno: newinscricaoAdm.turno,
      quadAtual: newinscricaoAdm.quadAtual,
      anoAtual: newinscricaoAdm.anoAtual
    }


    db
      .collection('acompanhamentos')
      .add(inscricaoAdm)
      .then(() => {
        return res.json({ message: 'Materia Cadastrada' });
        console.log("Materia cadastrada");
      })
      .catch(err => {
        console.error(err);
      });
};

// get PCD information
exports.infoPCD = (req, res) => {
  let pcdData = {}
  db.doc(`/pcds/${req.params.pcdId}`).get()
    .then(doc => {
      if (!doc.exists) {
        console.log('No such document!');
        return res.status(404).json({message: 'Documento não encontrado'})
      }else {
        pctData = doc.data()
        return res.json(doc.data());
      }
    })
    .catch(err => {
      console.error(err);
      return res.json({message: 'Não foi possivel realizar operacao'})
    });
};

exports.allInfoPCD = (req, res) => {
  db.collection('pcds')
    .orderBy('nome', 'asc')
    .get()
    .then((data) => {
      let info = [];
      data.forEach((doc) => {
        info.push({
          pcdId: doc.id,
          nome: doc.data().nome,
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

exports.allAcompInfo = (req, res) => {
  db.collection('acompanhamentos')
    .orderBy('disciplina', 'asc')
    .get()
    .then((data) => {
      let info = [];
      data.forEach((doc) => {
        info.push({
          pcdId: doc.id,
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
