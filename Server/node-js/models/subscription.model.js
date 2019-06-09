const {TE, to} = require('../services/util.service');

module.exports = (sequelize, DataTypes) => {
  var Model = sequelize.define('Subscription', {
    startedAt: DataTypes.DATE,
    expireAt: DataTypes.DATE
  });

  Model.prototype.toWeb = function (pw) {
      let json = this.toJSON();
      return json;
  };

  return Model;
};