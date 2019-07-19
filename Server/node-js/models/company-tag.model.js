'use strict';

module.exports = (sequelize, DataTypes) => {
    var Model = sequelize.define('CompanyTag', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
          companyId: {
            type: DataTypes.INTEGER,
            unique: 'company_tag_taggable'
        },
          taggable: {
            type: DataTypes.STRING,
            unique: 'company_tag_taggable'
        },
          taggableId: {
            type: DataTypes.STRING,
            unique: 'company_tag_taggable',
            references: null
        }
    });

    return Model;
};
