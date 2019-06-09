'use strict';
const bcrypt 			= require('bcrypt');
const bcrypt_p 			= require('bcrypt-promise');
const jwt           	= require('jsonwebtoken');
const {TE, to}          = require('../services/util.service');
const CONFIG            = require('../config/config');

module.exports = (sequelize, DataTypes) => {
    var Model = sequelize.define('User', {
        id          : {
                        primaryKey: true,
                        type: DataTypes.UUID,
                        defaultValue: DataTypes.UUIDV4
                    },
        type        : {
                        type: DataTypes.ENUM,
                        values: ['admin', 'client', 'coach', 'student', 'company']
                    },
        email       : {type: DataTypes.STRING, allowNull: true, unique: true, defaultValue: null},
        username    : {type: DataTypes.STRING, allowNull: true, unique: true, validate: { len: {args: [7, 20], msg: "Invalid, too short."} }},
        password    : DataTypes.STRING,
        firstName   : DataTypes.STRING(50),
        lastName    : DataTypes.STRING(50),
        description : DataTypes.TEXT,
        isActive    : {
                        type: DataTypes.BOOLEAN,
                        defaultValue: false
                    },
        isDeleted   : {
                        type: DataTypes.BOOLEAN,
                        defaultValue: false
                    },
        isLogin: DataTypes.BOOLEAN
    },
    {
        defaultScope: {
            rawAttributes: { exclude: ['password'] }
        },
        scopes: {
            login: {
                where: {
                    isActive: true
                }
            }
        }
    });

    Model.associate = function(models) {
        this.belongsToMany(models.Company, {as: 'companies', through: 'UserCompany', foreignKey: 'userId', otherKey: 'companyId'});
        this.belongsToMany(models.ShowTime, {as: 'showTimes', through: 'UserShowTime', foreignKey: 'userId', otherKey: 'showTimeId'});
        this.belongsToMany(models.AskExpert, {as: 'askExperts', through: 'UserAskExpert', foreignKey: 'userId', otherKey: 'askExpertId'});

        this.hasOne(models.Subscription, {as: 'subscription', foreignKey: 'userId'});
        this.hasOne(models.UserProfile, {as: 'profile', foreignKey: 'userId'});

        this.belongsTo(models.User, {as: 'createdByUser', foreignKey: 'createdBy'});
        this.belongsTo(models.User, {as: 'updatedByUser', foreignKey: 'updatedBy'});

        // this.belongsToMany(models.LiveGroupTraining, {as: 'liveGroupTrainings', through: 'UserLiveGroupTraining', foreignKey: 'userId', otherKey: 'liveGroupTrainingId'});
        // this.belongsToMany(models.PracticeTime, {as: 'practiceTimes', through: 'UserPracticeTime', foreignKey: 'userId', otherKey: 'practiceTimeId'});
        // this.belongsToMany(models.ShowTime, {as: 'showTimes', through: 'UserShowTime', foreignKey: 'userId', otherKey: 'showTimeId'});

        this.hasMany(models.UserAddress, {as: 'addresses', foreignKey: 'userId'});
        this.hasMany(models.UserTelecom, {as: 'telecoms', foreignKey: 'userId'});
    };

    Model.beforeSave(async (user, options) => {
        let err;
        if (user.changed('password')){
            let salt, hash
            [err, salt] = await to(bcrypt.genSalt(10));
            if(err) TE(err.message, true);

            [err, hash] = await to(bcrypt.hash(user.password, salt));
            if(err) TE(err.message, true);

            user.password = hash;
        }
    });

    Model.beforeBulkCreate(async (users, options) => {
        let err, user;

        for (var i = users.length - 1; i >= 0; i--) {
            user = users[i];

            if(user.changed('password')){

                let salt, hash
                [err, salt] = await to(bcrypt.genSalt(10));
                if(err) TE(err.message, true);

                [err, hash] = await to(bcrypt.hash(user.password, salt));
                if(err) TE(err.message, true);

                user.password = hash;
            }
        }
    });

    Model.prototype.comparePassword = async function (pw) {
        let err, pass
        if(!this.password) TE('password not set');

        [err, pass] = await to(bcrypt_p.compare(pw, this.password));
        if(err) TE(err);

        if(!pass) TE('invalid password');

        return this;
    }

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
