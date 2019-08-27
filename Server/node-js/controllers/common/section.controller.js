const { Sequelize, CourseCategory, Section, Text, Lesson, Course, StudentProgress, SectionPage } = require('../../models');
const { to, ReE, ReS } = require('../../services/util.service');
const Op = Sequelize.Op;


const getCoachSections = async (req, res) => {
    let { courseId } = req.params
    const section = await Section.findAll({
        attributes: ['id', 'title', 'description', 'totalExperience'],
        include: [{
            model: Course,
            as: "course",
            attributes: [['id', 'courseId'], 'title', 'description']
        }],
        where: {
            courseId: courseId
        }
    })
    if (section) return ReS(res, { data: section }, 200);
    else return ReE(res, { message: 'Unable to insert Course.' }, 500)
}

const getLastSectionDetails = async (req, res) => {
    let { studentId } = req.params
    const studentProgress = await StudentProgress.findAll({
        attributes: ['sectionPageId'],

        where: {
            isLastActive: 1,
            studentId: studentId
        },

    })

    if (studentProgress.length > 0) {
        sectionPage = await SectionPage.findAll({

            include: [{
                model: Section,
                as: 'Section'
            }],
            where: {
                id: studentProgress[0].sectionPageId
            }
        })
        return ReS(res, { data: sectionPage }, 200);
    }else{
        return ReS(res, { data: [] }, 200);
    }

}
module.exports.getLastSectionDetails = getLastSectionDetails;

const getStudentProgress = async (req, res) => {
    let studentExperience;
    let { sectionId, studentId } = req.params

    let sectionPage = await SectionPage.findAll({
        where: {
            sectionId: sectionId
        },

        include: [{
            model: Text,
            as: 'Text',
            attributes: [[Sequelize.fn('SUM', Sequelize.col('Text.experience')), 'totalExperience']],
            raw: true


        }, {
            model: Lesson,
            as: 'Lesson',
            attributes: [[Sequelize.fn('SUM', Sequelize.col('Lesson.experience')), 'totalExperience']],
            raw: true

        }],
        group: ['id']
    })


    // let textsTotalArray = sectionPage.map((row) => { return row.Text.totalExperience});
    // let lessonsTotalArray = sectionPage.map((row) => { return row.Lesson.totalExperience});

    // let totalExperience = textsTotalArray + lessonsTotalArray

    console.log(sectionPage.Text.totalExperience);
    

    let studentProgress = await StudentProgress.findAll({
        attributes: ['sectionPageId'],
        where: {
            studentId: studentId
        },
    })

    let sectionPageIds = studentProgress.map((row) => row.sectionPageId );

    let texts = await Text.findAll({
        attributes: [[Sequelize.fn('SUM', Sequelize.col('experience')), 'totalExperience']],
        raw: true,
        where: {
            sectionPageId: {
                [Op.in]: sectionPageIds
            }
        },
        group: ['sectionPageId']
    })
    let lesson = await Lesson.findAll({
        attributes: [[Sequelize.fn('SUM', Sequelize.col('experience')), 'totalExperience']],
        raw: true,
        where: {
            sectionPageId: {
                [Op.in]: sectionPageIds
            }
        },
        group: ['sectionPageId']
    })

    let textsArray = texts.map((row) => { return parseInt(row.totalExperience) });
    let lessonsArray = lesson.map((row) => { return parseInt(row.totalExperience) });

    let allLessons = lessonsArray.reduce( (acc, val) =>   acc + val )
    let allTexts = textsArray.reduce( (acc, val) =>  acc + val )


    if (texts.length == 0 && lesson.length != 0) {
        studentExperience = allLessons;
    }
    else if (texts.length != 0 && lesson.length == 0) {
        studentExperience = allTexts;
    }
    else if (texts.length != 0 && lesson.length != 0) {
        studentExperience = allTexts + allLessons;
    }


    if (sectionPage) return ReS(res, { data: {studentExperience: studentExperience, totalExperience: totalExperience} }, 200);
    else return ReE(res, { message: 'Unable to insert Course.' }, 500)
}
module.exports.getStudentProgress = getStudentProgress;
