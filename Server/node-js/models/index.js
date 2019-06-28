'use strict';
const fs        = require('fs');
const path      = require('path');
const Sequelize = require('sequelize');
const basename  = path.basename(__filename);
const db        = {};
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

db.sync = function() {
    // default
    sequelize.sync({ /*alter: true,*/ force: false }).then((res) => {
      // console.log('SYNC RESULT ', res);
    }).catch((e) => {
      console.log('ERROR SYNC');
    });
    // sequelize.sync();
          
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
        username: 'admin123',
        email: 'admin@thrive19.com',
        password: 'admin',
        isActive: true
    },
    {
        type: 'coach',
        nickName: 'Mark',
        firstName: 'Mark',
        lastName: 'Arroyo',
        username: 'coach123',
        email: 'coach@thrive19.com',
        password: 'coach',
        isActive: true
    },
    {
        type: 'coach',
        nickName: 'Anton',
        firstName: 'Antonio',
        lastName: 'Lauren',
        username: 'coach1234',
        email: 'coach2@thrive19.com',
        password: 'coach',
        isActive: true
    }
  ]);

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

      db.Subscription.create({
          subscriptionPackageId: 1,
          startedAt: d,
          expireAt: c
      }).then((subscription) => {
        // default client
        db.User.create({
          type: 'company',
          nickName: 'Thrive',
          firstName: 'Thrive',
          lastName: '19',
          username: 'company',
          email: 'client@thrive19.com',
          password: 'company',
          isActive: true,
          subscriptionId: subscription.id
        }).then((user) => {
          // add company with users
          db.Company.create({
              name: 'Company X',
              users: [
                {
                type: 'student',
                nickName: 'Jason',
                firstName: 'Jason',
                lastName: 'Estrada',
                username: 'student123',
                email: 'student@thrive19.com',
                password: 'student',
                isActive: true,
                subscriptionId: subscription.id
                },
                {
                  type: 'student',
                  nickName: 'Jean',
                  firstName: 'Jean',
                  lastName: 'Grey',
                  username: 'student1234',
                  email: 'student2@thrive19.com',
                  password: 'student',
                  isActive: true,
                  subscriptionId: subscription.id
                }
              ],
            }, {
              include: [
                'users'
              ]
            }).then((company) => {
              user.addCompany(company, { through: { isOwner: true } });
            });
        });
      
      });
    });

    // Temp add Question
    db.Question.bulkCreate([
      { question: '1+1' },
      { question: '2+2' },
      { question: '3+3' }
    ]).then((questions) => {
      
      // default topics
      db.Topic.create({
          title: 'TEST Topic', 
          description: 'Test 123', 
          content: "Test Content ....", 
          isActive: true
      }).then((topic) => {
          // add questions

          for (var i = questions.length - 1; i >= 0; i--) {
              topic.addQuestion(questions[i], { through: { number: i }});
              topic.save();
          }
      });
    });

    db.Topic.bulkCreate([
      {
          title: 'Sale Intro', 
          description: 'If you are brand new in the industry, have been selling a little while or have sold for years; this video gives you an introduction to the most successful selling system in the motor trade. Discover fresh new strategies and insights, plus tried and tested processes.', 
          content: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).", 
          // significance: "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc.", 
          // hint: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
          isActive: true
      },
      {
          title: 'Walk, Drive Apprasial and Introduction to Your Manager', 
          description: "Being able to adapt to the different 'types' of customers is vital to be successful in selling cars. In this video discover the '4 Buyer Types' and exactly what to do to get each of them onside, so you can sell them a vehicle.", 
          content: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.", 
          // significance: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).", 
          // hint: "If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc.",
          isActive: true
      },
      {
          title: 'Overcoming Buyers Resistance', 
          description: 'So many sales are lost within the first few minutes because of the buyers resistance. In this video we discuss the different types of resistance and how to overcome them to allow you to do your job properly', 
          content: "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc.", 
          // significance: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.", 
          // hint: 'The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from "de Finibus Bonorum et Malorum" by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.',
          isActive: true
      }
    ]);
  });
}

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;