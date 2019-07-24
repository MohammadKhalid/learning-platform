const { TE, to } = require('../services/util.service');

module.exports = (sequelize, DataTypes) => {
    var Model = sequelize.define('Text', {
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        sectionId: {
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