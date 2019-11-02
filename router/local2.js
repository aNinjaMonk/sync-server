
const express = require('express');
const router = express.Router();
const uuid = require('uuid/v4');

const { User1, Transaction1 } = require('../db/Model2');

router.get('/create', (req,res) => {
  User1.create({id: uuid(), firstName: "Abhijeet", lastName: "Goel",syncState: 1})
    .then((user)=> res.send(user));
});

router.get('/all', (req,res) => {
  User1.findAll().then(users => res.send(users));
});

router.get('/update', (req,res) => {
  User1.update({syncState: 1},{where: {syncState: 2}})
    .then(() => User1.findAll())
    .then((users) => res.send(users));
});

router.get('/delete', (req,res) => {
  User1.destroy({where: {syncState: 1}})
    .then(() => User1.findAll())
    .then((users) => res.send(users));
});

module.exports = router;
