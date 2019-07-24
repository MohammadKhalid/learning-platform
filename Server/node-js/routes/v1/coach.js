const express        = require('express');
const coachRouter   = express.Router();

// controllers
const controllerPath                = '../../controllers/coach/';
const HomeController                = require(controllerPath + 'home.controller');
const CategoryController            = require(controllerPath + 'category.controller');
const TopicController 		        = require(controllerPath + 'topic.controller');
const MediaController 		        = require(controllerPath + 'media.controller');
const StudentController		        = require(controllerPath + 'student.controller');
const ShowTimeController            = require(controllerPath + 'show-time.controller');
const LiveGroupTrainingController   = require(controllerPath + 'live-group-training.controller');
const courseController   = require(controllerPath + 'course.controller');

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
liveGroupTrainingRoutes.get('/:item_id',  LiveGroupTrainingController.get);
liveGroupTrainingRoutes.put('/:item_id',  LiveGroupTrainingController.update);
liveGroupTrainingRoutes.put('/start/:item_id',  LiveGroupTrainingController.start);
liveGroupTrainingRoutes.put('/close/:item_id',  LiveGroupTrainingController.close);
liveGroupTrainingRoutes.delete('/:item_id',  LiveGroupTrainingController.remove);


//course 

const courseRoute = express.Router();
courseRoute.use('/course',courseRoute)

courseRoute.post('/',courseController.create)


module.exports = coachRouter;