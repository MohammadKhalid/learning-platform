const { User } = require('../models');
const { to, ReE, ReS } = require('../services/util.service');

const Sequelize = require('sequelize');

const getAll = async function(req, res){
    let user = req.user;
    let err, coaches;
    let data = {};

    [err, coaches] = await to(User.findAll({
        where: {
            type: 'coach',
            isActive: true,
            isDeleted: false
        },
        attributes: [
            'id',
            [Sequelize.fn('CONCAT', Sequelize.col('firstName'), ' ', Sequelize.col('lastName')), 'name']
        ]
    }));

    let coaches_json =[]
    for( let i in coaches){
        let coach = coaches[i];
        let coach_info = coach.toWeb();
        
        coaches_json.push(coach_info);
    }
    data.coaches = coaches_json;

    return ReS(res, {data: data});
}
module.exports.getAll = getAll;