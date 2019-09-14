const { User, Company, UserCompany } = require('../models');
const validator         = require('validator');
const { to, TE }        = require('../services/util.service');
const CONFIG            = require('../config/config');

const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const getUniqueKeyFromBody = function(body){ // this is so they can send in 3 options unique_key, email, or phone and it will work
    // let unique_key = body.email;
    let unique_key = body.username;

    if(typeof unique_key === 'undefined'){
        unique_key = null;
    }

    return unique_key;
}
module.exports.getUniqueKeyFromBody = getUniqueKeyFromBody;

const create = async (loggedUser, userInfo) => {
    let unique_key_string = 'username';
    let unique_key, err, errMsg, user, setting;
    let auth_info = {};
    let createInclude = [ 
        {
            association: 'profile',
            through: { taggable: 'profile' }
        },
        {
            association: 'addresses',
            through: { taggable: 'address' }
        },
        {
            association: 'telecoms',
            through: { taggable: 'telecom' }
        }
    ];

    // set fields null value if empty
    if(validator.isEmpty(userInfo.email)) userInfo.email = null;

    // validate form
    unique_key = getUniqueKeyFromBody(userInfo);
    if(!unique_key) TE('An ' + unique_key_string + ' was not entered.');

    // set auth method and validate
    if (!validator.isEmpty(unique_key)) { // checks if only username was sent
        auth_info.method = unique_key_string;
        userInfo[unique_key_string] = unique_key;

        errMsg = 'Invalid ' + unique_key_string;
    } else {
        errMsg = 'A valid ' + unique_key_string + ' was not entered.';
    }

    // set created by
    userInfo.createdBy = loggedUser.id;

    // activate
    userInfo.isActive = true;

    // unset id
    delete(userInfo.id);

    // save to database
    [err, user] = await to(User.create(userInfo));
    if(err) TE(errMsg);

    // switch (userInfo.type) {
    //     case 'client':
    //         // add subscription
    //         [err, user] = await to(user.createSubscription(userInfo.subscription));
    //         if(err) TE('Error adding subscription');

    //         // let companies;
    //         // [err, companies] = await to(Company.bulkCreate(userInfo.companies));
    //         // if(err) TE('Error adding company');

    //         // let user_companies;
    //         // [err, user_companies] = await to(user.addCompanies(companies, { through: { isOwner: true } }));
    //         // if(err) TE('Error adding user company');

    //         break;
    //     case 'student':
    //     case 'coach':
    //         // add companies
    //         let companies;
    //         [err, companies] = await to(Company.findAll({
    //             where: { id: { [Op.in]: userInfo.companies } }
    //         }));

    //         if(companies) await to(user.addCompanies(companies, { through: { isOwner: false } }));

    //         break;
    //     default:
    //         break;
    // }

    return user;
}
module.exports.create = create;