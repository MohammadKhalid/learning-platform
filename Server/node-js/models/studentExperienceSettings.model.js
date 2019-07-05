const { TE, to } = require('../services/util.service');

module.exports = (sequelize, DataTypes) => {
    var Model = sequelize.define('StudentExperienceSettings', {
        initialLevel: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        initialExperience: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        adminId: {
            type: DataTypes.UUID,
            allowNull: false
        
        }
    });

    Model.associate = function (models) {
        this.belongsTo(models.User, { as: 'admin', foreignKey: 'adminId' });
    };



    Model.prototype.toWeb = function (pw) {
        let json = this.toJSON();
        return json;
    };

    return Model;
};