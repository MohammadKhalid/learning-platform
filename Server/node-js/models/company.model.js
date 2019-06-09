const {TE, to}              = require('../services/util.service');

module.exports = (sequelize, DataTypes) => {
  var Model = sequelize.define('Company', {
    name: DataTypes.STRING
  });

  Model.associate = function(models){
    this.belongsToMany(models.User, {as: 'users', through: 'CompanyUser', foreignKey: 'companyId', otherKey: 'userId'});
  };

  Model.prototype.toWeb = function (pw) {
      let json = this.toJSON();
      return json;
  };

  return Model;
};