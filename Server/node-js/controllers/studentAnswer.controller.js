const { StudentAnswer } = require('../models');
const { to, ReE, ReS } = require('../services/util.service');

const create = async function (req, res) {

    let { answer, userId, isCorrect, sectionId, quizId} = req.body
    const answer = await StudentAnswer.create({
        answer: answer,
        userId: userId,
        isCorrect: isCorrect,
        sectionId: sectionId,
        quizId: quizId,
    })

    if (answer) return ReS(res, { data: answer }, 200);
    else return ReE(res, { message: 'Unable to insert answer.' }, 500)
}
module.exports.create = create;     

const get = async function (req, res) {
    let { quizId } = req.params
    const answer = await StudentAnswer.findAll({
        where: {
            quizId: quizId
        }
    })

    if (answer) return ReS(res, { data: answer }, 200);
    else return ReE(res, { message: 'Unable to get answer.' }, 500)
}
module.exports.get = get;



const update = async function (req, res) {
    let { answer, userId, isCorrect, sectionId, quizId } = req.body
    let { quizId } = req.params
    const answer = await StudentAnswer.create({
        answer: answer,
        userId: userId,
        isCorrect: isCorrect,
        sectionId: sectionId,
        quizId: quizId,
    }, {
            where: {
                quizId: quizId
            }
    })
    if (answer) return ReS(res, { data: answer }, 200);
    else return ReE(res, { message: 'Unable to update answer.' }, 500)
}
module.exports.update = update;
