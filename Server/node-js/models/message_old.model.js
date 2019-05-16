const {TE, to}              = require('../services/util.service');


module.exports = (sequelize, DataTypes) => {
  var Model = sequelize.define('Message_old', {
    userId_userId_month: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    messageList: DataTypes.JSON
  });

  // Model.associate = function(models){
  //   this.belongsToMany(models.User, {foreignKey: 'id'});
  // };

  Model.prototype.toWeb = function (pw) {
      let json = this.toJSON();
      return json;
  };

  return Model;
};