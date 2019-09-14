const {TE, to} = require('../services/util.service');

module.exports = (sequelize, DataTypes) => {
  var Model = sequelize.define('ShowTimeAnswer', {});

  Model.associate = function(models){
    this.belongsTo(models.TopicQuestion, {as: 'question', foreignKey: 'topicQuestionId', otherKey: 'showTimeAnswerId', constraints: false});
  };

  Model.prototype.toWeb = function (pw) {
      let json = this.toJSON();
      return json;
  };

  return Model;
};