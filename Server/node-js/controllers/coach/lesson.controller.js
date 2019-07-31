const { Lesson, Section } = require('../../models');
const { to, ReE, ReS } = require('../../services/util.service');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;


const create = async (req, res) => {
    let { url, description, experience, sectionId, title } = req.body
    const lesson = await Lesson.create({
        url: url,
        title: title,
        description: description,
        experience: experience,
        sectionId: sectionId,
    })
    if (lesson) return ReS(res, { data: lesson }, 200);
    else return ReE(res, { message: 'Unable to insert Course.' }, 500)
}
module.exports.create = create;

const getLessons = async (req, res) => {

    let { sectionId } = req.params
    const lessons = await Lesson.findAll({
        attributes: [['id', 'lessonId'], 'url', 'title', 'description', 'experience'],
        include: [{
            model: Section,
            as: "section",
            attributes: [['id', 'sectionId'], 'title', 'description']
        }],
        where: {
            sectionId: sectionId
        }
    })
    if (lessons) return ReS(res, { data: lessons }, 200);
    else return ReE(res, { message: 'Unable to insert Course.' }, 500)
}
module.exports.getLessons = getLessons;

const removeLesson = async (req, res) => {
    let { lessonId } = req.params
    const lesson = await Lesson.destroy({
        where: {
            id: lessonId
        }
    })
    if (lesson) return ReS(res, { data: lesson }, 200);
    else return ReE(res, { message: 'Unable to insert Course.' }, 500)
}
module.exports.removeLesson = removeLesson;

const updateLesson = async (req, res) => {
    let { lessonId } = req.params
    let { url, title, description, experience, } = req.body
    const lesson = await Lesson.update({
        title: title,
        url: url,
        description: description,
        experience: experience,
    }, {
            where: {
                id: lessonId
            }
        })
    if (lesson) return ReS(res, { data: lesson }, 200);
    else return ReE(res, { message: 'Unable to insert Lesson.' }, 500)
}

module.exports.updateLesson = updateLesson;

const getLessonById = async (req, res) => {

    let { lessonId } = req.params;
    let lesson = await Lesson.findAll({
        where: {
            id: lessonId
        }
    })

    if (lesson) return ReS(res, { data: lesson }, 200);
    else return ReE(res, { message: 'Unable to get Lesson' }, 500)

}

module.exports.getLessonById = getLessonById;