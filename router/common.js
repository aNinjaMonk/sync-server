var express = require('express');
const router = express.Router();
const uuid = require('uuid/v4');

const { User, Transaction } = require('../db/Model1');
const { User1, Transaction1 } = require('../db/Model2');
const { UserRemote, TransactionRemote } = require('../db/Remote');

router.get('/sync', (req,res) => {
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

router.get('/sync/1', (req,res) => {
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

     /*for(var i=0;i<users.length;i++){
         var user = users[i].dataValues;
         console.log("Syncing ID:" + user.id);
         UserRemote.create(user).then(() => {
         });
         User.update({syncState: 2}, {
           where: { id: user.id }
         }).then(() => {
           console.log('Synced');
         });
     }
     UserRemote.findAll().then(users => console.log(JSON.stringify(users)));*/
  });

  res.send('Syncing');
});

router.get('/sync/remote', (req,res) => {
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

router.get('/reset', (req,res) => {
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
  User.findByPk("b9bce8a7-cb13-4a73-a24f-296e1c38aeb7")
    .then((user) => res.send(user));
});

module.exports = router;
