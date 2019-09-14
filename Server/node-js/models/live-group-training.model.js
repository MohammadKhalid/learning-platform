const {TE, to} = require('../services/util.service');

module.exports = (sequelize, DataTypes) => {
  var Model = sequelize.define('LiveGroupTraining', {
    title: DataTypes.STRING,
    description : DataTypes.TEXT,
    detail : DataTypes.TEXT,
    date: DataTypes.DATEONLY,
    time: DataTypes.STRING(12),
    timezone: {
      type: DataTypes.STRING(50),
      defaultValue: 'Australia/Sydney'
  },
    end: {
      type: DataTypes.DATE,
      allowNull: true
    },
    started: {
      type: DataTypes.DATE,
      allowNull: true
    },
    public: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    status : {
        type: DataTypes.ENUM,
        values: ['open', 'close'],
        defaultValue: 'open'
    }
  });

  Model.associate = function(models){
    this.belongsToMany(models.User, { through: { model: models.UserTag, unique: false, scope: { taggable: 'liveGroupTraining' } }, foreignKey: 'taggableId', constraints: false, as: 'users'});
    this.belongsTo(models.User, {as: 'speaker', foreignKey: 'speakerId', otherKey: 'userId'});
  };

  Model.prototype.toWeb = function (pw) {
      let json = this.toJSON();
      return json;
  };

  return Model;
};