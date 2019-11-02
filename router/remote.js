var express = require('express');
const router = express.Router();

const { UserRemote, TransactionRemote } = require('../db/Remote');
const { User, Transaction, Sequelize } = require('../db/Model1');
//const { User1, Transaction1 } = require('../db/Model2');

/*router.get('/create', (req,res) => {
  UserRemote.create({firstName: "Imon", lastName: "Raza", syncState: 1})
    .then(user => res.send(user));
});

router.get('/user', (req,res) => {
  UserRemote.findAll()
    .then(users => res.send(users));
});

router.put('/user', (req,res) => {
  UserRemote.update({syncState: 2},{where: {syncState: 1}})
    .then(() => UserRemote.findAll())
    .then((users) => res.send(users));
});

router.delete('/user', (req,res) => {
  UserRemote.destroy({where: {syncState: 1}})
    .then(() => res.send("Deleted"));
});

router.get('/txn', (req,res) => {
  TransactionRemote.findAll() /*{
    include: [{
      model : User,
      where: {userId: Sequelize.col('user.id')}
    }]})
    .then(txns => res.send(txns));
});
*/

router.post('/sync', (req,res) => {
  UserRemote.findAll({where: { syncState: 2 }}).then((users) => {
    for(var i=0;i<users.length;i++){
        var user = users[i].dataValues;
        console.log("Syncing ID:" + user.id);
        User.create(user).then((user) => {
          console.log('Create Record ID :', user.id);
        });
        UserRemote.update({syncState: 1}, {
          where: { id: user.id }
        }).then(() => {
          console.log('Synced');
        });
    }
    User.findAll().then(users => console.log(JSON.stringify(users)));
  });
  res.send('Syncing Remote DB');
});

router.post('/reset', (req,res) => {
  UserRemote.findAll().then(users => {
    for(var i=0;i<users.length;i++){
      var user = users[i].dataValues;
      UserRemote.update({
        syncState: 1
      }, {
        where: {
          id: user.id
        }
      }).then(() => UserRemote.findAll())
        .then(users => res.send(users));
    }
  });
});

module.exports = router;
