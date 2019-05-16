const {TE, to}              = require('../services/util.service');


module.exports = (sequelize, DataTypes) => {
  var Model = sequelize.define('Message', {
    message: DataTypes.TEXT,
    senderId: {
        type: DataTypes.UUID,
    },
    recieverId: {
        type: DataTypes.UUID
    },
    Date: DataTypes.TEXT
  });

  Model.associate = function(models){
    this.belongsTo(models.User, {as: 'senderMessage',foreignKey: 'senderId'});
    this.belongsTo(models.User, {as: 'recieverMessage',foreignKey: 'recieverId'});
  };

  Model.prototype.toWeb = function (pw) {
      let json = this.toJSON();
      return json;
  };

  return Model;
};