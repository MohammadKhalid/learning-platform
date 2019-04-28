const { User } = require('../models');
const validator     = require('validator');
const { to, TE }    = require('../services/util.service');

const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const getUniqueKeyFromBody = function(body){ // this is so they can send in 3 options unique_key, email, or phone and it will work
    let unique_key = body.username;
    if(typeof unique_key === 'undefined'){
        unique_key = null;
    }

    return unique_key;
}
module.exports.getUniqueKeyFromBody = getUniqueKeyFromBody;

const authUser = async function(userInfo){ //returns token
    let unique_key;
    let auth_info = {};

    const invalidLoginMsg = 'Invalid login';
    auth_info.status = 'login';
    unique_key = getUniqueKeyFromBody(userInfo);

    if(!unique_key) TE('Please enter your email');


    if(!userInfo.password) TE('Please enter a password to login');

    let user;
    if(!validator.isEmpty(unique_key)){
        auth_info.method='email';

        [err, user] = await to(User.scope('login').findOne({
            where:{
                [Op.or]: [{email: unique_key}, {username: unique_key}]
            }
        }));
        if(err) TE(err.message);
    } else{
        TE('A valid email was not entered');
    }
    if(!user) TE(invalidLoginMsg);

    [err, user] = await to(user.comparePassword(userInfo.password));

    if(err) TE(invalidLoginMsg);

    return user;

}
module.exports.authUser = authUser;