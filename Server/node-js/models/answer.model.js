'use strict';
const bcrypt            = require('bcrypt');
const bcrypt_p          = require('bcrypt-promise');
const jwt               = require('jsonwebtoken');
const {TE, to}          = require('../services/util.service');
const CONFIG            = require('../config/config');

module.exports = (sequelize, DataTypes) => {
    var Model = sequelize.define('Answer', {
        // answer
        answer: DataTypes.TEXT,

        // result
        isCorrect: DataTypes.BOOLEAN
    });

    Model.associate = function(models) {
        // media (video, audio, photo etc)
        this.belongsToMany(models.Media, { through: 'AnswerMedia', as: 'medias', foreignKey: 'answerId', otherKey: 'mediaId' });
        this.belongsTo(models.Question, { as: 'question', foreignKey: 'questionId', otherKey: 'answerId'});
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
