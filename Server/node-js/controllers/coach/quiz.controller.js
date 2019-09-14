const { Quiz, Section, SectionPage, User, StudentAnswer, UserCompany } = require('../../models');
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

const remove = async (req, res) => {
    let { quizId } = req.params;
    const quizesResult = await Quiz.destroy({
        where: { id: quizId }
    })
    if (quizesResult) return ReS(res, { data: quizesResult }, 200);
    else return ReE(res, { message: 'Unable to get by title.' }, 500)
}
module.exports.remove = remove;

const update = async (req, res) => {
    let { quizId } = req.params;
    let { title, question, options, experience } = req.body
    const quizesResult = await Quiz.update({
        question: question,
        // title: title,
        options: JSON.stringify(options),
        experience: experience
    }, {
            where: {
                id: quizId
            }
        })

    let quiz = await Quiz.findAll({
        where: {
            id: quizId
        }
    })
    if (quiz) return ReS(res, { data: quiz.pop() }, 200);
    else return ReE(res, { message: 'Unable to get by title.' }, 500)
}
module.exports.update = update;

const getStudentAnswers = async (req, res) => {
    let { userId, sectionPageId } = req.params;

    let companyId = await UserCompany.findOne({
        where: {
            userId: userId
        }
    })
    let students = await UserCompany.findAll({
        where: {
            companyId: companyId.companyId
        }
    })

    let studentIds = students.map(x => x.userId)

    let quiz = await Quiz.findAll({
        include: [{
            attributes: ['answer'],
            model: StudentAnswer,
            as: 'quizAnswers',
            include: [{
                attributes: [[Sequelize.fn("CONCAT", Sequelize.col('firstName'), ' ', Sequelize.col('lastName')), "name"]],
                model: User,
                as: 'user'
            }],
            where: {
                userId: studentIds
            },
            required: false
        }, {
            attributes: ['title'],
            model: SectionPage,
            as: 'sectionPage'
        }],
        where: {
            sectionPageId: sectionPageId
        }
    })

    if (quiz) return ReS(res, { data: quiz }, 200);
    else return ReE(res, { message: 'Unable to get by title.' }, 500)
}
module.exports.getStudentAnswers = getStudentAnswers;
