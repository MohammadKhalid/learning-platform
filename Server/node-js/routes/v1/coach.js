const express = require('express');
const coachRouter = express.Router();


const multer = require('multer');
const path = require('path')

const CertificationStorage = multer.diskStorage({
    destination: './uploads/certification',
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname))
    }
})

const CertificationUpload = multer({
    storage: CertificationStorage
}).single('file')

// resources upload
const resourcesStorage = multer.diskStorage({
    destination: './uploads/resources',
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname))
    }
})

const resourcesUpload = multer({
    storage: resourcesStorage
}).array('file')

// controllers
const controllerPath = '../../controllers/coach/';
const HomeController = require(controllerPath + 'home.controller');
const CategoryController = require(controllerPath + 'category.controller');
const TopicController = require(controllerPath + 'topic.controller');
const MediaController = require(controllerPath + 'media.controller');
const StudentController = require(controllerPath + 'student.controller');
const ShowTimeController = require(controllerPath + 'show-time.controller');
const LiveGroupTrainingController = require(controllerPath + 'live-group-training.controller');
const courseController = require(controllerPath + 'course.controller');
const sectionController = require(controllerPath + 'section.controller');
const lessonController = require(controllerPath + 'lesson.controller');
const textController = require(controllerPath + 'text.controller');
const resourceController = require(controllerPath + 'resource.controller');
const quizController = require(controllerPath + 'quiz.controller');
const sectionPageController = require(controllerPath + 'sectionPage.controller');
const commonController = require('../../controllers/common/common.controller');

// dashboard
coachRouter.get('/dashboard', HomeController.dashboard);

// category
const categoryRoutes = express.Router();
coachRouter.use('/categories', categoryRoutes);

categoryRoutes.get('/', CategoryController.getAll);

// topic
const topicRoutes = express.Router();
coachRouter.use('/topics', topicRoutes);

topicRoutes.get('/', TopicController.getAll);
topicRoutes.get('/:item_id', TopicController.get);

// media
const mediaRoutes = express.Router();
coachRouter.use('/medias', mediaRoutes);

mediaRoutes.post('/', MediaController.create);
mediaRoutes.get('/', MediaController.getAll);
mediaRoutes.get('/:item_id', MediaController.get);
mediaRoutes.put('/:item_id', MediaController.update);
mediaRoutes.delete('/:item_id', MediaController.remove);

// student
const studentRoutes = express.Router();
coachRouter.use('/coaches', studentRoutes);

studentRoutes.get('/', StudentController.getAll);
studentRoutes.get('/:item_id', StudentController.get);

// practice time
const practiceTimeRoutes = express.Router();
coachRouter.use('/practice-time', (req, res, next) => { req.isPractice = true; next(); }, practiceTimeRoutes);

practiceTimeRoutes.get('/', ShowTimeController.getAll);
practiceTimeRoutes.get('/form-input-data', ShowTimeController.formInputData);
practiceTimeRoutes.get('/:item_id', ShowTimeController.get);
practiceTimeRoutes.put('/review/:item_id', ShowTimeController.updateReview);

// show time
const showTimeRoutes = express.Router();
coachRouter.use('/show-time', showTimeRoutes);

showTimeRoutes.get('/show-time', ShowTimeController.getAll);
showTimeRoutes.get('/form-input-data', ShowTimeController.formInputData);
showTimeRoutes.get('/:item_id', ShowTimeController.get);
showTimeRoutes.put('/review/:item_id', ShowTimeController.updateReview);

// live group training
const liveGroupTrainingRoutes = express.Router();
coachRouter.use('/live-group-trainings', liveGroupTrainingRoutes);

liveGroupTrainingRoutes.post('/', LiveGroupTrainingController.create);
liveGroupTrainingRoutes.get('/', LiveGroupTrainingController.getAll);
liveGroupTrainingRoutes.get('/form-input-data', LiveGroupTrainingController.formInputData);
liveGroupTrainingRoutes.get('/:item_id', LiveGroupTrainingController.get);
liveGroupTrainingRoutes.put('/:item_id', LiveGroupTrainingController.update);
liveGroupTrainingRoutes.put('/start/:item_id', LiveGroupTrainingController.start);
liveGroupTrainingRoutes.put('/close/:item_id', LiveGroupTrainingController.close);
liveGroupTrainingRoutes.delete('/:item_id', LiveGroupTrainingController.remove);


//course Category

const courseCategory = express.Router();
coachRouter.use('/course-category', courseCategory)

courseCategory.get('/get-all/:userId', commonController.getAll)

//course 

const courseRoute = express.Router();
coachRouter.use('/course', courseRoute)

courseRoute.post('/', CertificationUpload, courseController.create)
courseRoute.get('/get-coaches-course', courseController.getCourse)

// SectionPage
const sectionPageRoute = express.Router();
coachRouter.use('/section-page', sectionPageRoute)

sectionPageRoute.post('/', sectionPageController.create)
sectionPageRoute.get('/get-section-pages/:sectionId', commonController.getSideMenuItems)
sectionPageRoute.get('/get-section-items/:sectionPageId', commonController.getSectionItems)
sectionPageRoute.put('/:sectionPageId', sectionPageController.updateSectionPage)
sectionPageRoute.delete('/:sectionPageId', sectionPageController.removeSectionPage)


// Section
const sectionRoute = express.Router();
coachRouter.use('/section', sectionRoute)

sectionRoute.post('/', sectionController.create)
sectionRoute.get('/get-sections/:courseId', commonController.getSections)
sectionRoute.put('/:sectionId', sectionController.updateSection)
sectionRoute.delete('/:sectionId', sectionController.removeSection)

// sectionRoute.get('/get-section-details/:sectionId', commonController.sectionDetails)


// lessons
const lessonRoutes = express.Router();
coachRouter.use('/lesson', lessonRoutes)

lessonRoutes.post('/', lessonController.create)
lessonRoutes.get('/get-lessons/:sectionId', lessonController.getLessons)
lessonRoutes.get('/get-lesson-by-id/:lessonId', lessonController.getLessonById)
lessonRoutes.put('/:lessonId', lessonController.updateLesson)
lessonRoutes.delete('/:lessonId', lessonController.removeLesson)

// text
const textRoutes = express.Router();
coachRouter.use('/text', textRoutes)

textRoutes.post('/', textController.create)
textRoutes.get('/get-text/:sectionId', textController.getText)
textRoutes.put('/:textId', textController.updateText)
textRoutes.delete('/:textId', textController.removeText)
textRoutes.get('/get-by-id/:id', textController.getById)


// resource
const resourceRoutes = express.Router();
coachRouter.use('/resource', resourceRoutes)

resourceRoutes.post('/', resourcesUpload, resourceController.create)
// resourceRoutes.get('/get-section-resources/:sectionId/:title', resourceController.getSectionResources)
resourceRoutes.get('/get-resources/:sectionId', resourceController.getResources)
// resourceRoutes.put('/update-section-resources', resourcesUpload, resourceController.updateResource)
resourceRoutes.delete('/:resourceId/:filename', resourceController.remove)


// Quiz

const quizRoutes = express.Router();
coachRouter.use('/quiz', quizRoutes)

quizRoutes.post('/', quizController.create)
quizRoutes.get('/:sectionId/:title', quizController.getQuize)
quizRoutes.get('/get-title/:sectionId/:title', quizController.getTitle)

module.exports = coachRouter;