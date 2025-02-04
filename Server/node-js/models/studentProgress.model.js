const { TE, to } = require('../services/util.service');

module.exports = (sequelize, DataTypes) => {
    var Model = sequelize.define('StudentProgress', {
        studentId: {
            type: DataTypes.UUID,
            allowNull: false
        },
        sectionPageId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        sectionId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        courseId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        isLastActive: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultvalue: 0
        },
    });

    Model.associate = function (models) {
        this.belongsTo(models.User, { as: 'student', foreignKey: 'studentId' });
        this.belongsTo(models.Course, { as: 'course', foreignKey: 'courseId' });
        this.belongsTo(models.Section, { as: 'section', foreignKey: 'sectionId' });
        this.belongsTo(models.SectionPage, { as: 'sectionPage', foreignKey: 'sectionPageId' });
    };



    Model.prototype.toWeb = function (pw) {
        let json = this.toJSON();
        return json;
    };

    return Model;
};