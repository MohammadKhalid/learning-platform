const User         = require('./../models').User;
const { to, ReE, ReS } = require('../services/util.service');

let profile = async function (req, res, next) {
    req.body.id = req.user.id;
    next();
}
module.exports.profile = profile;

let company = async function (req, res, next) {
    req.body.type = 'company';
    next();
}
module.exports.company = company;

let coach = async function (req, res, next) {
    req.body.type = 'coach';
    next();
}
module.exports.coach = coach;

let student = async function (req, res, next) {
    req.body.type = 'student';
    next();
}
module.exports.student = student;

let admin = async function (req, res, next) {
    req.body.type = 'admin';
    next();
}
module.exports.admin = admin;

let item = async function (req, res, next) {
    let item_id, err, item;
    item_id = req.params.item_id || req.body.id;

    [err, item] = await to(User.findOne({
        where: { id:item_id },
        include: [
            'profile',
            'addresses',
            'telecoms'
        ]
    }));
    if(err) return ReE(res, "err finding");
    if(!item) return ReE(res, "not found with id: " + item_id);

    // count data
    item.dataCount = {};

    switch (item.type) {
        case 'student':
        case 'coach':
            const [err, practiceTimeCount] =   await to(item.getShowTimes({ where: { isPractice: true } }));  
            if(err) return ReE(res, "err finding user practice time");

            item.dataCount.practiceTimeCount = practiceTimeCount.length;
            break;
        default:
            break;
    }

    req.item = item;
    next();
}
module.exports.item = item;

let role = async function (req, res, next) {
    let user = req.user;
    let authorized_user_types_array = [];

    if(req.body.type) {
        switch (req.body.type) {
            case 'admin':
            case 'company':
            case 'coach':
                authorized_user_types_array.push('admin');
                break;
            case 'student':
                authorized_user_types_array.push('admin', 'coach');
                break;
            default:
                break;
        }

        if(!authorized_user_types_array.includes(user.type)) return ReE(res, "Permission denied!");
    } else {
        if(user.id !== req.body.id) return ReE(res, "Permission denied!");
    }

    next();
}
module.exports.role = role;