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
    });

    Model.associate = function (models) {
        this.belongsTo(models.User, { as: 'student', foreignKey: 'studentId' });
        this.belongsTo(models.Section, { as: 'section', foreignKey: 'sectionPageId' });
    };



    Model.prototype.toWeb = function (pw) {
        let json = this.toJSON();
        return json;
    };

    return Model;
};