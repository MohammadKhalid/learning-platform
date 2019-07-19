const {TE, to}              = require('../services/util.service');

module.exports = (sequelize, DataTypes) => {
  var Model = sequelize.define('Department', {
    name: DataTypes.STRING,
    description: DataTypes.TEXT
  });

  Model.associate = function(models) {
    // user
    // this.belongsTo(models.User, {as: 'owner', foreignKey: 'userId', otherKey: 'departmentId'});

    // companies
    // this.belongsToMany(models.Company, { through: { model: models.CompanyTag, unique: false, scope: { taggable: 'department' } }, foreignKey: 'taggableId', constraints: false, as: 'companies' });
    // this.belongsToMany(models.Company, { through: { model: models.DepartmentTag, unique: false }, foreignKey: 'departmentId', otherKey: 'id', constraints: false, as: 'companyDepartments'});
    this.belongsToMany(models.Company, {
      through: {
        model: models.DepartmentTag,
        unique: false
      },
      foreignKey: 'departmentId',
      constraints: false,
      as: 'companies'
    });
    
    this.belongsToMany(models.UserCompany, {
      through: {
        model: models.DepartmentTag,
        unique: false
      },
      foreignKey: 'departmentId',
      constraints: false,
      as: 'userCompanies'
    });

    this.belongsToMany(models.User, {
      through: {
        model: models.DepartmentTag,
        unique: false
      },
      foreignKey: 'departmentId',
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