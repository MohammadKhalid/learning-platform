const {TE, to} = require('../services/util.service');

module.exports = (sequelize, DataTypes) => {
  var Model = sequelize.define('Subscription', {
    startedAt: DataTypes.DATE,
    expireAt: DataTypes.DATE,
    isTrial: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  });

  Model.associate = function(models) {
    this.belongsTo(models.User, {as: 'user', foreignKey: 'userId'});
    this.belongsTo(models.SubscriptionPackage, {as: 'subscriptionPackage', foreignKey: 'subscriptionPackageId'});
  }

  Model.prototype.toWeb = function (pw) {
      let json = this.toJSON();
      return json;
  };

  return Model;
};