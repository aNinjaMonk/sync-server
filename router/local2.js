
const express = require('express');
const router = express.Router();
const uuid = require('uuid/v4');

const { User1, Transaction1 } = require('../db/Model2');
const { UserRemote, TransactionRemote } = require('../db/Remote');

router.post('/user', (req,res) => {
  User1.create({id: uuid(), firstName: "Abhijeet", lastName: "Goel",syncState: 1})
    .then((user)=> res.send(user));
});

router.get('/user', (req,res) => {
  User1.findAll().then(users => res.send(users));
});

router.put('/user', (req,res) => {
  User1.update({syncState: 1},{where: {syncState: 2}})
    .then(() => User1.findAll())
    .then((users) => res.send(users));
});

router.delete('/user', (req,res) => {
  User1.destroy({where: {syncState: 1}})
    .then(() => User1.findAll())
    .then((users) => res.send(users));
});

router.get('/sync', (req,res) => {
  User1.findAll({where: { syncState: 1 }})
    .then(users => {
      const _users = users.map((user) => user.get({plain: true}));
      UserRemote.bulkCreate(_users, {updateOnDuplicate: ['id']})
        .then(() => {
          return UserRemote.findAll();
        }).then(users => {
          users.forEach((user) => {
            var _user = user.get({plain: true});
            User1.update({syncState: 2}, {
              where: { id: _user.id }
            }).then(() => {
              console.log('Synced ID :' + _user.id);
            });
          });
        });
  });

  res.send('Syncing');
});

router.post('/reset', (req,res) => {
  User1.findAll().then(users => {
    for(var i=0;i<users.length;i++){
      var user = users[i].dataValues;
      User1.update({
        syncState: 1
      }, {
        where: {
          id: user.id
        }
      }).then(() => {

      });
    }
    User1.findAll().then(users => console.log(JSON.stringify(users)));
  });
  res.send('Resetting ....');
});

module.exports = router;
