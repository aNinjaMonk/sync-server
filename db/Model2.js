
const uuid = require('uuid/v4');
const Sequelize = require('sequelize');
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './mydb1.sqlite',
    logging: false
});

const User1 = sequelize.define('user',{
  id: {
    allowNull: false,
    type: Sequelize.UUID,
    primaryKey: true
  },
  firstName: {
   type: Sequelize.STRING
  },
  lastName: {
    type: Sequelize.STRING
  },
  syncState: {
     type: Sequelize.INTEGER
  }
});

const Transaction1 = sequelize.define('transaction', {
  id: {
    allowNull: false,
    type: Sequelize.UUID,
    primaryKey: true
  },
  amount: {
    type: Sequelize.INTEGER
  },
  detail: {
    type: Sequelize.TEXT
  },
  syncState: {
    type: Sequelize.INTEGER
  }
});

sequelize.sync();//{force: true});
//User.sync();
//Transaction.sync();

module.exports = {
  User1, Transaction1
};
