const {TE, to} = require('../services/util.service');

module.exports = (sequelize, DataTypes) => {
  var Model = sequelize.define('UserProfile', {
    photo       : DataTypes.TEXT,
    middleName  : DataTypes.STRING(50),
    nickName    : DataTypes.STRING(20),
    affix       : DataTypes.STRING(10),
    suffix      : DataTypes.STRING(5),
    birthDate   : DataTypes.DATEONLY,
    civilStatus : DataTypes.STRING(12),
    gender      : {
                    type: DataTypes.ENUM,
                    values: ['male', 'female', 'other']
                }
  });

  Model.prototype.toWeb = function (pw) {
      let json = this.toJSON();
      return json;
  };

  return Model;
};