'use strict';
const bcrypt = require('bcrypt');
const bcrypt_p = require('bcrypt-promise');
const jwt = require('jsonwebtoken');
const { TE, to } = require('../services/util.service');
const CONFIG = require('../config/config');

module.exports = (sequelize, DataTypes) => {
    var Model = sequelize.define('CourseCategory', {
        title: DataTypes.STRING,
        clientId: {
            type: DataTypes.UUID,
            allowNull: false
        },
        companyId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        description: DataTypes.TEXT,
    });

    Model.associate = function (models) {
        // self reference as sub category
        this.belongsTo(models.User, { as: 'admin', foreignKey: 'clientId' });
        this.belongsTo(models.Company, { as: 'company', foreignKey: 'companyId' });
        this.hasMany(models.Course, { as: 'subCategories', foreignKey: 'categoryId' });
    };

    Model.prototype.getJWT = function () {
        let expiration_time = parseInt(CONFIG.jwt_expiration);
        return "Bearer " + jwt.sign({ user_id: this.id }, CONFIG.jwt_encryption, { expiresIn: expiration_time });
    };

    Model.prototype.toWeb = function (pw) {
        let json = this.toJSON();
        return json;
    };

    return Model;
};
