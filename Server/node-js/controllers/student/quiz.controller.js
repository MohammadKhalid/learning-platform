const { Sequelize, Quiz } = require('../../models');
const { to, ReE, ReS } = require('../../services/util.service');
const Op = Sequelize.Op;

const getQuiz = async function (req, res) {

    let { sectionId, title } = req.params

    let quiz = await Quiz.findAll({
        where: {
            sectionId: sectionId,
            title: title
        }
    })
    let quizRes = quiz.map(x => {
        return {
            "id": x.id,
            "question": x.question,
            "title": x.title,
            "options": x.options.replace(/true/g,false),
            "type": x.type,
            "experience": x.experience,
            "sectionId": x.sectionId,
            "createdAt": x.createdAt,
            "updatedAt": x.updatedAt
        }
    })
    if (quiz) return ReS(res, { data: quizRes }, 200);
    else return ReE(res, { message: 'Unable to insert Course.' }, 500)
}
module.exports.getQuiz = getQuiz;