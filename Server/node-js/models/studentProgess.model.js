const { TE, to } = require('../services/util.service');

module.exports = (sequelize, DataTypes) => {
    var Model = sequelize.define('StudentProgress', {
        studentId: {
            type: DataTypes.UUID,
            allowNull: false
        },
        lessonId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        sectionId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    });

    Model.associate = function (models) {
        this.belongsTo(models.User, { as: 'student', foreignKey: 'studentId' });
        this.belongsTo(models.Section, { as: 'section', foreignKey: 'sectionId' });
        this.belongsTo(models.Lesson, { as: 'lesson', foreignKey: 'lessonId' });
    };



    Model.prototype.toWeb = function (pw) {
        let json = this.toJSON();
        return json;
    };

    return Model;
};