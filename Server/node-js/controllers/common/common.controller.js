const { Sequelize, CourseCategory, UserCompany, Section, Text, Lesson, StudentAnswer, Resource, Quiz, Course, SectionPage, StudentProgress, Level } = require('../../models');
const { to, ReE, ReS } = require('../../services/util.service');
const Op = Sequelize.Op;
// const uuidv4 = require('uuid/v4')

const getAllCourse = async function (req, res) {
    let { userId } = req.params;
    const company = await UserCompany.findAll({
        attributes: ['companyId'],
        where: {
            userId: userId
        }
    })
    console.log(userId)
    let userCompanyId = company[0].companyId
    const categories = await CourseCategory.findAll({
        where: {
            companyId: userCompanyId
        }
    })
    return ReS(res, { data: categories }, 200);
}
module.exports.getAllCourse = getAllCourse;

const sectionDetails = async (req, res) => {
    let { sectionId } = req.params
    const sectionDetail = await Section.findAll({
        attributes: [['id', 'sectionId'], 'title', 'description'],
        include: [{
            model: Text,
            as: 'Text'
        }, {
            model: Lesson,
            as: 'Lesson'
        }],
        where: {
            id: sectionId
        }
    })
    const quizDetail = await Quiz.findAll({
        where: {
            sectionId: sectionId
        },
        group: ['title']
    })
    const resourceDetails = await Resource.findAll({
        where: {
            sectionId: sectionId
        },
        group: ['title']
    })
    if (sectionDetail.length > 0) {
        return ReS(res, { concept: [...sectionDetail[0].Text, ...sectionDetail[0].Lesson, ...quizDetail], resource: resourceDetails }, 200);
    } else {
        return ReS(res, { data: [] }, 200);
    }

}
module.exports.sectionDetails = sectionDetails;


const sectionDetailsForStudent = async (req, res) => {
    let { sectionId } = req.params
    const sectionDetailForStudent = await Section.findAll({
        attributes: [['id', 'sectionId'], 'title', 'description'],
        include: [{
            model: Text,
            as: 'Text'
        }, {
            model: Lesson,
            as: 'Lesson'
        }],
        where: {
            id: sectionId
        }
    })
    const quizDetail = await Quiz.findAll({
        where: {
            sectionId: sectionId
        },
        group: ['title']
    })

    const resourceDetail = await Resource.findAll({
        where: {
            sectionId: sectionId
        },
        group: ['title']
    })
    if (sectionDetailForStudent.length > 0) {
        return ReS(res, { concept: [...sectionDetailForStudent[0].Text, ...sectionDetailForStudent[0].Lesson, ...quizDetail], resource: [...resourceDetail] }, 200);
    } else {
        return ReS(res, { data: [] }, 200);
    }

}
module.exports.sectionDetailsForStudent = sectionDetailsForStudent;


const getSections = async (req, res) => {
    let studentProgress, texts, lesson, sectionPageId, sectionId, totalTextExperience, totalLessonExperience;
    let dataArray = [];
    let { courseId, studentId } = req.params
    let flag = 'Section'
    let section = await Section.findAll({
        attributes: ['id', 'title', 'description', 'totalExperience', 'courseId'],
        include: [{
            model: Course,
            as: "course",
            attributes: [['id', 'courseId'], 'title', 'description']
        }],
        where: {
            courseId: courseId
        }
    })
    if (section.length == 0) {
        flag = 'Course'
        section = await Course.findAll({
            where: {
                id: courseId
            }
        })
    }

    if (req.user.type == "student") {

        studentProgress = await StudentProgress.findAll({
            where: {
                studentId: studentId,
                courseId: courseId
            },

            include: [{

                model: SectionPage,
                as: 'sectionPage',

                include: [{

                    model: Text,
                    as: 'Text',
                    // attributes: [[Sequelize.fn('sum', Sequelize.col("experience")), 'textExperience']],
                    // raw: true
                    attributes: ['experience']

                },
                {

                    model: Lesson,
                    as: 'Lesson',
                    // attributes: [[Sequelize.fn('sum', Sequelize.col("Lesson.experience")), 'lessonExperience']],
                    // raw: true
                    attributes: ['experience']

                }],

                group: ['Text.sectionPageId', 'Lesson.sectionPageId']

            }],

        })


        for (let index = 0; index < studentProgress.length; index++) {

            sectionId = studentProgress[index].sectionPage.sectionId;
            totalTextExperience = studentProgress[index].sectionPage.Text.length > 0 ? studentProgress[index].sectionPage.Text.length == 1 ? studentProgress[index].sectionPage.Text[0].experience :
                studentProgress[index].sectionPage.Text.reduce((acc, val) => parseInt(acc.experience) + parseInt(val.experience)) : 0
            totalLessonExperience = studentProgress[index].sectionPage.Lesson.length > 0 ? studentProgress[index].sectionPage.Lesson.length == 1 ? studentProgress[index].sectionPage.Lesson[0].experience :
                studentProgress[index].sectionPage.Lesson.reduce((acc, val) => parseInt(acc.experience) + parseInt(val.experience)) : 0
            sectionPageId = studentProgress[index].sectionPage.id;


            dataArray.push({

                sectionId,
                totalTextExperience,
                totalLessonExperience,
                sectionPageId

            })

        }
    }



    if (section) return ReS(res, { data: section, flag: flag, studentProgress: studentProgress, studentExperience: dataArray }, 200);
    else return ReE(res, { message: 'Unable to insert Course.' }, 500)
}
module.exports.getSections = getSections;


