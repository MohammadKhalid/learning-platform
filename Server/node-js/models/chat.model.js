const {TE, to}              = require('../services/util.service');

module.exports = (sequelize, DataTypes) => {
  var Model = sequelize.define('Chat', {
    userId_userId: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    lastMessage: DataTypes.STRING,
    lastMessageId: DataTypes.INTEGER,
    lastMessageDate: DataTypes.STRING
  });

//   Model.associate = function(models){
//     this.belongsToMany(models.User, {foreignKey: 'id'});
//   };

  Model.prototype.toWeb = function (pw) {
      let json = this.toJSON();
      return json;
  };

  return Model;
};