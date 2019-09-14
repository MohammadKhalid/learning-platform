const { Lesson, Section, Level } = require('../../models');
const { to, ReE, ReS } = require('../../services/util.service');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;




const getLessonsForStudent = async (req, res) => {

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
module.exports.getLessonsForStudent = getLessonsForStudent;


const getLessonByIdForStudent = async (req, res) => {

    let { lessonId } = req.params;
    let lesson = await Lesson.findAll({
        where: {
            id: lessonId
        }
    })


    if (lesson) return ReS(res, { data: lesson.pop() }, 200);
    else return ReE(res, { message: 'Unable to get Lesson' }, 500)

}

module.exports.getLessonByIdForStudent = getLessonByIdForStudent;

const updateExperience = async function (req, res) {
    let nextExperience, studentLevel;
    let { studentId, lessonId } = req.params
    const currentLevel = await Level.findOne({
        where: {
            studentId: studentId
        }
    })

    const lesson = await Lesson.findAll({
        where: { id: lessonId }
    })

    currentExperience = lesson.experience + currentLevel.currentExperience;

    if(lesson.experience == currentLevel.nextExperience ||
        lesson.experience > currentLevel.nextExperience){
            nextExperience = currentLevel.nextExperience * 1.5;
            studentLevel = currentLevel.currentLevel + 1;
         }
    
    const level = await Level.update({
        nextExperience: nextExperience,
        currentExperience: lesson.experience,
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