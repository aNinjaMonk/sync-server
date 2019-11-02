var express = require('express');
const router = express.Router();
const uuid = require('uuid/v4');

const { User, Transaction, Sequelize } = require('../db/Model1');
const { UserRemote, TransactionRemote } = require('../db/Remote');
const Op = Sequelize.Op;

router.get('/user', (req,res) => {
  User.findOne().then(user => res.send(user));
});

router.post('/user', (req,res) => {
  const { firstName, lastName, syncState } = req.body;
  User.create({id: uuid(), firstName: firstName, lastName: lastName,syncState: syncState})
    .then((user)=> res.send(user))
    .catch((err) => res.send(err));
});

router.put('/user', (req,res) => {
  const { firstName, lastName, syncState } = req.body;
  const id = req.params.userId;
  User.update({firstName, lastName, syncState},{where: {id: id}})
    .then(() => User.findAll({where: {id: id}}))
    .then((users) => res.send(users));
});

router.delete('/user', (req,res) => {

  User.destroy({where: {id: req.params.userId}})
    .then(() => User.findAll())
    .then((users) => res.send(users));
});

router.post('/txn', (req,res) => {
  const { amount, detail, syncState } = req.body;
  Transaction.create({id: uuid(), amount: amount, detail: detail,syncState: syncState, user_id: "240f56ee-f597-4ee7-90b2-ff86c7de9957"})
    .then((txn)=> res.send(txn))
    .catch((err) => res.send(err));
});

router.get('/txn', (req,res) => {
  Transaction.findAll() /*{
    include: [{
      model : User,
      where: {userId: Sequelize.col('user.id')}
    }]})*/
    .then(txns => res.send(txns));
});

router.get('/txn/:txnId', (req,res) => {
  Transaction.findOne({
      where: {
        id: req.params.txnId
      }
    }) /*{
    include: [{
      model : User,
      where: {userId: Sequelize.col('user.id')}
    }]})*/
    .then(txns => res.send(txns));
});

router.put('/txn/:txnId', (req,res) => {
  const { amount, detail, syncState } = req.body;
  Transaction.update({amount, detail, syncState},{where: {id: req.params.txnId}})
    .then(() => Transaction.findAll({where: {id: req.params.txnId}}))
    .then((txns) => res.send(txns));
});

router.delete('/txn', (req,res) => {
  const { userId } = req.body;
  Transaction.destroy({where: {userId: null}})
    .then(() => Transaction.findAll())
    .then((txns) => res.send(txns));
});

router.post('/sync', (req,res) => {
  User.findAll({
    where: { syncState: 1 }
  }).then(users => {
      const _users = users.map((user) => user.get({plain: true}));
      UserRemote.bulkCreate(_users, {updateOnDuplicate: ['id']}).then(() => {
        return UserRemote.findAll();
      }).then(users => {
        users.forEach((user) => {
          var _user = user.get({plain: true});
          User.update({syncState: 2}, {
            where: { id: _user.id }
          }).then(() => {
            console.log('Synced ID : ' + _user.id);
          });
        });
      });
  });

  res.send('Syncing');
});

router.post('/reset', (req,res) => {
  User.findAll().then(users => {
    for(var i=0;i<users.length;i++){
      var user = users[i].dataValues;
      User.update({
        syncState: 1
      }, {
        where: {
          id: user.id
        }
      }).then(() => {

      });
    }
    User.findAll().then(users => console.log(JSON.stringify(users)));
  });
  res.send('Resetting ....');
});

router.get('/test', (req,res) => {
  /*User.create({id: uuid(), firstName: "Test", lastName: "User", syncState: 1})
    .then((user) => user.destroy())
    .then(() => User.findAll())
    .then((users) => res.send(users));*/
  /*User.findByPk("b9bce8a7-cb13-4a73-a24f-296e1c38aeb7")
    .then((user) => res.send(user));*/
  /*User.findAndCountAll({
    where: {
      syncState: {
        [Op.or]: [1,2,3]
      },
      createdAt: {
        [Op.gt]: new Date(2019, 10,2,0,0,0)
      }
    }
  }).then((result) => {
    res.send(result);
  });*/
  User.findAll({limit: 6, offset: 0, order: ['firstName']})
    .then((users) => res.send(users));
});

module.exports = router;
