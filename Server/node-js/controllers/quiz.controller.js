const { Quiz } = require('../models');
const { to, ReE, ReS } = require('../services/util.service');

const create = async function (req, res) {

    let { question, options, correctOption, questionType, experience, detail, sectionId  } = req.body
    const quiz = await Quiz.create({
        question: question,
        options: JSON.stringify(options),
        correctOption: correctOption,
        questionType: questionType,
        experience: experience,
        detail: detail,
        sectionId: sectionId
    })

    if (quiz) return ReS(res, { data: quiz }, 200);
    else return ReE(res, { message: 'Unable to insert quiz.' }, 500)
}
module.exports.create = create;     

const get = async function (req, res) {
    let { sectionId } = req.params
    const quiz = await Quiz.findAll({
        where: {
            sectionId: sectionId
        }
    })

    if (quiz) return ReS(res, { data: quiz }, 200);
    else return ReE(res, { message: 'Unable to get quiz.' }, 500)
}
module.exports.get = get;



const update = async function (req, res) {
    let { question, options, correctOption, questionType, experience, detail, sectionId } = req.body
    let { quizId } = req.params
    const quiz = await Quiz.update({
        question: question,
        options: options,
        correctOptin: correctOption,
        questionType: questionType,
        experience: experience,
        detail: detail,
        sectionId: sectionId
    }, {
            where: {
                id: quizId
            }
    })
    if (quiz) return ReS(res, { data: quiz }, 200);
    else return ReE(res, { message: 'Unable to update quiz.' }, 500)
}
module.exports.update = update;

const remove = async function (req, res) {
    let { quizId } = req.params
    const quiz = Quiz.destroy({
        where:{
            id: quizId
        }
    })
    if(quiz){
        return ReS(res, { data: "Deleted." });
    }else{
        return ReS(res, { data: "Unable to Deleted." });
    }
}
module.exports.remove = remove;