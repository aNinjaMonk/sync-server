var express = require('express');
const router = express.Router();

const { UserRemote, TransactionRemote } = require('../db/Remote');

/*router.get('/create', (req,res) => {
  UserRemote.create({firstName: "Imon", lastName: "Raza", syncState: 1})
    .then(user => res.send(user));
});*/

router.get('/all', (req,res) => {
  UserRemote.findAll()
    .then(users => res.send(users));
});

router.get('/update', (req,res) => {
  UserRemote.update({syncState: 2},{where: {syncState: 1}})
    .then(() => UserRemote.findAll())
    .then((users) => res.send(users));
});

router.get('/delete', (req,res) => {
  UserRemote.destroy({where: {syncState: 1}})
    .then(() => res.send("Deleted"));
});

module.exports = router;
