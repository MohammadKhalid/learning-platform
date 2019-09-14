const { Sequelize, Company, User, Department, DepartmentTag } = require('../../models');
const { to, ReE, ReS } = require('../../services/util.service');
const Op = Sequelize.Op;

const create = async function(req, res){
    let err, item, client;
    let item_info = req.body;

    // load client
    [err, client] = await to(User.findByPk(item_info.clientId));
    if(err) return ReE(res, err);
    if(!client) return ReE(res, 'Not found!');

    // create
    [err, item] = await to(client.createCompany(item_info, { include: [ 'departments' ] }));
    if(err) return ReE(res, err, 422);

    // selected department
    if(item_info.departmentIds && item_info.departmentIds.length > 0) {
        let selectedDepartments;
        [err, selectedDepartments] = await to(client.getDepartments({ where: { id: { [Op.in]: item_info.departmentIds } }}));
        if(err) return ReE(res, err);

        if(selectedDepartments && selectedDepartments.length > 0) {
            [err, selectedDepartments] = await to(item.addDepartments(selectedDepartments));
            if(err) return ReE(res, err);
        }
    }

    // tag user departments
    [err, client].departments = await to(client.addDepartments(item.departments));
    if(err) return ReE(res, err, 422);

    // set response format
    item_json = item.toWeb();

    return ReS(res, {item: item_json}, 201);
}
module.exports.create = create;

const getAll = async function(req, res){
    let user = req.user;
    let err, items;

    const pageNumber = parseInt(req.query.pageNumber) || 0;
    const rowPerPage = parseInt(req.query.limit) || 25;
    
    // query args
    let whereArgs = {};
    let qParams = {
        include: [
            { 
                association: 'owner',
                attributes: ['id', 'firstName', 'lastName']
            }
        ],
        offset: pageNumber * rowPerPage,
        limit: rowPerPage,
        order: [['name', 'ASC']]
    };

    // search keyword
    if(req.query.searchQuery) whereArgs.name = { [Op.like]: '%' + req.query.searchQuery + '%' };

    // append where args
    qParams.where = whereArgs;

    // get companies
    [err, items] = await to(Company.findAll(qParams));

    let items_json =[]
    for( let i in items){
        let item = items[i];
        let item_info = item.toWeb();
        items_json.push(item_info);
    }

    return ReS(res, {items: items_json});
}
module.exports.getAll = getAll;

const get = async function(req, res){
    let item_id, err, item, user;
    user = req.user;
    item_id = req.params.item_id;

    [err, item] = await to(Company.findByPk(item_id, {
        attributes: ['id', 'name', 'description', 'address', 'country', 'email', 'phone', 'fax'],
        include: [
            {
                association: 'owner',
                attributes: [
                    'id',
                    [Sequelize.fn('CONCAT', Sequelize.col('owner.firstName'), ' ', Sequelize.col('owner.lastName')), 'name']
                ]
            },
            {
                association: 'students',
                attributes: [
                    'id',
                    [Sequelize.fn('CONCAT', Sequelize.col('students.firstName'), ' ', Sequelize.col('students.lastName')), 'name']
                ]
            },
            {
                association: 'coaches',
                attributes: [
                    'id',
                    [Sequelize.fn('CONCAT', Sequelize.col('coaches.firstName'), ' ', Sequelize.col('coaches.lastName')), 'name']
                ]
            },
            {
                association: 'departments',
                attributes: ['id', 'name']
            },
            {
                association: 'topics',
                attributes: ['id', 'title']
            }
        ]
    }));
    if(err) return ReE(res, "err finding topic");
    if(!item) return ReE(res, "Company not found!");

    // response
    let item_json = item.toWeb();

    // set owner
    if(item_json.owner && item_json.owner.length > 0) item_json.owner = item_json.owner[0];

    return ReS(res, {item: item_json});
}
module.exports.get = get;

const update = async function(req, res){
    let item, item_id, err, client, selectedDepartments, deletedDepartmentIds, departmentIds;
    item_id = req.params.item_id;
    data = req.body;
    deletedDepartmentIds = [];

    [err, item] = await to(Company.findByPk(item_id, {
        where: { id: item_id }, 
        include: [
            {
                association: 'departments'
            }
        ]
    }));
    if(err) return ReE(res, "err finding topic");
    if(!item) return ReE(res, "Company not found!");

    // load client
    [err, client] = await to(User.findByPk(data.clientId));
    if(err) return ReE(res, err);
    if(!client) return ReE(res, 'Not found!');

    // get department ids
    deletedDepartmentIds = item.departments.map((row) => { return row.id});

    // delete department
    // fix setDepartments
    delete item.departments;
    
    // update item
    item.set(data);
    [err, item] = await to(item.save());
    let item_json = item.toWeb();

    // departments by id
    [err, selectedDepartments] = await to(client.getDepartments({ where: { id: { [Op.in]: data.departmentIds } }}));
    if(err) return ReE(res, err);

    [err, itemSelectedDepartments] = await to(item.setDepartments(selectedDepartments));
    if(err) return ReE(res, err);

    // collect ids
    departmentIds = selectedDepartments.map((row) => { return row.id;});

    // create new departments
    if(data.departments && data.departments.length > 0) {
        let newDepartments;
        [err, newDepartments] = await to(Department.bulkCreate(data.departments));
        if(err) return ReE(res, err);

        [err, item] = await to(item.addDepartments(newDepartments));
        if(err) return ReE(res, err);

        [err, client.departments] = await to(client.addDepartments(newDepartments));
        if(err) return ReE(res, err);
    }

    for (let index = 0; index < departmentIds.length; index++) {
        const departmentId = departmentIds[index];
        const deletedDepartmentIdIndex = deletedDepartmentIds.indexOf(departmentId);

        if (deletedDepartmentIdIndex > -1) {
            deletedDepartmentIds.splice(deletedDepartmentIdIndex, 1);
        }
    }

    // remove user departments
    if(deletedDepartmentIds.length > 0) {
        let deletedUserDepartments;
        [err, deletedUserDepartments] = await to(DepartmentTag.destroy({ where: { departmentId: { [Op.in]: deletedDepartmentIds }, taggable: 'assignedCompany' } }));
        if(err) return ReE(res, err);
    }

    return ReS(res, {item: item_json});
}
module.exports.update = update;

const remove = async function(req, res){
    let item, item_id, err, departments;
    item_id = req.params.item_id;
    
    [err, item] = await to(Company.findByPk(item_id));
    if(err) return ReE(res, "err finding topic");
    if(!item) return ReE(res, "Company not found!");

    // remove associations
    // department
    [err, departments] = await to(item.setDepartments([]));
    if(err) return ReE(res, err);

    // remove item
    [err, item] = await to(item.destroy());
    if(err) return ReE(res, 'error occured trying to delete the company');

    return ReS(res, {message:'Deleted Company'}, 204);
}
module.exports.remove = remove;

const formInputData = async function(req, res){
    let err;
    let user = req.user;
    let data = {};

    [err, data.clients] = await to(User.findAll({
        where: { type: 'client' },
        include: [
            {
                association: 'departments',
                attributes: ['id', 'name']
            }
        ]
    }));
    if(err) return ReE(res, err);

    return ReS(res, data);
}
module.exports.formInputData = formInputData;