const {TE, to} = require('../services/util.service');

module.exports = (sequelize, DataTypes) => {
  var Model = sequelize.define('Address', {
    parentId  : DataTypes.INTEGER,
    type      : {
                    type: DataTypes.ENUM,
                    values: ['Province', 'City']
                },
    name      : DataTypes.STRING
  });

  Model.prototype.toWeb = function (pw) {
      let json = this.toJSON();
      return json;
  };

  return Model;
};