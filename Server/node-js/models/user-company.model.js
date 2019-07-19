module.exports = (sequelize, DataTypes) => {
  var Model = sequelize.define('UserCompany', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    }
  });

  Model.associate = function(models) {
    this.belongsTo(models.User, {as: 'user', foreignKey: 'userId'});
    this.belongsTo(models.Company, {as: 'company', foreignKey: 'companyId'});

    this.belongsToMany(models.Department, {
      through: { 
        model: models.DepartmentTag,
        unique: false,
        scope: {
          taggable: 'assignedCompany'
        }
      },
      foreignKey: 'taggableId',
      constraints: false,
      as: 'departments'
    });
  }

  Model.prototype.toWeb = function () {
      let json = this.toJSON();
      return json;
  };

  return Model;
};