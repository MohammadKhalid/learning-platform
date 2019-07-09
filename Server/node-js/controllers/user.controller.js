const { User, UserCompany, StudentExperienceSettings, Level } = require('../models');
const authService       = require('../services/auth.service');
const userService       = require('../services/user.service');
const { to, ReE, ReS }  = require('../services/util.service');

const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const create = async function(req, res){
    const body = req.body;
    const loggedUser = req.user.toJSON();

    if(!body.email) {
        return ReE(res, 'Please enter an email.');
    } else if(!body.password){
        return ReE(res, 'Please enter a password.');
    } else{
        let err, user;

        [err, user] = await to(userService.create(loggedUser, body));
        console.log(user);
        if(user.type == 'student'){
            const studentExpSettings = await StudentExperienceSettings.findOne({
                where: {
                    adminId: user.createdBy
                }
            })

            const levelSettings = await Level.create({
                studentId: user.id,
                nextExperience: studentExpSettings.initialExperience,
                currentExperience: 0,
                currentLevel: studentExpSettings.initialLevel
            })
        }

        if(err) return ReE(res, err, 422);
    }

    return ReS(res, {message: body.firstName + ' ' + body.lastName + ' has been added.' }, 201);
}
module.exports.create = create;

const getAll = async function(req, res){
    let err, items;
    let loggedUser = req.user;
    let req_query = req.query;
    let rowPerPage = 25;

    let include = [
        {
            association: 'subscription',
            include: [ 'subscriptionPackage' ]
        }
    ];

    if(loggedUser.type === 'company') {
        let companies;
        [err, companies] = await to(UserCompany.findAll({ where: { isOwner: true, userId: loggedUser.id } }));

        let companyIds = [];
        for (let index = 0; index < companies.length; index++) {
            companyIds.push(companies[index].companyId);
        }

        include.push({
            association: 'companies',
            where: {
                id: { [Op.in]: companyIds }
            }
        });
    } else {
        include.push('companies');
    }
    
    let qParams = {
        where: {
            type: req.body.type,
            isActive: true,
            isDeleted: false,
        },
        attributes: ['id', 'firstName', 'lastName'],
        include: include
    };

    // page number
    if(req_query.pageNumber && req_query.pageNumber > 0) {
        qParams.offset = parseInt(req_query.pageNumber) * rowPerPage;
        qParams.limit = rowPerPage;
    }

    // status
    if(req_query.isActive) qParams.where.isActive = req_query.isActive;

    // deleted
    if(req_query.isDeleted) qParams.where.isDeleted = req_query.isDeleted;

    // search keyword
    if(req_query.searchQuery) qParams.where.firstName = { [Op.like]: req_query.searchQuery + '%' };
    [err, items] = await to(User.findAndCountAll(qParams));

    let items_json =[];
    let item_rows = items.rows;

    for( let i in item_rows){
        let item = item_rows[i];
        let item_info = item.toWeb();
        items_json.push(item_info);
    }
    return ReS(res, {items: items_json, count: items.count});
}
module.exports.getAll = getAll;

const getStaff = async function(req, res){
    let err, items;
    let req_query = req.query;
    let rowPerPage = 25;

    let include = [
        {
            association: 'subscription',
            include: [ 'subscriptionPackage' ]
        }
    ];

    if(req.body.type === 'company') {
        let companies;
        [err, companies] = await to(UserCompany.findAll({ where: { isOwner: true, userId: req.params.item_id } }));

        let companyIds = [];
        for (let index = 0; index < companies.length; index++) {
            companyIds.push(companies[index].companyId);
        }

        include.push({
            association: 'companies',
            where: {
                id: { [Op.in]: companyIds }
            }
        });
    } else {
        include.push('companies');
    }

    let qParams = {
        where: {
            type: req_query.type,
            isActive: true,
            isDeleted: false,
        },
        attributes: ['id', 'firstName', 'lastName'],
        include: include
    };

    // page number
    if(req_query.pageNumber && req_query.pageNumber > 0) {
        qParams.offset = parseInt(req_query.pageNumber) * rowPerPage;
        qParams.limit = rowPerPage;
    }

    // status
    if(req_query.isActive) qParams.where.isActive = req_query.isActive;

    // deleted
    if(req_query.isDeleted) qParams.where.isDeleted = req_query.isDeleted;

    // search keyword
    if(req_query.searchQuery) qParams.where.firstName = { [Op.like]: req_query.searchQuery + '%' };
    [err, items] = await to(User.findAndCountAll(qParams));

    let items_json =[];
    let item_rows = items.rows;

    for( let i in item_rows){
        let item = item_rows[i];
        let item_info = item.toWeb();
        items_json.push(item_info);
    }
    return ReS(res, {items: items_json, count: items.count});
}
module.exports.getStaff = getStaff;

const getAllShowTime = async function(req, res){
    let user = req.item;
    let err, items;
    let rowPerPage = 25;
    let whereArgs = { isPractice: false };
    
    let qParams = {
        // attributes: ['id', 'title', 'submitted', 'submittedAt', 'rating'],
        include: [
            {
                association: 'student',
                attributes: ['firstName', 'lastName']
            },
            {
                association: 'coach',
                attributes: ['firstName', 'lastName']
            },
            { 
                association: 'topic',
                attributes: ['title', 'description']
            }
        ],
        offset: parseInt(req.query.pageNumber) * rowPerPage,
        limit: rowPerPage,
        order: [
            ['createdAt', 'DESC'],
            ['submittedAt', 'DESC']
        ]
    };

    // practice
    if(req.isPractice) whereArgs.isPractice = true;

    // search keyword
    if(req.query.searchQuery) whereArgs.title = { [Op.like]: req.query.searchQuery + '%' };

    // append where
    qParams.where = whereArgs;

    [err, items] = await to(user.getShowTimes(qParams));

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

    return ReS(res, {user: user, items: items_json});
}
module.exports.getAllShowTime = getAllShowTime;

const get = function(req, res){
    let item = req.item;
    let item_json = item.toWeb();
    
    item_json.dataCount = item.dataCount;

    return ReS(res, {item: item_json});
}
module.exports.get = get;

const update = async function(req, res){
    const user = req.user;

    let err;
    let item = req.item;
    let data = req.body;
    
    // set value
    item.set(data);

    // @TODO. update profile, address, telecom

    [err, item] = await to(item.save());
    if(err) return ReE(res, err);

    return ReS(res, {item:item.toWeb()});
}
module.exports.update = update;

const remove = async function(req, res){
    let item, err;
    item = req.item;

    // set value
    item.set({isActive: false, isDeleted: true });

    [err, item] = await to(item.save());
    if(err) return ReE(res, 'error occured when trying to delete');

    return ReS(res, {message: item.firstName + ' ' + item.lastName + ' has been deleted!'});
}
module.exports.remove = remove;

const login = async function(req, res){
    const body = req.body;
    let err, user;

    [err, user] = await to(authService.authUser(req.body));
    if(err) return ReE(res, err, 422);

    return ReS(res, {token:user.getJWT(), user:user.toWeb()});
}
module.exports.login = login;

const changeOnlineStatus = async function (data, status) {
       await User.update({
        isLogin: status
    },
        {
            where: {
                id: data.user_id
            }
        })
}
module.exports.changeOnlineStatus = changeOnlineStatus;