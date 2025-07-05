// See https://sequelize.org/master/manual/model-basics.html
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const invoices = sequelizeClient.define('tb_pembayaran', {
    id_penjualan: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'tb_penjualan',
        key: 'id'
      }
    },
    cicilan: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    valid: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    }

  }, {
    hooks: {
      beforeCount(options) {
        options.raw = true;
      }
    }
  });

  // eslint-disable-next-line no-unused-vars
  invoices.associate = function (models) {
    invoices.belongsTo(models.tb_penjualan, { foreignKey: 'id_penjualan' });
  };

  return invoices;
};
