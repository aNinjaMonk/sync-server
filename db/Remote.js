
const Sequelize = require('sequelize');
const sequelize = new Sequelize(process.env.DB_URI, {
  logging: false
});

const UserRemote = sequelize.define('user', {
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

const TransactionRemote = sequelize.define('transaction', {
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
//UserRemote.sync();
//TransactionRemote.sync();

module.exports = {
  UserRemote,
  TransactionRemote
}
