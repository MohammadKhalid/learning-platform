const {TE, to} = require('../services/util.service');

module.exports = (sequelize, DataTypes) => {
  var Model = sequelize.define('TopicTag', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
      topicId: {
        type: DataTypes.INTEGER,
        unique: 'topic_tag_taggable'
      },
      taggable: {
        type: DataTypes.STRING,
        unique: 'topic_tag_taggable'
      },
      taggableId: {
        type: DataTypes.INTEGER,
        unique: 'topic_tag_taggable',
        references: null
      }
  });

  Model.prototype.toWeb = function (pw) {
      let json = this.toJSON();
      return json;
  };

  return Model;
};