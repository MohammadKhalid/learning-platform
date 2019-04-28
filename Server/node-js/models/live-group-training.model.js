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
      // this.hasMany(models.LiveGroupTrainingParticipant, {as: 'participants', foreignKey: 'liveGroupTrainingId'});
      this.belongsToMany(models.User, {as: 'participants', through: 'LiveGroupTrainingParticipant', foreignKey: 'liveGroupTrainingId', otherKey: 'userId'});
      this.belongsTo(models.User, {as: 'speaker', foreignKey: 'speakerId', otherKey: 'userId'});
  };

  Model.prototype.toWeb = function (pw) {
      let json = this.toJSON();
      return json;
  };

  return Model;
};