const { Quiz, Section } = require('../../models');
const { to, ReE, ReS } = require('../../services/util.service');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;


const create = async (req, res) => {
    let { quizes, sectionPageId, title, oldTitle } = req.body

    // if (oldTitle) {
    //     let removedQuiz = await Quiz.destroy({
    //         where: {
    //             title: oldTitle,
    //             sectionId: sectionId
    //         }
    //     })
    // }

    let bulkQuizes = quizes.map(quiz => {
        return {
            title: title,
            question: quiz.question,
            options: JSON.stringify(quiz.options),
            experience: quiz.experience,
            sectionPageId: sectionPageId
        }
    })

    let quizesResult = await Quiz.bulkCreate(bulkQuizes)
    if (quizesResult) return ReS(res, { data: quizesResult }, 200);
    else return ReE(res, { message: 'Unable to insert Quiz.' }, 500)
}
module.exports.create = create;


const getQuize = async (req, res) => {
    let { sectionId, title } = req.params;
    const quizesResult = await Quiz.findAll({
        where: {
            sectionId: sectionId,
            title: title
        }
    })
    if (quizesResult) return ReS(res, { data: quizesResult }, 200);
    else return ReE(res, { message: 'Unable to get Quiz.' }, 500)
}
module.exports.getQuize = getQuize;

const getTitle = async (req, res) => {
    let { title, sectionId } = req.params;
    const quizesResult = await Quiz.findAll({
        where: { sectionId: sectionId, title: title }
    })
    if (quizesResult) return ReS(res, { data: quizesResult }, 200);
    else return ReE(res, { message: 'Unable to get by title.' }, 500)
}
module.exports.getTitle = getTitle;
