const Sequelize             = require('./../models').Sequelize;
const Company 			    = require('./../models').Company;
const LiveGroupTraining     = require('./../models').LiveGroupTraining;
const PracticeTime          = require('./../models').PracticeTime;
const ShowTime              = require('./../models').ShowTime;
const Topic                 = require('./../models').Topic;
const Category              = require('./../models').Category;
const Op = Sequelize.Op;

const { to, ReE, ReS }      = require('../services/util.service');

let company = async function (req, res, next) {
    let company_id, err, company;
    company_id = req.params.company_id;

    [err, company] = await to(Company.findOne({where:{id:company_id}}));
    if(err) return ReE(res, "err finding company");

    if(!company) return ReE(res, "Company not found with id: "+company_id);
    let user, users_array, users;
    user = req.user;
    [err, users] = await to(company.getUsers());

    users_array = users.map(obj=>String(obj.user));

    if(!users_array.includes(String(user._id))) return ReE(res, "User does not have permission to read app with id: "+app_id);

    req.company = company;
    next();
}
module.exports.company = company;

// let practiceTime = async function (req, res, next) {
//     let practice_time_id, err, practice_time;
//     practice_time_id = req.params.practice_time_id;

//     [err, practice_time] = await to(PracticeTime.findOne({
//         where: { id:practice_time_id },
//         include: [ 
//             {
//                 association: 'coach',
//                 attributes: [ 'id', 'firstName', 'lastName' ]
//             },
//             {
//                 association: 'student',
//                 attributes: [ 'id', 'firstName', 'lastName' ]
//             }
//         ]
//     }));
//     if(err) return ReE(res, "err finding practice");

//     if(!practice_time) return ReE(res, "practice not found with id: " + practice_time_id);
//     let user, users_array, users;
//     user = req.user;
//     [err, users] = await to(practice_time.getUsers());

//     users_array = users.map(obj=>String(obj.user));

//     if(!users_array.includes(String(user._id))) return ReE(res, "User does not have permission to read app with id: "+practice_time_id);

//     req.practice = practice_time;
//     next();
// }
// module.exports.practiceTime = practiceTime;

let showTime = async function (req, res, next) {
    let show_time_id, err, show_time;
    show_time_id = req.params.show_time_id;

    [err, show_time] = await to(ShowTime.findOne({
        where: { id:show_time_id },
        include: [ 
            {
                association: 'coach',
                attributes: [ 'id', 'firstName', 'lastName' ]
            },
            {
                association: 'student',
                attributes: [ 'id', 'firstName', 'lastName' ]
            },
            {
                association: 'topic',
                include: [ 
                    {
                        association: 'questions'
                    }
                ]
            }
        ]
    }));
    if(err) return ReE(res, "err finding show time");

    if(!show_time) return ReE(res, "show time not found with id: " + show_time_id);
    let user, users_array, users;
    user = req.user;
    [err, users] = await to(show_time.getUsers());

    users_array = users.map(obj=>String(obj.user));

    if(!users_array.includes(String(user._id))) return ReE(res, "User does not have permission to read app with id: "+show_time_id);

    req.show = show_time;
    next();
}
module.exports.showTime = showTime;

let live_group_training = async function (req, res, next) {
    let item_id, err, item;
    item_id = req.params.item_id;

    [err, item] = await to(LiveGroupTraining.findOne(
        {
            where: { id: item_id },
            include: [
                { 
                    association: 'speaker',
                    attributes: { 
                        exclude: ['password', 'username']
                    }
                },
                { 
                    association: 'participants',
                    attributes: { 
                        exclude: ['password', 'username']
                    }
                }
            ]
        }
    ));
    if(err) return ReE(res, "err finding training");

    if(!item) return ReE(res, "Training not found with id: " + item_id);

    req.item = item;
    next();
}
module.exports.live_group_training = live_group_training;

let topic = async function (req, res, next) {
    let item_id, err, item;
    item_id = req.params.item_id;

    [err, item] = await to(Topic.findOne({
        where:{ id:item_id },
        include: [ 
            // {
            //     association: 'category',
            //     attributes: [ 'id', 'title' ]
            // },
            'categories',
            {
                association: 'questions',
                include: [
                    {
                        association: 'question',
                        include: [ 'medias' ]
                    }
                ]
            }
        ]
    }));
    if(err) return ReE(res, "err finding topic");

    if(!item) return ReE(res, "Topic not found!");

    req.item = item;
    next();
}
module.exports.topic = topic;

let category = async function (req, res, next) {
    let item_id, err, item;
    item_id = req.params.item_id;

    [err, item] = await to(Category.findOne({where:{ id:item_id }}));
    if(err) return ReE(res, "err finding category");

    if(!item) return ReE(res, "Category not found!");

    req.item = item;
    next();
}
module.exports.category = category;

let categoriesIn = async function (req, res, next) {
    let err;
    let sequelize_op = Category.sequelize.Op;
    let categories = req.body.categories;

    let categoryIds = [];

    for (var i = categories.length - 1; i >= 0; i--) {
        categoryIds.push(categories[i].id);
    }

    // get categories
    [err, categories] = await to(Category.findAll({where:{ id: { [Op.in]: categoryIds } }}));
    if(err) return ReE(res, err, "err finding categories");  

    req.categories = categories;

    next();
}
module.exports.categoriesIn = categoriesIn;