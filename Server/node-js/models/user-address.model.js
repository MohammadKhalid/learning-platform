const {TE, to} = require('../services/util.service');

module.exports = (sequelize, DataTypes) => {
  var Model = sequelize.define('UserAddress', {
    name          : DataTypes.STRING(100),
    street        : DataTypes.STRING,
    zip           : DataTypes.STRING(10),
    cityName      : DataTypes.STRING(50),
    provinceName  : DataTypes.STRING(50),
    country       : DataTypes.STRING(20)
  });

  Model.associate = function(models) {
    this.belongsTo(models.Address, {as: 'city', foreignKey: 'cityId'});
    this.belongsTo(models.Address, {as: 'province', foreignKey: 'provinceId'});
  };

  Model.prototype.toWeb = function (pw) {
      let json = this.toJSON();
      return json;
  };

  return Model;
};