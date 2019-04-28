const {TE, to} = require('../services/util.service');

module.exports = (sequelize, DataTypes) => {
  var Model = sequelize.define('Media', {
    name: DataTypes.STRING,
    filename: DataTypes.TEXT,
    path: DataTypes.TEXT,
    size: DataTypes.STRING,
    snapshot: DataTypes.TEXT,
    duration: DataTypes.TEXT,
    type: DataTypes.TEXT,
    media: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  });

  Model.prototype.toWeb = function (pw) {
      let json = this.toJSON();
      return json;
  };

  return Model;
};