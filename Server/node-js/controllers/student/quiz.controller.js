const { Sequelize, Quiz, StudentAnswer } = require('../../models');
const { to, ReE, ReS } = require('../../services/util.service');
const Op = Sequelize.Op;

const getQuiz = async function (req, res) {

    let { sectionId, title } = req.params

    let studentAnswerResult = await StudentAnswer.findAll({
        include: [{
            model: Quiz,
            as: 'question'
        }],
        where: {
            sectionId: sectionId,
            title: title
        }
    })

    if (studentAnswerResult.length == 0) {
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
                "options": x.options.replace(/true/g, false),
                "type": x.type,
                "experience": x.experience,
                "sectionId": x.sectionId,
                "createdAt": x.createdAt,
                "updatedAt": x.updatedAt
            }
        })

        if (quizRes) return ReS(res, { data: quizRes, attempted: false }, 200);
        else return ReE(res, { message: 'Unable to insert Course.' }, 500)
    } else {
        if (studentAnswerResult) return ReS(res, { data: studentAnswerResult, attempted: true }, 200);
        else return ReE(res, { message: 'Unable to insert Course.' }, 500)
    }

}
module.exports.getQuiz = getQuiz;


const submitQuiz = async function (req, res) {

    let { studentId, finalQuiz, title, sectionId } = req.body
    let totalScore = 0
    let quiz = await Quiz.findAll({
        attributes: ['options'],
        where: {
            sectionId: sectionId,
            title: title
        }
    })

    let bulkQuizRes = finalQuiz.map((x, ind) => {
        let isCorrect = 0
        if (quiz[ind].options == JSON.stringify(x.options)) {
            isCorrect = 1
            totalScore += x.experience
        }
        return {
            isCorrect: isCorrect,
            answer: JSON.stringify(x.options),
            sectionId: sectionId,
            userId: studentId,
            quizId: x.id,
            title: title
        }
    })

    let studentAnswerResult = await StudentAnswer.bulkCreate(bulkQuizRes)
    if (studentAnswerResult) return ReS(res, { data: studentAnswerResult }, 200);
    else return ReE(res, { message: 'Unable to insert Course.' }, 500)
}
module.exports.submitQuiz = submitQuiz;

