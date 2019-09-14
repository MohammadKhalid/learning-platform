const { TE, to } = require('../services/util.service');

module.exports = (sequelize, DataTypes) => {
    var Model = sequelize.define('Course', {
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
        },
        image: {
            type: DataTypes.STRING,
            allowNull: false
        },
        categoryId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        createdBy: {
            type: DataTypes.UUID,
            allowNull: false
        },

    });

    Model.associate = function (models) {
        this.belongsTo(models.CourseCategory, { as: 'category', foreignKey: 'categoryId' });
        this.belongsTo(models.User, { as: 'coach', foreignKey: 'createdBy' });
        this.hasMany(models.Section, { as: 'Section', foreignKey: 'courseId' });
    };



    Model.prototype.toWeb = function (pw) {
        let json = this.toJSON();
        return json;
    };

    return Model;
};