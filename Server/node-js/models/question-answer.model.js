'use strict';
const bcrypt            = require('bcrypt');
const bcrypt_p          = require('bcrypt-promise');
const jwt               = require('jsonwebtoken');
const {TE, to}          = require('../services/util.service');
const CONFIG            = require('../config/config');

module.exports = (sequelize, DataTypes) => {
    var Model = sequelize.define('QuestionAnswer', {
        text: DataTypes.TEXT
    });

    Model.associate = function(models) {
        // media (video, audio, photo etc)
        this.belongsToMany(models.Media, { through: 'QuestionAnswerMedia', as: 'medias', foreignKey: 'questionAnswerId', otherKey: 'mediaId' });

        // self reference
        this.belongsToMany(models.QuestionAnswer, { as: 'questionAnswerChildren', through: 'QuestionAnswerChildren', foreignKey: 'questionAnswerId' });

        // user
        this.belongsTo(models.User, {as: 'user', foreignKey: 'userId', otherKey: 'userId'});
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
