const {TE, to}              = require('../services/util.service');

module.exports = (sequelize, DataTypes) => {
  var Model = sequelize.define('Industry', {
    name: DataTypes.STRING
  });

  Model.associate = function(models) {
    this.belongsToMany(models.User, {as: 'users', through: 'UserIndustry', foreignKey: 'industryId', otherKey: 'userId'});
    this.belongsToMany(models.Topic, {as: 'topics', through: 'TopicIndustry', foreignKey: 'industryId', otherKey: 'topicId'});
  };

  Model.prototype.toWeb = function (pw) {
      let json = this.toJSON();
      return json;
  };

  return Model;
};