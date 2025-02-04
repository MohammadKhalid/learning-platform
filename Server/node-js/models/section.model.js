const { TE, to } = require('../services/util.service');

module.exports = (sequelize, DataTypes) => {
    var Model = sequelize.define('Section', {
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
        },
        totalExperience: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        courseId: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    });

    Model.associate = function (models) {
        this.belongsTo(models.Course, { as: 'course', foreignKey: 'courseId' });
        this.hasMany(models.SectionPage, { as: 'sectionPage', foreignKey: 'sectionId' });
        // this.hasMany(models.Lesson, { as: 'Lesson', foreignKey: 'sectionId' });
        // this.hasMany(models.Quiz, { as: 'Quiz', foreignKey: 'sectionId' });
        this.hasMany(models.Resource, { as: 'Resource', foreignKey: 'sectionId' });
    };



    Model.prototype.toWeb = function (pw) {
        let json = this.toJSON();
        return json;
    };

    return Model;
};