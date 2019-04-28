'use strict';
const bcrypt 			= require('bcrypt');
const bcrypt_p 			= require('bcrypt-promise');
const jwt           	= require('jsonwebtoken');
const {TE, to}          = require('../services/util.service');
const CONFIG            = require('../config/config');

module.exports = (sequelize, DataTypes) => {
    var Model = sequelize.define('Category', {
        title       : DataTypes.STRING,
        description : DataTypes.TEXT,
        isActive    : {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
        isDeleted   : {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    });

    Model.associate = function(models) {
        // self reference as sub category
        this.belongsTo(models.Category, { as: 'parentCategory', foreignKey: 'categoryId' });
        this.hasMany(models.Category, {as: 'subCategories', foreignKey: 'categoryId'});

        // topic
        this.belongsToMany(models.Topic, { through: 'CategoryTopic', as: 'topics', foreignKey: 'categoryId' });

        // user
        this.belongsTo(models.User, {as: 'createdByUser', foreignKey: 'createdBy'});
        this.belongsTo(models.User, {as: 'updatedByUser', foreignKey: 'updatedBy'});
    };

    Model.prototype.getJWT = function () {
        let expiration_time = parseInt(CONFIG.jwt_expiration);
        return "Bearer "+jwt.sign({user_id:this.id}, CONFIG.jwt_encryption, {expiresIn: expiration_time});
    };

    Model.prototype.toWeb = function (pw) {
        let json = this.toJSON();
        return json;
    };

    return Model;
};
