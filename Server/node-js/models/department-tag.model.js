'use strict';

module.exports = (sequelize, DataTypes) => {
    var Model = sequelize.define('DepartmentTag', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
          departmentId: {
            type: DataTypes.INTEGER,
            unique: 'department_tag_taggable'
        },
          taggable: {
            type: DataTypes.STRING,
            unique: 'department_tag_taggable'
        },
          taggableId: {
            type: DataTypes.STRING,
            unique: 'department_tag_taggable',
            references: null
        }
    });

    return Model;
};
