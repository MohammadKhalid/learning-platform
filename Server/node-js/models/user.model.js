'use strict';
const bcrypt 			= require('bcrypt');
const bcrypt_p 			= require('bcrypt-promise');
const jwt           	= require('jsonwebtoken');
const {TE, to}          = require('../services/util.service');
const CONFIG            = require('../config/config');

module.exports = (sequelize, DataTypes) => {
    var Model = sequelize.define('User', {
        id          : {
                        type: DataTypes.UUID,
                        primaryKey: true,
                        defaultValue: DataTypes.UUIDV4
                    },
        type        : {
                        type: DataTypes.ENUM,
                        values: ['admin', 'client', 'coach', 'student', 'company']
                    },
        email       : {type: DataTypes.STRING, allowNull: true, unique: true, defaultValue: null},
        username    : {type: DataTypes.STRING, allowNull: true, unique: true, validate: { len: {args: [4, 20], msg: "Invalid, too short."} }},
        password    : DataTypes.STRING,
        firstName   : DataTypes.STRING(50),
        lastName    : DataTypes.STRING(50),
        description : DataTypes.TEXT,
        isPublic    : {
                        type: DataTypes.BOOLEAN,
                        defaultValue: false
                    },
        isActive    : {
                        type: DataTypes.BOOLEAN,
                        defaultValue: false
                    },
        isDeleted   : {
                        type: DataTypes.BOOLEAN,
                        defaultValue: false
                    },
        isLogin     : DataTypes.BOOLEAN
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
        // this.belongsToMany(models.ShowTime, {as: 'showTimes', through: 'UserShowTimes', foreignKey: 'userId', otherKey: 'showTimeId'});
        // this.belongsToMany(models.AskExpert, {as: 'askExperts', through: 'UserAskExperts', foreignKey: 'userId', otherKey: 'askExpertId'});
        // this.belongsToMany(models.Media, {as: 'medias', through: 'UserMedias', foreignKey: 'userId', otherKey: 'mediaId'});
        // this.belongsToMany(models.Category, {as: 'categories', through: 'UserCategories', foreignKey: 'userId', otherKey: 'categoryId'});
        // this.belongsToMany(models.Company, {as: 'companies', through: models.UserCompany, foreignKey: 'userId', otherKey: 'companyId'});
        // this.belongsToMany(models.Department, {as: 'departments', through: 'UserDepartments', foreignKey: 'userId', otherKey: 'departmentId'});

        // this.belongsTo(models.User, {as: 'createdByUser', foreignKey: 'createdBy'});
        // this.belongsTo(models.User, {as: 'updatedByUser', foreignKey: 'updatedBy'});

        // this.hasOne(models.UserProfile, {as: 'profile', foreignKey: 'userId'});

        // this.hasMany(models.UserAddress, {as: 'addresses', foreignKey: 'userId'});
        // this.hasMany(models.UserTelecom, {as: 'telecoms', foreignKey: 'userId'});

        this.hasOne(models.Subscription, {as: 'subscription', foreignKey: 'userId'});

        this.belongsToMany(models.Profile, { through: { model: models.UserTag, unique: false }, foreignKey: 'userId', constraints: false, as: 'profiles' });
        this.belongsToMany(models.Address, { through: { model: models.UserTag, unique: false }, foreignKey: 'userId', constraints: false, as: 'addresses' });
        this.belongsToMany(models.Telecom, { through: { model: models.UserTag, unique: false }, foreignKey: 'userId', constraints: false, as: 'telecoms' });
        this.belongsToMany(models.ShowTime, { through: { model: models.UserTag, unique: false }, foreignKey: 'userId', constraints: false, as: 'showTimes' });
        this.belongsToMany(models.Category, { through: { model: models.UserTag, unique: false, scope: { taggable: 'category' } }, foreignKey: 'userId', constraints: false, as: 'categories' });
        this.belongsToMany(models.Topic, { through: { model: models.UserTag, unique: false, scope: { taggable: 'topic' } }, foreignKey: 'userId', constraints: false, as: 'topics' });
        this.belongsToMany(models.Media, { through: { model: models.UserTag, unique: false }, foreignKey: 'userId', constraints: false, as: 'medias' });
        this.belongsToMany(models.LiveGroupTraining, { through: { model: models.UserTag, unique: false }, foreignKey: 'userId', constraints: false, as: 'liveGroupTrainings' });
        // this.belongsToMany(models.AskExpert, { through: { model: models.UserTag, unique: false }, foreignKey: 'userId', constraints: false, as: 'askExperts' });

        this.hasMany(models.UserCompany, {as: 'assignedCompanies', foreignKey: 'userId'});
        this.belongsToMany(models.Company, {as: 'companies', through: models.UserCompany, foreignKey: 'userId', otherKey: 'companyId'});

        this.belongsToMany(models.Department, {
            through: {
              model: models.DepartmentTag,
              unique: false,
              scope: {
                taggable: 'user'
              }
            },
            foreignKey: 'taggableId',
            constraints: false,
            as: 'departments'
        });
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
