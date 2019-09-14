'use strict';

module.exports = (sequelize, DataTypes) => {
    var Model = sequelize.define('UserTag', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
          userId: {
            type: DataTypes.UUID,
            unique: 'user_tag_taggable'
        },
          taggable: {
            type: DataTypes.STRING,
            unique: 'user_tag_taggable'
        },
          taggableId: {
            type: DataTypes.STRING,
            unique: 'user_tag_taggable',
            references: null
        }
    });

    // Model.associate = function(models) {
    //   this.belongsTo(models.User, {as: 'user', foreignKey: 'userId'});
    //   this.hasMany(models.Department, { as: 'departments', foreignKey: 'userId' });
    // }

    return Model;
};
