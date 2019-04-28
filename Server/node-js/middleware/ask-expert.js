const AskExpert        = require('./../models').AskExpert;
const { to, ReE, ReS } = require('../services/util.service');

let item = async function (req, res, next) {
    let item_id, err, item;
    item_id = req.params.item_id;

    [err, item] = await to(AskExpert.findOne({
        where: { id:item_id },
        include: [ 
            'medias',
            {
                association: 'questionAnswers',
                include: [
                    'medias',
                    {
                        association: 'user',
                        attributes: [ 'id', 'firstName', 'lastName' ]
                    }
                ]
            },
            {
                association: 'user',
                attributes: [ 'id', 'firstName', 'lastName' ]
            },
            {
                association: 'coach',
                attributes: [ 'id', 'firstName', 'lastName' ]
            }
        ]
    }));
    if(err) return ReE(res, "err finding");
    if(!item) return ReE(res, "not found with id: " + item_id);
    
    let user, users_array, users;
    user = req.user;

    if(user.type !== 'admin') {
        [err, users] = await to(item.getUsers());

        users_array = users.map(obj=> String(obj.dataValues.id));

        if(!users_array.includes(String(user.id))) return ReE(res, "User does not have permission to read with id: "+item_id);
    }

    req.item = item;
    next();
}
module.exports.item = item;