const {TE, to} = require('../services/util.service');

module.exports = (sequelize, DataTypes) => {
  var Model = sequelize.define('Telecom', {
    name        : DataTypes.STRING(100),
    mobile      : DataTypes.STRING(20),
    telephone   : DataTypes.STRING(20),
    fax         : DataTypes.STRING(20)
  });

  Model.associate = function(models) {
    this.belongsToMany(models.User, { through: { model: models.UserTag, unique: false, scope: { taggable: 'telecom' } }, foreignKey: 'taggableId', constraints: false, as: 'users'});
  }

  Model.prototype.toWeb = function (pw) {
      let json = this.toJSON();
      return json;
  };

  return Model;
};