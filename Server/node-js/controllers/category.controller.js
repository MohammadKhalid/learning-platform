const { Category } = require('../models');
const { to, ReE, ReS } = require('../services/util.service');

const create = async function (req, res) {

    let { title, description, userId } = req.body
    const category = await Category.create({
        title: title,
        description: description,
        createdBy: userId
    })

    return ReS(res, { data: category }, 200);
}
module.exports.create = create;

const getAll = async function (req, res) {
    let { userId } = req.params
    const categories = await Category.findAll({
        where: {
            createdBy: userId
        }
    })
    return ReS(res, { data: categories }, 200);
}
module.exports.getAll = getAll;

const get = async function (req, res) {
    let { item_id } = req.params
    const category = await Category.findAll({
        where: {
            id: item_id
        }
    })

    return ReS(res, { data: category });
}
module.exports.get = get;

const update = async function (req, res) {
    let { title,description } = req.body
    let { item_id } = req.params
    const category = await Category.update({
        title: title,
        description: description,
    }, {
            where: {
                id: item_id
            }
    })
    return ReS(res, { data: category });
}
module.exports.update = update;

const remove = async function (req, res) {
    let { item_id } = req.params
    const category = Category.destroy({
        where:{
            id: item_id
        }
    })
    if(category){
        return ReS(res, { data: "Deleted." });
    }else{
        return ReS(res, { data: "Unable to Deleted." });
    }
}
module.exports.remove = remove;