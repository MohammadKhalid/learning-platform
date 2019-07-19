const ShowTime         = require('./../models').ShowTime;
const { to, ReE, ReS } = require('../services/util.service');

let practice = async function (req, res, next) {
    req.isPractice = true;
    next();
}
module.exports.practice = practice;

let item = async function (req, res, next) {
    let item_id, err, item;
    item_id = req.params.item_id;

    [err, item] = await to(ShowTime.findOne({
        where: { id:item_id },
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
    if(!item) return ReE(res, "not found with id: " + item_id);
    
    let user, users_array, users;
    user = req.user;

    // if(user.type !== 'admin') {
    //     [err, users] = await to(item.getUsers());

    //     users_array = users.map(obj=> String(obj.dataValues.id));

    //     if(!users_array.includes(String(user.id))) return ReE(res, "User does not have permission to read with id: "+item_id);
    // }

    req.item = item;
    next();
}
module.exports.item = item;