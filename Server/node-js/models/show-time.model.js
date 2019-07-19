const {TE, to} = require('../services/util.service');

module.exports = (sequelize, DataTypes) => {
  var Model = sequelize.define('ShowTime', {
    isPractice: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: 'started'
    },
    submittedAt: DataTypes.DATE,
    sendTo: DataTypes.TEXT,
    
    comment: DataTypes.TEXT,
    rating: {
      type: DataTypes.ENUM,
      values: ['very_sad', 'sad', 'neutral', 'happy', 'very_happy']
    }
  });

  Model.associate = function(models){
    this.belongsToMany(models.Answer, { through: models.ShowTimeAnswer, as: 'answers', foreignKey: 'showTimeId', otherKey: 'answerId'});

    this.belongsTo(models.Topic, {as: 'topic', foreignKey: 'topicId'});
    this.belongsTo(models.User, {as: 'student', foreignKey: 'userId', otherKey: 'userId'});
    this.belongsTo(models.User, {as: 'coach', foreignKey: 'submittedTo', otherKey: 'userId'});

    this.belongsToMany(models.User, {
      through: {
        model: models.UserTag,
        unique: false,
        scope: {
          taggable: 'showTime'
        }
      },
      foreignKey: 'taggableId',
      constraints: false,
      as: 'users'
    });
  };

  Model.prototype.toWeb = function (pw) {
      let json = this.toJSON();
      return json;
  };

  return Model;
};