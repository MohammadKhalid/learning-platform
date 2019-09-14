const {TE, to} = require('../services/util.service');

module.exports = (sequelize, DataTypes) => {
  var Model = sequelize.define('SubscriptionPackage', {
    name: DataTypes.STRING(150),
    description: DataTypes.TEXT,
    price: DataTypes.DECIMAL(10, 2),
    priceBasis: DataTypes.STRING(20),
    priceCurrency: DataTypes.STRING(3)
  });

  Model.associate = function(models) {
    this.belongsToMany(models.SubscriptionPackage, { as: 'modules', through: models.SubscriptionPackageModule, foreignKey: 'subscriptionPackageId' });
    this.hasOne(models.Subscription, {as: 'subscriptionPackage', foreignKey: 'subscriptionPackageId'});
  }

  Model.prototype.toWeb = function (pw) {
      let json = this.toJSON();
      return json;
  };

  return Model;
};