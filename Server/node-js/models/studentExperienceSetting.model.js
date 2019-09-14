const { TE, to } = require('../services/util.service');

module.exports = (sequelize, DataTypes) => {
    var Model = sequelize.define('StudentExperienceSetting', {
        initialLevel: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        initialExperience: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        clientId: {
            type: DataTypes.UUID,
            allowNull: false
        },
        companyId: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    });

    Model.associate = function (models) {
        this.belongsTo(models.User, { as: 'client', foreignKey: 'clientId' });
        this.belongsTo(models.Company, { as: 'company', foreignKey: 'companyId' });
    };



    Model.prototype.toWeb = function (pw) {
        let json = this.toJSON();
        return json;
    };

    return Model;
};