const { Text, Section } = require('../../models');
const { to, ReE, ReS } = require('../../services/util.service');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;


const create = async (req, res) => {
    let { description, title, sectionPageId, experience } = req.body
    const text = await Text.create({
        title: title,
        description: description,
        sectionPageId: sectionPageId,
        experience: experience
    })
    if (text) return ReS(res, { data: text }, 200);
    else return ReE(res, { message: 'Unable to insert Text.' }, 500)
}
module.exports.create = create;

const getText = async (req, res) => {

    let { sectionId } = req.params
    const texts = await Text.findAll({
        attributes: [['id', 'textId'], 'title', 'description'],
        include: [{
            model: Section,
            as: "section",
            attributes: [['id', 'sectionId'], 'title', 'description']
        }],
        where: {
            sectionId: sectionId
        }
    })
    if (texts) return ReS(res, { data: texts }, 200);
    else return ReE(res, { message: 'Unable to insert Texts.' }, 500)
}
module.exports.getText = getText;

const removeText = async (req, res) => {
    let { textId } = req.params
    const text = await Text.destroy({
        where: {
            id: textId
        }
    })
    if (text) return ReS(res, { data: text }, 200);
    else return ReE(res, { message: 'Unable to insert Text.' }, 500)
}
module.exports.removeText = removeText;

const updateText = async (req, res) => {
    let { textId } = req.params
    let { description, title } = req.body
    const text = await Text.update({
        title: title,
        description: description,
    }, {
            where: {
                id: textId
            }
        })
    if (text) return ReS(res, { data: text }, 200);
    else return ReE(res, { message: 'Unable to insert Text.' }, 500)
}
module.exports.updateText = updateText;

const getById = async (req, res) => {
    const { id } = req.params;
    const text = await Text.findAll({
        where: { id: id }
    })
    if (text) return ReS(res, { data: text }, 200);
    else return ReE(res, { message: 'Unable to get Text.' }, 500);
}
module.exports.getById = getById;