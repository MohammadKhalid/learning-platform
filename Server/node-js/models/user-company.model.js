const {TE, to}              = require('../services/util.service');

module.exports = (sequelize, DataTypes) => {
  var Model = sequelize.define('UserCompany', {
    isOwner: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
  });

  Model.prototype.toWeb = function (pw) {
      let json = this.toJSON();
      return json;
  };

  return Model;
};