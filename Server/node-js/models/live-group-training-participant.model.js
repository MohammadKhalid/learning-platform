const {TE, to}              = require('../services/util.service');

module.exports = (sequelize, DataTypes) => {
  var Model = sequelize.define('LiveGroupTrainingParticipant', {
    joinAt: DataTypes.DATE,
    leftAt: DataTypes.DATE,
    status: DataTypes.STRING
  });

  Model.associate = function(models){
      // this.belongsTo(models.User, {as: 'participant', foreignKey: 'userId'});
  };

  Model.prototype.toWeb = function (pw) {
      let json = this.toJSON();
      return json;
  };

  return Model;
};