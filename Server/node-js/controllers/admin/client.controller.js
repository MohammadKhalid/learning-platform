const { User, SubscriptionPackage } = require('../../models');
const userService       = require('../../services/user.service');
const { to, ReE, ReS }  = require('../../services/util.service');

const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const create = async function(req, res){
    let err, user;
    let body = req.body;
    let loggedUser = req.user.toJSON();

    // set user type
    body.type = 'client';

    if(!body.username) {
        return ReE(res, 'Please enter a username.');
    // Require Email
    // } else if(!body.email) {
    //     return ReE(res, 'Please enter an email.');
    // } 
    } else if(!body.password){
        return ReE(res, 'Please enter a password.');
    } else{
        [err, user] = await to(userService.create(loggedUser, body));

        if(err) return ReE(res, err, 422);
    }

    // add subscription
    [err, user.subscription] = await to(user.createSubscription(body.subscription));
    if(err) TE('Error adding subscription');

    return ReS(res, { id: user.id, message: body.firstName + ' ' + body.lastName + ' has been added.' }, 201);
}
module.exports.create = create;

const getAll = async function(req, res){
    let err, items;
    let req_query = req.query;

    // query args
    const pageNumber = parseInt(req.query.pageNumber) || 0;
    const rowPerPage = parseInt(req.query.limit) || 25;

    let qParams = {
        where: {
            type: 'client',
            isActive: true
        },
        include: [
            'companies',
            {
                association: 'subscription',
                include: 'subscriptionPackage'
            }
        ],
        attributes: ['id', 'firstName', 'lastName'],
        offset: pageNumber * rowPerPage,
        limit: rowPerPage
    };

    // status
    if(req_query.isActive) qParams.where.isActive = req_query.isActive;

    // deleted
    if(req_query.isDeleted) qParams.where.isDeleted = req_query.isDeleted;

    // search keyword
    if(req_query.searchQuery) qParams.where.firstName = { [Op.like]: req_query.searchQuery + '%' };
    [err, items] = await to(User.findAll(qParams));
    if(err) return ReE(res, err);

    let items_json =[];
    let item_rows = items;

    for( let i in item_rows){
        let item = item_rows[i];
        let item_info = item.toWeb();
        items_json.push(item_info);
    }
    return ReS(res, {items: items_json});
}
module.exports.getAll = getAll;

const get = async function(req, res){
    let item_id, err, item;
    item_id = req.params.item_id;

    [err, item] = await to(User.findByPk(item_id, {
        include: [
            {
                association: 'companies',
                include: [
                    {
                        association: 'departments'
                    }
                ]
            }
        ]
    }));
    if(err) return ReE(res, "err finding client");
    if(!item) return ReE(res, "Client not found!");

    return ReS(res, {item: item.toWeb()});
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
    let item_id, err, item;
    item_id = req.params.item_id;

    [err, item] = await to(User.findByPk(item_id));
    if(err) return ReE(res, "err finding client");
    if(!item) return ReE(res, "Client not found!");

    // @TODO. remove associations
    // user transaction method ???

    // get companies
    let companies;
    [errr, companies] = await to(item.getCompanies());
    if(err) return ReE(res, err);

    // build ids
    let companyIds = companies.map((row) => { return row.id});

    // users
    let itemUsers;
    [err, itemUsers] = await to(User.findAll({
        include: [
            {
                association: 'assignedCompanies',
                where: {
                    companyId: { 
                        [Op.in]: companyIds 
                    }
                }
            }
        ]
    }));
    if(err) return ReE(res, err);

    itemUsers.forEach(async (itemUser) => {
        await to(itemUser.setTopics([]));
        await to(itemUser.setProfiles([]));
        await to(itemUser.setAddresses([]));
        await to(itemUser.setTelecoms([]));
        await to(itemUser.setShowTimes([]));
        await to(itemUser.setCategories([]));
        await to(itemUser.setMedias([]));
        await to(itemUser.setAssignedCompanies([]));
        await to(itemUser.setCompanies([]));
        await to(itemUser.setDepartments([]));

        await to(itemUser.destroy());
    });

    await to(item.setTopics([]));
    await to(item.setProfiles([]));
    await to(item.setAddresses([]));
    await to(item.setTelecoms([]));
    await to(item.setShowTimes([]));
    await to(item.setCategories([]));
    await to(item.setMedias([]));
    await to(item.setCompanies([]));
    await to(item.setDepartments([]));

    // delete
    [err, item] = await to(item.destroy());
    if(err) return ReE(res, 'error occured when trying to delete');

    return ReS(res, {message: item.firstName + ' ' + item.lastName + ' has been deleted!'});
}
module.exports.remove = remove;

const formInputData = async function(req, res){
    let err, subsription_packages, data = {};

    [err, subsription_packages] = await to(SubscriptionPackage.findAll());

    let subsription_packages_json = [];
    for(let i in subsription_packages){
        let subsription_package = subsription_packages[i];
        let subsription_package_info = subsription_package.toWeb();
        
        subsription_packages_json.push(subsription_package_info);
    }
    data.subsription_packages = subsription_packages_json;

    return ReS(res, data);
}
module.exports.formInputData = formInputData;