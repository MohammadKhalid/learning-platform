const { LiveGroupTraining, Sequelize, User } = require('../../models');
const { to, ReE, ReS } = require('../../services/util.service');
const Op = Sequelize.Op;

const create = async function (req, res) {
    let err, item, participants;
    let user = req.user;
    let item_info = req.body;

    // speaker id
    item_info.speakerId = user.id;
    console.log(item_info)

    [err, item] = await to(user.createLiveGroupTraining(item_info));
    if (err) return ReE(res, err, 422);

    // response
    let item_json = item.toWeb();

    // participants
    let participantIds = [];

    if (item_info.participants) {
        for (var i = item_info.participants.length - 1; i >= 0; i--) {
            participantIds.push(item_info.participants[i].id);
        }
    }

    if (participantIds.length > 0) {
        [err, participants] = await to(User.findAll({ where: { id: { [Op.in]: participantIds } } }));
        if (err) return ReE(res, err);

        [err, participants] = await to(item.addUsers(participants));
        if (err) return ReE(res, err);
    }

    return ReS(res, { item: item_json, msg: item_json.title + ' has been added!' }, 201);
}
module.exports.create = create;

const getAll = async function (req, res) {
    let user = req.user;
    let err, items;

    const pageNumber = parseInt(req.query.pageNumber) || 0;
    const rowPerPage = parseInt(req.query.limit) || 25;

    // query args
    let whereArgs = {};
    let qParams = {
        include: [
            {
                association: 'users',
                attributes: ['id']
            },
            'speaker'
        ],
        offset: pageNumber * rowPerPage,
        limit: rowPerPage,
        order: [
            ['status', 'ASC'],
            ['date', 'ASC'],
            ['time', 'ASC']
        ]
    };

    // search keyword
    if (req.query.searchQuery) whereArgs.title = { [Op.like]: '%' + req.query.searchQuery + '%' };
    else whereArgs.date = { [Op.gte]: new Date(new Date()) }; // hide past

    // where status
    if (req.query.status && req.query.status !== '') whereArgs.status = req.query.status;

    // append where args
    qParams.where = whereArgs;

    [err, items] = await to(user.getLiveGroupTrainings(qParams));

    let items_json = [];
    let item_rows = items;

    for (let i in item_rows) {
        let item = item_rows[i];
        let item_info = item.toWeb();

        item_info.participants = item_info.users.map((participant) => { return participant.id });
        items_json.push(item_info);
    }
    return ReS(res, { items: items_json, count: items.count });
}
module.exports.getAll = getAll;

const get = async function (req, res) {
    let item_id, err, item, user;
    user = req.user;
    item_id = req.params.item_id;

    [err, item] = await to(user.getLiveGroupTrainings({
        where: { id: item_id },
        include: [
            {
                association: 'speaker',
                attributes: {
                    exclude: ['password', 'username']
                }
            },
            {
                association: 'users',
                attributes: {
                    exclude: ['password', 'username']
                }
            }
        ]
    }));
    if (err) return ReE(res, "err finding topic");
    if (!item || item.length < 1) return ReE(res, "Topic not found!");

    // item
    item = item[0];

    // response
    let item_json = item.toWeb();

    // set participant
    // fix view undefined var
    item_json.participants = item_json.users;

    return ReS(res, { item: item_json });
}
module.exports.get = get;

const update = async function (req, res) {
    let err, item, data;
    let participants = req.participants;

    item = req.item;
    data = req.body;
    item.set(data);

    [err, participants] = await to(item.setParticipants(participants));
    if (err) return ReE(res, err);

    [err, item] = await to(item.save());
    if (err) {
        return ReE(res, err);
    }
    return ReS(res, { item: item.toWeb() });
}
module.exports.update = update;

const start = async function (req, res) {
    let err, item, data;
    item = req.item;
    data = req.body;
    item.set({
        started: data.dateStart
    });

    [err, item] = await to(item.save());
    if (err) {
        return ReE(res, err);
    }
    return ReS(res, { item: item.toWeb() });
}
module.exports.start = start;

const close = async function (req, res) {
    let err, item;
    item = req.item;
    item.set({
        status: 'close'
    });

    [err, item] = await to(item.save());
    if (err) {
        return ReE(res, err);
    }
    return ReS(res, { item: item.toWeb() });
}
module.exports.close = close;

const remove = async function (req, res) {
    let company, err;
    company = req.company;

    [err, company] = await to(company.destroy());
    if (err) return ReE(res, 'error occured trying to delete the company');

    return ReS(res, { message: 'Deleted Company' }, 204);
}
module.exports.remove = remove;

const formInputData = async function (req, res) {
    let err;
    let user = req.user;
    let data = {};

    // assigned companies
    let assignedCompanies;
    [err, assignedCompanies] = await to(user.getAssignedCompanies());
    if (err) return ReE(res, err);

    let assignedCompanyIds = assignedCompanies.map((row) => { return row.companyId });

    // get student users
    [err, data.students] = await to(User.findAll({
        where: {
            type: 'student',
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
            'firstName',
            'lastName',
            [Sequelize.fn('CONCAT', Sequelize.col('firstName'), ' ', Sequelize.col('lastName')), 'name']
        ]
    }));
    if (err) return ReE(res, err);

    return ReS(res, data);
}
module.exports.formInputData = formInputData;