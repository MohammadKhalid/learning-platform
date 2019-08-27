const { TE, to } = require('../services/util.service');

module.exports = (sequelize, DataTypes) => {
    var Model = sequelize.define('StudentAnswer', {
        answer: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: false
        },
        isCorrect: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        sectionPageId:{
            type: DataTypes.INTEGER,
            allowNull: false
        },
        title:{
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'title'
        },
        quizId:{
            type: DataTypes.INTEGER,
            allowNull: false
        }
    });

    Model.associate = function (models) {
        this.belongsTo(models.SectionPage, { as: 'sectionPage', foreignKey: 'sectionPageId' });
        this.belongsTo(models.User, { as: 'user', foreignKey: 'userId' });
        this.belongsTo(models.Quiz, { as: 'question', foreignKey: 'quizId' });
    };



    Model.prototype.toWeb = function (pw) {
        let json = this.toJSON();
        return json;
    };

    return Model;
};