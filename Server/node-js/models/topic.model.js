'use strict';
const bcrypt 			= require('bcrypt');
const bcrypt_p 			= require('bcrypt-promise');
const jwt           	= require('jsonwebtoken');
const {TE, to}          = require('../services/util.service');
const CONFIG            = require('../config/config');

module.exports = (sequelize, DataTypes) => {
    var Model = sequelize.define('Topic', {
        title       : DataTypes.STRING,
        description : DataTypes.TEXT,
        content     : DataTypes.TEXT,
        isPublic    : {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        isActive    : {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
        isPrivate   : {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        isCustom    : {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        isDeleted   : {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        status      : {
            type: DataTypes.ENUM,
            values: ['publish', 'draft'],
            defaultValue: 'publish'
        }
    });

    Model.associate = function(models) {
        // questions
        this.hasMany(models.TopicQuestion, { as: 'questions', foreignKey: 'topicId' });

        // showtime
        this.hasMany(models.ShowTime, { as: 'showTimes', foreignKey: 'topicId' });

        // category
        this.belongsToMany(models.Category, {
            through: {
              model: models.TopicTag,
              unique: false
            },
            foreignKey: 'topicId',
            constraints: false,
            as: 'categories'
        });

        // company
        this.belongsToMany(models.Company, { through: { model: models.CompanyTag, unique: false, scope: { taggable: 'topic' } }, foreignKey: 'taggableId', constraints: false, as: 'companies' });
        // this.belongsToMany(models.Company, { through: { model: models.TopicTag, unique: false }, foreignKey: 'topicId', constraints: false, as: 'topicCompanies'});

        // // user
        this.belongsToMany(models.User, { through: { model: models.UserTag, unique: false, scope: { taggable: 'topic' } }, foreignKey: 'taggableId', constraints: false, as: 'users'});
        // this.belongsToMany(models.User, { through: { model: models.TopicTag, unique: false }, foreignKey: 'topicId', constraints: false, as: 'topicUsers'});

        // user
        // this.belongsTo(models.User, {as: 'creator', foreignKey: 'createdBy'});
        // this.belongsTo(models.User, {as: 'updater', foreignKey: 'updatedBy'});
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
