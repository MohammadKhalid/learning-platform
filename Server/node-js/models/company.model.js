module.exports = (sequelize, DataTypes) => {
  var Model = sequelize.define('Company', {
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    address: DataTypes.TEXT,
    country: DataTypes.STRING,
    email: DataTypes.STRING,
    phone: DataTypes.STRING,
    fax: DataTypes.STRING
  });

  Model.associate = function(models) {
    this.belongsToMany(models.Department, {
      through: { 
        model: models.DepartmentTag,
        unique: false,
        scope: {
          taggable: 'company'
        }
      },
      foreignKey: 'taggableId',
      constraints: false,
      as: 'departments'
    });

    this.belongsToMany(models.Category, {
      through: {
        model: models.CompanyTag,
        unique: false
      },
      foreignKey: 'companyId',
      constraints: false,
      as: 'categories'
    });

    this.belongsToMany(models.Topic, {
      through: {
        model: models.CompanyTag,
        unique: false
      },
      foreignKey: 'companyId',
      constraints: false,
      as: 'topics'
    });

    this.belongsToMany(models.User, {as: 'users', through: models.UserCompany, foreignKey: 'companyId', otherKey: 'userId'});
    this.belongsToMany(models.User, {as: 'owner', through: models.UserCompany, foreignKey: 'companyId', otherKey: 'userId', scope: { type: 'client' }});
    this.belongsToMany(models.User, {as: 'students', through: models.UserCompany, foreignKey: 'companyId', otherKey: 'userId', scope: { type: 'student' }});
    this.belongsToMany(models.User, {as: 'coaches', through: models.UserCompany, foreignKey: 'companyId', otherKey: 'userId', scope: { type: 'coach' }});
  };

  Model.prototype.toWeb = function () {
      let json = this.toJSON();
      return json;
  };

  return Model;
};