'use strict';
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const db = {};
const CONFIG = require('../config/config');

const sequelize = new Sequelize(CONFIG.db_name, CONFIG.db_user, CONFIG.db_password, {
  host: CONFIG.db_host,
  dialect: CONFIG.db_dialect,
  port: CONFIG.db_port,
  // operatorsAliases: false,
  logging: CONFIG.db_log
});

fs.readdirSync(__dirname)
  .filter((file) => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach((file) => {
    let model = sequelize['import'](path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sync = function () {
  // default
  sequelize.sync({ alter: true, force: false }).then((res) => {
    console.log('SYNC DONE');
  }).catch((e) => {
    console.log('ERROR SYNC');
  });

  // deletes all tables then recreates them useful for testing and development purposes
  // deleteAll();
}

function deleteAll() {
  sequelize.sync({ force: true }).then(() => {
    // default users
    db.User.bulkCreate([
      {
        type: 'admin',
        nickName: 'John',
        firstName: 'Juan',
        lastName: 'dela Cruz',
        username: 'admin',
        email: 'admin@thrive19.com',
        password: 'admin',
        isActive: true
      },
      {
        type: 'client',
        nickName: 'ABX',
        firstName: 'ABC',
        lastName: 'XYZ',
        username: 'client',
        email: 'client@thrive19.com',
        password: 'client',
        isActive: true
      },
      {
        type: 'client',
        nickName: '123',
        firstName: '456',
        lastName: '789',
        username: 'client2',
        email: 'client2@thrive19.com',
        password: 'client',
        isActive: true
      }
    ]).then((users) => {
      // default subscription packages
      db.SubscriptionPackage.bulkCreate([
        {
          name: 'Starter',
          description: 'Up to 10 Individual Licenses',
          price: 50,
          priceBasis: 'month',
          priceCurrency: 'AU'
        },
        {
          name: 'Business',
          description: 'Up to 10-100 Individual Licenses',
          price: 80,
          priceBasis: 'month',
          priceCurrency: 'AU'
        },
        {
          name: 'Pro',
          description: 'Up to 100-500 Individual Licenses',
          price: 100,
          priceBasis: 'month',
          priceCurrency: 'AU'
        },
        {
          name: 'Elite',
          description: 'Up to 500-5000 Individual Licenses',
          price: 40,
          priceBasis: 'month',
          priceCurrency: 'AU'
        }
      ]
      ).then((packages) => {
        // package modules
        db.Module.bulkCreate([
          { name: 'user' }
          // { name: 'show-time' },
          // { name: 'live-group-training' },
          // { name: 'ask-expert' },
          // { name: 'certification' }
          // @TODO. add more modules
        ]).then((modules) => {
          // add modules
          for (let index = 0; index < packages.length; index++) {
            var subscriptionPackage = { limit: 10 };
            var _package = packages[index];
            subscriptionPackage.subscriptionPackageId = _package.id;

            for (let index_ = 0; index_ < modules.length; index_++) {
              var _module = modules[index_];
              subscriptionPackage.moduleId = _module.id;
              db.SubscriptionPackageModule.create(subscriptionPackage);
            }
          }
        });

        var d = new Date();
        var year = d.getFullYear();
        var month = d.getMonth();
        var day = d.getDate();
        var c = new Date(year + 3, month, day);

        users.forEach((user) => {
          if (user.type === 'client') {
            db.Subscription.create({
              subscriptionPackageId: 1,
              startedAt: d,
              expireAt: c,
              userId: user.id
            }).then((subscription) => {
              // add client subscription

            });
          }
        });

        console.log('Done!');
      });
    });
  });
}

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;