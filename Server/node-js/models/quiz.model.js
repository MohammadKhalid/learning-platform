const { TE, to } = require('../services/util.service');

module.exports = (sequelize, DataTypes) => {
    var Model = sequelize.define('Quiz', {
        question: {
            type: DataTypes.STRING,
            allowNull: false
        },
        options: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        correctOption: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        questionType: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        experience:{
            type: DataTypes.INTEGER,
            allowNull: false
        },
        detail:{
            type: DataTypes.TEXT,
        },
        sectionId:{
            type: DataTypes.INTEGER,
            allowNull: false
        }
    });

    Model.associate = function (models) {
        this.belongsTo(models.Section, { as: 'section', foreignKey: 'sectionId' });
    };



    Model.prototype.toWeb = function (pw) {
        let json = this.toJSON();
        return json;
    };

    return Model;
};