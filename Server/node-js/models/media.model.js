module.exports = (sequelize, DataTypes) => {
  var Model = sequelize.define('Media', {
    name: DataTypes.STRING,
    filename: DataTypes.TEXT,
    path: DataTypes.TEXT,
    size: DataTypes.STRING,
    snapshot: DataTypes.TEXT,
    duration: DataTypes.TEXT,
    type: DataTypes.TEXT
  });

  Model.associate = function(models) {
    this.belongsToMany(models.User, { through: { model: models.UserTag, unique: false, scope: { taggable: 'media' } }, foreignKey: 'taggableId', constraints: false, as: 'users'});
  }

  Model.prototype.toWeb = function () {
      let json = this.toJSON();
      return json;
  };

  return Model;
};