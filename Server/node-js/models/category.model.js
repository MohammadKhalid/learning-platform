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
        isPublic    : {
            type: DataTypes.BOOLEAN,
            defaultValue: false
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
        // self reference as sub category
        this.belongsToMany(models.Category, { as: 'parents', through: 'CategoryParents', foreignKey: 'categoryId' });

        // // company
        // this.belongsToMany(models.Company, { 
        //     through: { 
        //       model: models.CompanyTag,
        //       unique: false,
        //       scope: {
        //         taggable: 'category'
        //       }
        //     },
        //     foreignKey: 'taggableId',
        //     constraints: false,
        //     as: 'companies'
        // });

        // // topic
        // // this.belongsToMany(models.Topic, { through: 'CategoryTopics', as: 'topics', foreignKey: 'categoryId', otherKey: 'topicId' });
        this.belongsToMany(models.Topic, { 
            through: { 
              model: models.TopicTag,
              unique: false,
              scope: {
                taggable: 'category'
              }
            },
            foreignKey: 'taggableId',
            constraints: false,
            as: 'topics'
        });

        // user
        this.belongsToMany(models.User, { 
            through: { 
              model: models.UserTag,
              unique: false,
              scope: {
                taggable: 'category'
              }
            },
            foreignKey: 'taggableId',
            constraints: false,
            as: 'users'
        });

        this.belongsToMany(models.Company, { 
            through: { 
              model: models.CompanyTag,
              unique: false,
              scope: {
                taggable: 'category'
              }
            },
            foreignKey: 'taggableId',
            constraints: false,
            as: 'companies'
        });

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
