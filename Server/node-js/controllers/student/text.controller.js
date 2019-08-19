const { Text, Section, Level } = require('../../models');
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

const updateExperience = async function (req, res) {
    let nextExperience, studentLevel;
    let { studentId, textId } = req.params
    const currentLevel = await Level.findOne({
        where: {
            studentId: studentId
        }
    })

    const text = await Text.findAll({
        where: { id: textId }
    })

    currentExperience = text.experience + currentLevel.currentExperience;

    if(text.experience == currentLevel.nextExperience ||
        text.experience > currentLevel.nextExperience){
            nextExperience = currentLevel.nextExperience * 1.5;
            studentLevel = currentLevel.currentLevel + 1;
         }
    
    const level = await Level.update({
        nextExperience: nextExperience,
        currentExperience: text.experience,
        currentLevel: studentLevel
    }, {
            where: {
                studentId: studentId
            }
        })
    if (level) return ReS(res, { data: level }, 200);
    else return ReE(res, { message: 'Unable to update settings.' }, 500)
}
module.exports.updateExperience = updateExperience;
