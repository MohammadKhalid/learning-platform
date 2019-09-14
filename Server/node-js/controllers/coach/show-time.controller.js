const { Sequelize, ShowTime, User, Topic } = require('../../models');
const { to, ReE, ReS } = require('../../services/util.service');
const multiparty = require('multiparty');
const fs = require('fs');
const util = require('util');
const ffmpeg = require('ffmpeg');
const mandrill = require('mandrill-api/mandrill');
const { send_message } = require('../../services/mail.service');
const extractFrames = require('ffmpeg-extract-frames');
const Op = Sequelize.Op;

const getAll = async function(req, res){
    let user = req.user;
    let err, items;

    const pageNumber = parseInt(req.query.pageNumber) || 0;
    const rowPerPage = parseInt(req.query.limit) || 25;
    
    // query args
    let whereArgs = { isPractice: req.isPractice || false };
    let qParams = {
        // attributes: ['id', 'title', 'submitted', 'submittedAt', 'rating'],
        include: [
            {
                association: 'coach',
                attributes: ['firstName', 'lastName']
            },
            { 
                association: 'topic',
                attributes: ['title', 'description']
            },
            {
                association: 'student',
                attributes: ['firstName', 'lastName']
            }
        ],
        offset: pageNumber * rowPerPage,
        limit: rowPerPage,
        order: [
            ['createdAt', 'DESC'],
            ['submittedAt', 'DESC']
        ]
    };

    // search keyword
    if(req.query.searchQuery) whereArgs.title = { [Op.like]: req.query.searchQuery + '%' };

    // filter by user
    if(req.query.userId) whereArgs.userId = req.query.userId;
    if(req.query.submittedTo) whereArgs.submittedTo = req.query.submittedTo;

    // append where
    qParams.where = whereArgs;

    // get
    [err, items] = await to(user.getShowTimes(qParams));
    if(err) return ReE(res, err);

    let items_json =[]
    for( let i in items){
        let item = items[i];
        let users =  item.users;
        let item_info = item.toWeb();
        let users_info = [];
        for (let i in users){
            let user = users[i];
            // let user_info = user.toJSON();
            users_info.push({user:user.id});
        }
        item_info.users = users_info;
        items_json.push(item_info);
    }

    return ReS(res, {items: items_json});
}
module.exports.getAll = getAll;

const get = async function(req, res){
    let item_id, err, item, user;

    user = req.user;
    item_id = req.params.item_id;

    [err, item] = await to(user.getShowTimes({
        where: { id: item_id },
        include: [ 
            {
                association: 'answers',
                include: ['medias']
            },
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
                        association: 'questions',
                        include: [ 
                            {
                                association: 'question',
                                include: ['medias']
                            }
                        ]
                    }
                ]
            }
        ]
    }));
    if(err) return ReE(res, "err finding");
    if(!item || item.length < 1) return ReE(res, "not found with id: " + item_id);

    // item
    item = item[0];

    return ReS(res, {item: item.toWeb()});
}
module.exports.get = get;

const updateReview = async function(req, res){
    let err, item, data;

    user = req.user;
    data = req.body;
    item_id = req.params.item_id;

    // load item
    [err, item] = await to(user.getShowTimes({ where: { id: item_id } }));
    if(err) return ReE(res, "err finding");
    if(!item || item.length < 1) return ReE(res, "not found with id: " + item_id);

    // item
    item = item[0];
    
    // set item val
    item.set(data);

    // save
    [err, item] = await to(item.save());
    if(err) return ReE(res, err);

    // @TODO. notify related users

    return ReS(res, {item: item.toWeb()});
}
module.exports.updateReview = updateReview;

const formInputData = async function(req, res){
    let err;
    let user = req.user;
    let data = {};

    // assigned companies
    let assignedCompanies;
    [err, assignedCompanies] = await to(user.getAssignedCompanies());
    if(err) return ReE(res, err);

    let assignedCompanyIds = assignedCompanies.map((row) => { return row.companyId});

    // get topics
    [err, data.topics] = await to(Topic.findAll({
        include: [
            {
                association: 'companies',
                attributes: ['id', 'name'],
                where: {
                    id: { [Op.in]: assignedCompanyIds }
                }
            },
            {
                association: 'categories',
                attributes: ['id', 'title'],
                required: false
            },
            {
                association: 'questions',
                include: [
                    {
                        association: 'question',
                        include: 'medias'
                    }
                ]
            }
        ]
    }));
    if(err) return ReE(res, err);

    // get coach users
    [err, data.coaches] = await to(User.findAll({
        where: {
            type: 'coach',
            isActive: true
        },
        include: [
            {
                association: 'assignedCompanies',
                where: {
                    companyId: { 
                        [Op.in]: assignedCompanyIds 
                    }
                }
            }
        ],
        attributes: [
            'id',
            [Sequelize.fn('CONCAT', Sequelize.col('firstName'), ' ', Sequelize.col('lastName')), 'name']
        ]
    }));
    if(err) return ReE(res, err);

    return ReS(res, data);
}
module.exports.formInputData = formInputData;