const { Sequelize, Quiz, StudentAnswer, Level } = require('../../models');
const { to, ReE, ReS } = require('../../services/util.service');
const Op = Sequelize.Op;

const getQuiz = async function (req, res) {

    let { sectionPageId } = req.params

    let quiz = await Quiz.findAll({
        include: [{
            model: StudentAnswer,
            as: 'quizAnswers'
        }],
        where: {
            sectionPageId: sectionPageId
        }
    })

    let quizRes = quiz.map(x => {
        return {
            "id": x.id,
            "question": x.question,
            "title": x.title,
            "options": x.options.replace(/true/g, false),
            "type": x.type,
            "quizAnswers": x.quizAnswers,
            "experience": x.experience,
            "sectionId": x.sectionId,
            "createdAt": x.createdAt,
            "updatedAt": x.updatedAt
        }
    })

    if (quizRes) return ReS(res, { data: quizRes, attempted: false }, 200);
    else return ReE(res, { message: 'Unable to insert Course.' }, 500)
    // let studentAnswerResult = await StudentAnswer.findAll({
    //     include: [{
    //         model: Quiz,
    //         as: 'question'
    //     }],
    //     where: {
    //         sectionPageId: sectionPageId,
    //         // title: title
    //     }
    // })

    // if (studentAnswerResult.length == 0) {
    //     let quiz = await Quiz.findAll({
    //         where: {
    //             sectionPageId: sectionPageId,
    //         }
    //     })
    //     let quizRes = quiz.map(x => {
    //         return {
    //             "id": x.id,
    //             "question": x.question,
    //             "title": x.title,
    //             "options": x.options.replace(/true/g, false),
    //             "type": x.type,
    //             "experience": x.experience,
    //             "sectionId": x.sectionId,
    //             "createdAt": x.createdAt,
    //             "updatedAt": x.updatedAt
    //         }
    //     })

    //     if (quizRes) return ReS(res, { data: quizRes, attempted: false }, 200);
    //     else return ReE(res, { message: 'Unable to insert Course.' }, 500)
    // } else {
    //     if (studentAnswerResult) return ReS(res, { data: studentAnswerResult, attempted: true }, 200);
    //     else return ReE(res, { message: 'Unable to insert Course.' }, 500)
    // }

}
module.exports.getQuiz = getQuiz;


const submitQuiz = async function (req, res) {
    let nextExperience, studentLevel, currentExperience, studentExperience;
    let { userId, options, sectionPageId, questionId } = req.body
    let totalScore = 0
    let quiz = await Quiz.findAll({
        attributes: ['options', 'experience'],
        where: {
            id: questionId,
        }
    })

    let isCorrect = 0
    if (quiz[0].options == JSON.stringify(options)) {
        isCorrect = 1
        totalScore += quiz[0].experience
    }
    let studentAnswerResult = await StudentAnswer.create({
        isCorrect: isCorrect,
        answer: JSON.stringify(options),
        sectionPageId: sectionPageId,
        userId: userId,
        quizId: questionId,
    })

    let quizRes = await Quiz.findAll({
        include: [{
            attributes: ['answer'],
            model: StudentAnswer,
            as: 'quizAnswers',
            where: {
                userId: userId
            },
            required: false
        }],
        where: {
            id: questionId
        }
    })

    const level = await Level.findAll({
        where: {
            studentId: userId
        }
    })


    currentExperience = totalScore + level[0].currentExperience;
    if (currentExperience == level[0].nextExperience ||
        currentExperience > level[0].nextExperience) {
        nextExperience = level[0].nextExperience * 1.5;
        studentLevel = level[0].currentLevel + 1;
    }


    const levelUpdate = await Level.update({
        nextExperience: nextExperience,
        currentExperience: currentExperience,
        currentLevel: studentLevel
    }, {
            where: {
                studentId: userId
            }
        })

    if (studentAnswerResult) return ReS(res, { data: quizRes }, 200);
    else return ReE(res, { message: 'Unable to insert Course.' }, 500)
}
module.exports.submitQuiz = submitQuiz;

const updateExperience = async function (req, res) {
    let nextExperience, studentLevel;
    let { studentId, quizId } = req.params
    const currentLevel = await Level.findOne({
        where: {
            studentId: studentId
        }
    })

    const quiz = await Quiz.findAll({
        where: { id: quizId }
    })

    currentExperience = quiz.experience + currentLevel.currentExperience;

    if (quiz.experience == currentLevel.nextExperience ||
        quiz.experience > currentLevel.nextExperience) {
        nextExperience = currentLevel.nextExperience * 1.5;
        studentLevel = currentLevel.currentLevel + 1;
    }

    const level = await Level.update({
        nextExperience: nextExperience,
        currentExperience: quiz.experience,
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

