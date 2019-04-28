'use strict';
const bcrypt            = require('bcrypt');
const bcrypt_p          = require('bcrypt-promise');
const jwt               = require('jsonwebtoken');
const {TE, to}          = require('../services/util.service');
const CONFIG            = require('../config/config');

module.exports = (sequelize, DataTypes) => {
    var Model = sequelize.define('Question', {
        question : DataTypes.TEXT,
        script  : DataTypes.TEXT,

        answerLimit : {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
        answerLimitTime : {
            type: DataTypes.INTEGER,
            defaultValue: 30
        },

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
        this.belongsToMany(models.Media, { through: 'QuestionMedia', as: 'medias', foreignKey: 'questionId', otherKey: 'mediaId' });

        // topic question
        // this.belongsToMany(models.TopicQuestion, { through: models.TopicQuestion, as: 'topicQuestions', foreignKey: 'questionId', otherKey: 'topicId' });
        this.hasMany(models.TopicQuestion, { as: 'topicQuestions', foreignKey: 'questionId' });

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
