const {TE, to} = require('../services/util.service');

module.exports = (sequelize, DataTypes) => {
  var Model = sequelize.define('AskExpert', {
    subject: DataTypes.STRING,
    question: DataTypes.TEXT,
    status: {
      type: DataTypes.STRING,
      defaultValue: 'open'
    },
    submittedAt: DataTypes.DATE,
    sendTo: DataTypes.TEXT
  });

  Model.associate = function(models){
    this.belongsToMany(models.QuestionAnswer, { through: 'AskExpertQuestionAnswer', as: 'questionAnswers', foreignKey: 'askExpertId', otherKey: 'questionAnswerId'});
    this.belongsToMany(models.Media, { through: 'AskExpertMedia', as: 'medias', foreignKey: 'askExpertId', otherKey: 'mediaId' });

    this.belongsTo(models.User, {as: 'user', foreignKey: 'userId', otherKey: 'userId'});
    this.belongsTo(models.User, {as: 'coach', foreignKey: 'submittedTo', otherKey: 'userId'});
  };

  Model.prototype.toWeb = function (pw) {
      let json = this.toJSON();
      return json;
  };

  return Model;
};