const getSideMenuItems = async (req, res) => {
    let { sectionId, userId } = req.params
    const sectionpage = await Section.findAll({
        attributes: ['title'],
        include: [{
            model: SectionPage,
            as: 'sectionPage'
        }],
        where: {
            id: sectionId
        }
    })
    const resources = await Resource.findAll({
        where: {
            sectionId: sectionId
        }
    })

    const quizAnswer = await Section.findAll({
        attributes: ['title'],
        include: [{
            model: SectionPage,
            as: 'sectionPage',
            include: [{
                model: Quiz,
                as: 'Quiz'
            }]
        }],
        where: {
            id: sectionId
        }
    })
    let quizSectionPage = []
    if (quizAnswer[0].sectionPage.length > 0) {
        quizSectionPage = quizAnswer[0].sectionPage.filter(x => x.Quiz.length > 0)
    }

    let concepts = sectionpage.pop();
    if (concepts.sectionPage) return ReS(res, { concept: concepts.sectionPage, title: concepts.title, resource: resources, quizAnswer: quizSectionPage }, 200);
    else return ReE(res, { concept: concepts, title: concepts.title }, 500)
}
module.exports.getSideMenuItems = getSideMenuItems;

const getSectionItems = async (req, res) => {

    let { sectionPageId, courseId, sectionId, userId } = req.params
    let sectionpage = []

    if (req.user.type == "student") {
        sectionpage = await SectionPage.findAll({
            include: [{
                model: Lesson,
                as: 'Lesson'
            }, {
                model: Text,
                as: 'Text'
            }],
            where: {
                id: sectionPageId
            }
        })
        let quiz = await Quiz.findAll({
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
                sectionPageId: sectionPageId
            }
        })
        let quizRes = quiz.map(x => {
            return {
                "id": x.id,
                "question": x.question,
                "title": x.title,
                "options": x.quizAnswers.length == 0 ? x.options.replace(/true/g, false) : x.options,
                "type": x.type,
                "attempted": x.quizAnswers.length > 0 ? true : false,
                "sectionPageId": x.sectionPageId,
                "quizAnswers": x.quizAnswers,
                "experience": x.experience,
                "sectionId": x.sectionId,
                "createdAt": x.createdAt,
                "updatedAt": x.updatedAt
            }
        })

        //studentProgressWork

        // const studentProgressGet = await StudentProgress.findAll({

        //     where: {
        //         id: userId
        //     }
        // })

        // if (studentProgressGet.length == 0) {
        //     const studentProgressModel = await StudentProgress.create({
        //         studentId: userId,
        //         sectionPageId: sectionPageId,
        //         isLastActive: 1
        //     })
        // }
        // else {
        //     const studentProgressModel = await StudentProgress.update({
        //         isLastActive: 1

        //     },
        //         {
        //             where: {
        //                 studentId: userId,
        //                 sectionPageId: sectionPageId
        //             }
        //         })
        // }
        if (sectionpage) return ReS(res, { data: [...sectionpage[0].Lesson, ...sectionpage[0].Text, ...quizRes] }, 200);
        else return ReE(res, { message: 'Unable to get Section Page.' }, 500)
    } else {
        sectionpage = await SectionPage.findAll({
            include: [{
                model: Lesson,
                as: 'Lesson'
            }, {
                model: Text,
                as: 'Text'
            }, {
                model: Quiz,
                as: 'Quiz',
            }],
            where: {
                id: sectionPageId
            }
        })
        if (sectionpage) return ReS(res, { data: [...sectionpage[0].Lesson, ...sectionpage[0].Text, ...sectionpage[0].Quiz] }, 200);
        else return ReE(res, { message: 'Unable to get Section Page.' }, 500)
    }

}
module.exports.getSectionItems = getSectionItems;



