const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');

  const roles = sequelizeClient.define('roles', {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    timestamps: true
  });

  roles.associate = function (models) {
    // roles hasMany users
    roles.hasMany(models.users, { foreignKey: 'role_id' });
  };

  return roles;
};
