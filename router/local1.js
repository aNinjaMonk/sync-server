var express = require('express');
const router = express.Router();
const uuid = require('uuid/v4');

const { User, Transaction } = require('../db/Model1');


router.get('/create', (req,res) => {
  User.create({id: uuid(), firstName: "Imon", lastName: "Raza",syncState: 1})
    .then((user)=> res.send(user))
    .catch((err) => res.send(err));
});

router.get('/all', (req,res) => {
  User.findAll().then(users => res.send(users));
});

router.get('/update', (req,res) => {
  var _id = "b9bce8a7-cb13-4a73-a24f-296e1c38aeb9";
  User.update({firstName: "Akki", lastName: "Reddy", syncState: 1},{where: {id: _id}})
    .then(() => User.findAll({where: {id: _id}}))
    .then((users) => res.send(users));
});

router.get('/upsert', (req,res) => {
  var user = [{
    id: 'b9bce8a7-cb13-4a73-a24f-296e1c38aeb9',
    firstName: "Akkireddy Prakash",
    lastName: "Reddy",
    syncState: 1
  }, {
    id: 'b9bce8a7-cb13-4a73-a24f-296e1c38afb9',
    firstName: "My",
    lastName: "Name",
    syncState: 1
  }];
  User.bulkCreate(user, {updateOnDuplicate: ['id']})
    .then(() => User.findAll())
    .then((users) => res.send(users));
});

router.get('/delete', (req,res) => {
  User.destroy({where: {syncState: 1}})
    .then(() => User.findAll())
    .then((users) => res.send(users));
});

module.exports = router;
