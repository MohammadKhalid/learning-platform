const { TE, to } = require('../services/util.service');

module.exports = (sequelize, DataTypes) => {
    var Model = sequelize.define('SectionPage', {
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        sectionId: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    });

    Model.associate = function (models) {

        this.belongsTo(models.Section, { as: 'Section', foreignKey: 'sectionId' });
        this.hasMany(models.Text, { as: 'Text', foreignKey: 'sectionPageId' });
        this.hasMany(models.Lesson, { as: 'Lesson', foreignKey: 'sectionPageId' });
        this.hasMany(models.Quiz, { as: 'Quiz', foreignKey: 'sectionPageId' });
        this.hasMany(models.Resource, { as: 'Resource', foreignKey: 'sectionPageId' });
    };



    Model.prototype.toWeb = function (pw) {
        let json = this.toJSON();
        return json;
    };

    return Model;
};