// See https://sequelize.org/master/manual/model-basics.html
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const notificiation = sequelizeClient.define('notificiation', {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true // Boleh null kalau untuk semua user
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    type: {
      type: DataTypes.ENUM('due_date', 'info', 'success', 'error', 'custom'),
      defaultValue: 'info'
    },
    read: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
  }, {
    hooks: {
      beforeCount(options) {
        options.raw = true;
      }
    }
  });

  // eslint-disable-next-line no-unused-vars
  notificiation.associate = function (models) {
    notificiation.belongsTo(models.users, {
      foreignKey: 'user_id',
      as: 'user'
    });
  };

  return notificiation;
};
