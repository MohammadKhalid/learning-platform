const {TE, to} = require('../services/util.service');

module.exports = (sequelize, DataTypes) => {
  var Model = sequelize.define('Address', {
    name          : DataTypes.STRING(100),
    street        : DataTypes.STRING,
    zip           : DataTypes.STRING(10),
    cityName      : DataTypes.STRING(50),
    provinceName  : DataTypes.STRING(50),
    country       : DataTypes.STRING(20)
  });

  Model.associate = function(models) {
    this.belongsToMany(models.User, { through: { model: models.UserTag, unique: false, scope: { taggable: 'address' } }, foreignKey: 'taggableId', constraints: false, as: 'users'});
  }

  Model.prototype.toWeb = function (pw) {
      let json = this.toJSON();
      return json;
  };

  return Model;
};