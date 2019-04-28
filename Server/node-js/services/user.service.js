const { User, SettingPaymentMethod, Setting, UserEarning, MembershipProduct, Revenue } = require('../models');
const validator         = require('validator');
const { to, TE }        = require('../services/util.service');
const CONFIG            = require('../config/config');

const getUniqueKeyFromBody = function(body){ // this is so they can send in 3 options unique_key, email, or phone and it will work
    let unique_key = body.email;
    if(typeof unique_key === 'undefined'){
        unique_key = null;
    }

    return unique_key;
}
module.exports.getUniqueKeyFromBody = getUniqueKeyFromBody;

const create = async (loggedUser, userInfo) => {
    let unique_key, err, errMsg, user, setting;
    let createInclude = [ 'profile', 'addresses', 'telecoms' ];
    let auth_info = {};

    // set fields null value if empty
    if(validator.isEmpty(userInfo.email)) userInfo.email = null;

    // validate form
    unique_key = getUniqueKeyFromBody(userInfo);
    if(!unique_key) TE('An email was not entered.');

    // set auth method and validate
    if (!validator.isEmpty(unique_key)) { //checks if only phone number was sent
        auth_info.method = 'email';
        userInfo.email = unique_key;

        errMsg = 'Invalid email';
    } else {
        errMsg = 'A valid email was not entered.';
    }

    // set created by
    userInfo.createdBy = loggedUser.id;

    // activate
    userInfo.isActive = true;

    // unset id
    delete(userInfo.id);

    // save to database
    [err, user] = await to(User.create(userInfo,
        { include: createInclude }
    ));

    if(err) TE(errMsg);

    // update user info
    userInfo = user.toJSON();

    return userInfo;
}
module.exports.create = create;