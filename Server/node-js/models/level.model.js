const { TE, to } = require('../services/util.service');

module.exports = (sequelize, DataTypes) => {
    var Model = sequelize.define('Level', {
        studentId: {
            type: DataTypes.UUID,
            allowNull: false
        },
        nextExperience: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        currentExperience:{
            type: DataTypes.INTEGER,
            allowNull: false
        },
        currentLevel:{
            type: DataTypes.INTEGER,
            allowNull: false
        }
    });

    Model.associate = function (models) {
        this.belongsTo(models.User, { as: 'student', foreignKey: 'studentId' });
    };



    Model.prototype.toWeb = function (pw) {
        let json = this.toJSON();
        return json;
    };

    return Model;
};