const { Text, Section } = require('../../models');
const { to, ReE, ReS } = require('../../services/util.service');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;




const getTextForStudent = async (req, res) => {

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
module.exports.getTextForStudent = getTextForStudent;


const getTextByIdForStudent = async (req, res) => {
    const { id } = req.params;
    const text = await Text.findAll({
        where: { id: id }
    })
    if (text) return ReS(res, { data: text }, 200);
    else return ReE(res, { message: 'Unable to get Text.' }, 500);
}
module.exports.getTextByIdForStudent = getTextByIdForStudent;