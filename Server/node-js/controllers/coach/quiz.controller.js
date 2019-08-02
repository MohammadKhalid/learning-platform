const { Quiz, Section } = require('../../models');
const { to, ReE, ReS } = require('../../services/util.service');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;


const create = async (req, res) => {
    let { quizes, sectionId } = req.body

    let bulkQuizes = quizes.map(quiz => {
        return {
            question: quiz.question,
            options: JSON.stringify(quiz.options),
            experience: quiz.experience,
            sectionId: sectionId
        }
    })

    let quizesResult = await Quiz.bulkCreate(bulkQuizes)
    if (quizesResult) return ReS(res, { data: quizesResult }, 200);
    else return ReE(res, { message: 'Unable to insert Quiz.' }, 500)
}
module.exports.create = create;
const getQuize = async (req, res) => {
    let { sectionId } = req.params;
    const quizesResult = await Quiz.findAll({
        where: { sectionId: sectionId }
    })
    if (quizesResult) return ReS(res, { data: quizesResult }, 200);
    else return ReE(res, { message: 'Unable to get Quiz.' }, 500)
}
module.exports.getQuize = getQuize;
