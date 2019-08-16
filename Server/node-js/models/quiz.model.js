const { TE, to } = require('../services/util.service');

module.exports = (sequelize, DataTypes) => {
    var Model = sequelize.define('Quiz', {
        question: {
            type: DataTypes.STRING,
            allowNull: false
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        options: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        type: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'Quiz'
        },
        experience: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        sectionPageId: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    });

    Model.associate = function (models) {
        this.belongsTo(models.SectionPage, { as: 'section', foreignKey: 'sectionPageId' });
    };



    Model.prototype.toWeb = function (pw) {
        let json = this.toJSON();
        return json;
    };

    return Model;
};