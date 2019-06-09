const {TE, to} = require('../services/util.service');

module.exports = (sequelize, DataTypes) => {
  var Model = sequelize.define('SubscriptionPackage', {
    type: {
        type: DataTypes.ENUM,
        values: ['elite', 'gold', 'platinum', 'silver', 'trial'],
        allowNull: true
    },
    name: DataTypes.STRING(150)
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