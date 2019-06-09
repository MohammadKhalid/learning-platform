const {TE, to} = require('../services/util.service');

module.exports = (sequelize, DataTypes) => {
  var Model = sequelize.define('SubscriptionPackageModule', {
    limit: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  });

  Model.prototype.toWeb = function (pw) {
      let json = this.toJSON();
      return json;
  };

  return Model;
};