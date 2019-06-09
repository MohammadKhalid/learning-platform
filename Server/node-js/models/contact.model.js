const {TE, to} = require('../services/util.service');
const User = require('../models/user.model');

module.exports = (sequelize, DataTypes) => {
  var Model = sequelize.define('Contact', {
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    user_id: {
        type: DataTypes.UUID,
    },
    contact_id: {
        type: DataTypes.UUID
    }
  });

  Model.associate = function(models){
    this.belongsTo(models.User, { as: 'userss' , foreignKey: 'contact_id' });
    this.belongsTo(models.User, { as: 'contactss' , foreignKey: 'user_id' });
  };

  

  Model.prototype.toWeb = function (pw) {
      let json = this.toJSON();
      return json;
  };

  return Model;
};