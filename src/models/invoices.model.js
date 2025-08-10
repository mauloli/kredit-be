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
    status: {
      type: DataTypes.ENUM('MENUNGGU', 'SUKSES', 'TOLAK'),
      allowNull: false,
      defaultValue: 'MENUNGGU'
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
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
    invoices.belongsTo(models.tb_penjualan, {
      foreignKey: 'id_penjualan',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  };

  return invoices;
};
