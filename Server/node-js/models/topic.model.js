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
        }
    });

    Model.associate = function(models) {
        // questions
        this.hasMany(models.TopicQuestion, { as: 'questions', foreignKey: 'topicId' });
        // this.belongsToMany(models.Question, { through: models.TopicQuestion, as: 'questions', foreignKey: 'topicId', otherKey: 'questionId' });
        // this.belongsToMany(models.Question, { through: models.TopicQuestion, as: 'questions', foreignKey: 'topicId', otherKey: 'questionId' });

        // topic
        this.hasMany(models.ShowTime, { as: 'showTimes', foreignKey: 'topicId' });

        // category
        this.belongsToMany(models.Category, { through: 'CategoryTopic', as: 'categories', foreignKey: 'topicId' });

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
