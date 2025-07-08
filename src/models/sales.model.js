// See https://sequelize.org/master/manual/model-basics.html
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const sales = sequelizeClient.define('tb_penjualan', {
    no_kontrak: {
      type: DataTypes.STRING,
      allowNull: false
    },
    id_pelanggan: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'tb_pelanggan',
        key: 'id'
      }
    },
    id_motor: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'tb_motor',
        key: 'id'
      }
    },
    id_user: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    uang_muka: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    tenor: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    angsuran: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
  }, {
    hooks: {
      beforeCount(options) {
        options.raw = true;
      }
    }
  });

  // eslint-disable-next-line no-unused-vars
  sales.associate = function (models) {
    sales.belongsTo(models.users, { foreignKey: 'id_user' });
    sales.belongsTo(models.tb_pelanggan, { foreignKey: 'id_pelanggan' });
    sales.belongsTo(models.tb_motor, { foreignKey: 'id_motor' });
  };

  return sales;
};
