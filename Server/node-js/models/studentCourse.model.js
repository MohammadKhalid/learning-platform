const { TE, to } = require('../services/util.service');

module.exports = (sequelize, DataTypes) => {
    var Model = sequelize.define('StudentCourse', {

        status: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
    });

    Model.associate = function (models) {
        models.User.belongsToMany(models.Course, { through: Model });
        models.Course.belongsToMany(models.User, { through: Model });
    };



    Model.prototype.toWeb = function (pw) {
        let json = this.toJSON();
        return json;
    };

    return Model;
};