const updateStudentProgress = async (req, res) => {
    let nextExperience, studentLevel, currentExperience, studentExperience, texts, lesson;
    let { sectionPageId, courseId, sectionId, userId } = req.body
    let sectionpage = []

    if (req.user.type == "student") {

        //studentProgressWork

        const studentProgress = await StudentProgress.findAll({
            where: {
                studentId: userId,
                sectionPageId: sectionPageId,
            }
        })



        if (studentProgress.length == 0) {
            const studentProgressCreate = await StudentProgress.create({
                studentId: userId,
                sectionId: sectionId,
                courseId: courseId,
                sectionPageId: sectionPageId,
                isLastActive: 1
            })
            const studentProgressUpdate = await StudentProgress.update({
                isLastActive: 0
            }, {
                    where: {
                        studentId: userId,
                        sectionPageId: {
                            [Op.not]: sectionPageId
                        },
                    }
                })


            texts = await Text.findAll({
                attributes: [[Sequelize.fn('SUM', Sequelize.col('experience')), 'totalExperience']],
                raw: true,
                where: {
                    sectionPageId: sectionPageId
                },
                group: ['sectionPageId']
            })
            lesson = await Lesson.findAll({
                attributes: [[Sequelize.fn('SUM', Sequelize.col('experience')), 'totalExperience']],
                raw: true,
                where: {
                    sectionPageId: sectionPageId
                },
                group: ['sectionPageId']
            })

            const level = await Level.findAll({
                where: {
                    studentId: userId
                }
            })


            if (texts.length == 0 && lesson.length != 0) {
                studentExperience = parseInt(lesson[0].totalExperience);
            }
            else if (texts.length != 0 && lesson.length == 0) {
                studentExperience = parseInt(texts[0].totalExperience);
            }
            else if (texts.length != 0 && lesson.length != 0) {
                studentExperience = parseInt(texts[0].totalExperience) + parseInt(lesson[0].totalExperience);
            }
            else if (texts.length == 0 && lesson.length == 0) {
                studentExperience = 0
            }



            currentExperience = studentExperience + level[0].currentExperience;
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


        } else {
            const studentProgressModel = await StudentProgress.update({
                isLastActive: 1
            }, {
                    where: {
                        studentId: userId,
                        sectionPageId: sectionPageId,
                    }
                })
            const studentProgressUpdate = await StudentProgress.update({

                isLastActive: 0
            }, {
                    where: {
                        studentId: userId,
                        sectionPageId: {
                            [Op.not]: sectionPageId
                        },
                    }
                })
        }


        if (sectionpage) return ReS(res, { data: studentProgress, texts: texts, lesson: lesson }, 200);
        else return ReE(res, { message: 'Unable to get Section Page.' }, 500)
    }

}
module.exports.updateStudentProgress = updateStudentProgress;


const changeIsLastActive = async (req, res) => {
    let nextExperience, studentLevel, currentExperience, studentExperience;
    let { sectionPageId, courseId, sectionId, userId } = req.body
    let sectionpage = []
    const studentProgress = await StudentProgress.findAll({
        where: {
            studentId: userId,
            sectionPageId: sectionPageId,
        }
    })



    if (studentProgress.length == 0) {
        const studentProgressCreate = await StudentProgress.create({
            studentId: userId,
            sectionId: sectionId,
            courseId: courseId,
            sectionPageId: sectionPageId,
            isLastActive: 1
        })
        const studentProgressUpdate = await StudentProgress.update({
            isLastActive: 0
        }, {
                where: {
                    studentId: userId,
                    sectionId: sectionId,
                    courseId: courseId,
                    sectionPageId: {
                        [Op.not]: sectionPageId
                    },
                }
            })

    } else {
        const studentProgressModel = await StudentProgress.update({
            isLastActive: 1
        }, {
                where: {
                    studentId: userId,
                    sectionPageId: sectionPageId,
                    courseId: courseId,
                    sectionId: sectionId
                }
            })
        const studentProgressUpdate = await StudentProgress.update({

            isLastActive: 0
        }, {
                where: {
                    studentId: userId,
                    sectionId: sectionId,
                    courseId: courseId,
                    sectionPageId: {
                        [Op.not]: sectionPageId
                    },
                }
            })
    }


    if (studentProgress) return ReS(res, { data: studentProgress }, 200);
    else return ReE(res, { message: 'Unable to get Section Page.' }, 500)

}
module.exports.changeIsLastActive = changeIsLastActive;
