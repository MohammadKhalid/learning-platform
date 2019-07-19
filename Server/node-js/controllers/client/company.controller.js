const { Sequelize, Company, Department, DepartmentTag, UserTag, User } = require('../../models');
const { to, ReE, ReS } = require('../../services/util.service');
const Op = Sequelize.Op;

const create = async function(req, res){
    let err, item, user, item_info, item_json = {};
    
    item_info = req.body;
    user = req.user;

    // create
    [err, item] = await to(user.createCompany(item_info, { include: [ 'departments' ] }));
    if(err) return ReE(res, err, 422);

    // selected department
    if(item_info.departmentIds && item_info.departmentIds.length > 0) {
        let selectedDepartments;
        [err, selectedDepartments] = await to(user.getDepartments({ where: { id: { [Op.in]: item_info.departmentIds } }}));
        if(err) return ReE(res, err);

        if(selectedDepartments && selectedDepartments.length > 0) {
            [err, selectedDepartments] = await to(item.addDepartments(selectedDepartments));
            if(err) return ReE(res, err);
        }
    }

    // tag user departments
    [err, user.departments] = await to(user.addDepartments(item.departments));
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
            { all: true }
            // { 
            //     association: 'owner',
            //     attributes: ['id', 'firstName', 'lastName']
            // }
        ],
        offset: pageNumber * rowPerPage,
        limit: rowPerPage,
        order: [['name', 'ASC']]
    };

    // search keyword
    if(req.query.searchQuery) whereArgs.name = { [Op.like]: '%' + req.query.searchQuery + '%' };

    // append where args
    qParams.where = whereArgs;

    // ge companies
    [err, items] = await to(user.getCompanies(qParams));
    if(err) return ReE(res, err);

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

    [err, item] = await to(user.getCompanies({
        where: { id: item_id },
        attributes: ['id', 'name', 'description', 'address', 'country', 'email', 'phone', 'fax'],
        include: [
            // { all: true, nested: 'all' }
            {
                association: 'owner',
                attributes: [
                    'id',
                    [Sequelize.fn('CONCAT', Sequelize.col('owner.firstName'), ' ', Sequelize.col('owner.lastName')), 'name']
                ]
            },
            {
                association: 'students',
                attributes: ['id', 'firstName', 'lastName']
            },
            {
                association: 'coaches',
                attributes: ['id', 'firstName', 'lastName']
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
    if(err) return ReE(res, err);
    if(!item || item.length < 1) return ReE(res, "Company not found!");

    // set item
    item = item[0];

    // response
    let item_json = item.toWeb();

    // set owner
    if(item_json.owner && item_json.owner.length > 0) item_json.owner = item_json.owner[0];

    return ReS(res, {item: item_json});
}
module.exports.get = get;

const update = async function(req, res){
    let item, item_id, err, user, selectedDepartments, deletedDepartmentIds, departmentIds;

    deletedDepartmentIds = [];
    user = req.user;
    item_id = req.params.item_id;
    data = req.body;
    
    [err, item] = await to(user.getCompanies({ 
        where: { id: item_id }, 
        include: [
            {
                association: 'departments'
            }
        ]
    }));
    if(err) return ReE(res, "err finding company");
    if(!item || item.length < 1) return ReE(res, "Company not found!");

    // set item
    item = item[0];

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
    [err, selectedDepartments] = await to(user.getDepartments({ where: { id: { [Op.in]: data.departmentIds } }}));
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

        [err, user.departments] = await to(user.addDepartments(newDepartments));
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
    let item, item_id, err, departments, user;
    user = req.user;
    item_id = req.params.item_id;
    
    [err, item] = await to(user.getCompanies(
        {
            where: { id: item_id }
        }));
    if(err) return ReE(res, "err finding company");
    if(!item || item.length < 1) return ReE(res, "Company not found!");

    // set item
    item = item[0];

    // remove associations
    // department
    [err, departments] = await to(item.setDepartments([]));
    if(err) return ReE(res, err);

    // remove item
    [err, item] = await to(item.destroy());
    if(err) return ReE(res, 'error occured trying to delete the company');

    return ReS(res, {message:'Company deleted!'}, 204);
}
module.exports.remove = remove;

const formInputData = async function(req, res){
    let err;
    let user = req.user;
    let data = {};

    // [err, data.companies] = await to(user.getCompanies({ include: [ { all: true }] }));
    // if(err) return ReE(res, err);

    // console.log('COMP COUNT', data.companies.length);

    [err, data.departments] = await to(user.getDepartments());
    if(err) return ReE(res, err);

    return ReS(res, data);
}
module.exports.formInputData = formInputData;