const {TE, to} = require('../services/util.service');

module.exports = (sequelize, DataTypes) => {
  var Model = sequelize.define('UserTelecom', {
    name        : DataTypes.STRING(100),
    mobile      : DataTypes.STRING(20),
    telephone   : DataTypes.STRING(20),
    fax         : DataTypes.STRING(20)
  });

  Model.prototype.toWeb = function (pw) {
      let json = this.toJSON();
      return json;
  };

  return Model;
};