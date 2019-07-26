const { Sequelize,CourseCategory } = require('../../models');
const { to, ReE, ReS } = require('../../services/util.service');
const Op = Sequelize.Op;
// const uuidv4 = require('uuid/v4')

const getAll = async function(req, res){
    let { userId } = req.params;
    const categories = await CourseCategory.findAll({
        where: {
            createdBy:userId
        }
    })
    return ReS(res, { data: categories }, 200);
}
module.exports.getAll = getAll;
