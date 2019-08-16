const express = require('express');
const studentRouter = express.Router();

// controllers
const controllerPath = '../../controllers/student/';
const HomeController = require(controllerPath + 'home.controller');
const CategoryController = require(controllerPath + 'category.controller');
const TopicController = require(controllerPath + 'topic.controller');
const MediaController = require(controllerPath + 'media.controller');
const CoachController = require(controllerPath + 'coach.controller');
const ShowTimeController = require(controllerPath + 'show-time.controller');
const LiveGroupTrainingController = require(controllerPath + 'live-group-training.controller');
const courseContoller = require(controllerPath + 'course.controller');
const quizController = require(controllerPath + 'quiz.controller');

const commonController = require('../../controllers/common/common.controller');
const lessonController = require('../../controllers/student/lesson.controller');
const textController = require('../../controllers/student/text.controller');
const resourceController = require('../../controllers/student/resource.controller');


// dashboard
studentRouter.get('/dashboard', HomeController.dashboard);

// category
const categoryRoutes = express.Router();
studentRouter.use('/categories', categoryRoutes);

categoryRoutes.get('/', CategoryController.getAll);

// topic
const topicRoutes = express.Router();
studentRouter.use('/topics', topicRoutes);

topicRoutes.get('/', TopicController.getAll);
topicRoutes.get('/:item_id', TopicController.get);

// media
const mediaRoutes = express.Router();
studentRouter.use('/medias', mediaRoutes);

mediaRoutes.post('/', MediaController.create);
mediaRoutes.get('/', MediaController.getAll);
mediaRoutes.get('/:item_id', MediaController.get);
mediaRoutes.put('/:item_id', MediaController.update);
mediaRoutes.delete('/:item_id', MediaController.remove);

// coach
const coachRoutes = express.Router();
studentRouter.use('/coaches', coachRoutes);

coachRoutes.get('/', CoachController.getAll);
coachRoutes.get('/:item_id', CoachController.get);

// practice time
const practiceTimeRoutes = express.Router();
studentRouter.use('/practice-time', (req, res, next) => { req.isPractice = true; next(); }, practiceTimeRoutes);

practiceTimeRoutes.post('/', ShowTimeController.create);
practiceTimeRoutes.post('/answer/:item_id', ShowTimeController.answerQuestion);
practiceTimeRoutes.get('/', ShowTimeController.getAll);
practiceTimeRoutes.get('/form-input-data', ShowTimeController.formInputData);
practiceTimeRoutes.get('/:item_id', ShowTimeController.get);
practiceTimeRoutes.put('/:item_id', ShowTimeController.update);
practiceTimeRoutes.put('/submit/:item_id', ShowTimeController.submit);
practiceTimeRoutes.delete('/:item_id', ShowTimeController.remove);

// show time
const showTimeRoutes = express.Router();
studentRouter.use('/show-time', showTimeRoutes);

showTimeRoutes.post('/', ShowTimeController.create);
showTimeRoutes.post('/answer/:item_id', ShowTimeController.answerQuestion);
showTimeRoutes.get('/show-time', ShowTimeController.getAll);
showTimeRoutes.get('/form-input-data', ShowTimeController.formInputData);
showTimeRoutes.get('/:item_id', ShowTimeController.get);
showTimeRoutes.put('/:item_id', ShowTimeController.update);
showTimeRoutes.put('/submit/:item_id', ShowTimeController.submit);
showTimeRoutes.delete('/:item_id', ShowTimeController.remove);

// live group training
const liveGroupTrainingRoutes = express.Router();
studentRouter.use('/live-group-trainings', liveGroupTrainingRoutes);

liveGroupTrainingRoutes.get('/', LiveGroupTrainingController.getAll);
liveGroupTrainingRoutes.get('/:item_id', LiveGroupTrainingController.get);

//course category

const courseCategory = express.Router();
studentRouter.use('/course-category', courseCategory)

courseCategory.get('/get-all/:userId', commonController.getAll)

//quiz

const quiz = express.Router();
studentRouter.use('/quiz', quiz)

quiz.get('/:sectionId/:title', quizController.getQuiz)
quiz.post('/submit-quiz', quizController.submitQuiz)

//courses 


const course = express.Router();
studentRouter.use('/course', course)
course.get('/', courseContoller.getCourses)
course.post('/enroll-course', courseContoller.enrollCourse)
course.get('/uncomplete-course', courseContoller.getUncompletedCourse)
course.get('/completed-courses', courseContoller.getCompletedCourse)

// section
const section = express.Router();
studentRouter.use('/section', section)
// section.get('/get-sections/:courseId', commonController.getSections)

section.get('/get-section-details-for-student/:sectionId', commonController.sectionDetailsForStudent)


// lessons
const lessonRoutes = express.Router();
studentRouter.use('/lesson', lessonRoutes)

lessonRoutes.get('/get-lessons-for-student/:sectionId', lessonController.getLessonsForStudent)
lessonRoutes.get('/get-lesson-by-id-for-student/:lessonId', lessonController.getLessonByIdForStudent)


//text
const textRoutes = express.Router();
studentRouter.use('/text', textRoutes)

textRoutes.get('/get-text-for-student/:sectionId', textController.getTextForStudent)
textRoutes.get('/get-text-by-id-for-student/:id', textController.getTextByIdForStudent)


//resource
const resourceRoutes = express.Router();
studentRouter.use('/resource', resourceRoutes)

resourceRoutes.get('/get-resources-for-student/:sectionId', resourceController.getSectionResourcesForStudent)



module.exports = studentRouter;