const express        = require('express');
const clientRouter   = express.Router();

// controllers
const controllerPath = '../../controllers/client/';
const HomeController        = require(controllerPath + 'home.controller');
const CategoryController    = require(controllerPath + 'category.controller');
const TopicController 		= require(controllerPath + 'topic.controller');
const MediaController 		= require(controllerPath + 'media.controller');
const CompanyController 	= require(controllerPath + 'company.controller');
const CoachController 	    = require(controllerPath + 'coach.controller');
const StudentController 	= require(controllerPath + 'student.controller');

// dashboard
clientRouter.get('/dashboard', HomeController.dashboard);

// category
const categoryRoutes = express.Router();
clientRouter.use('/categories', categoryRoutes);

categoryRoutes.post('/', CategoryController.create);
categoryRoutes.post('/import-templates', CategoryController.importTemplate);
categoryRoutes.get('/', CategoryController.getAll);
categoryRoutes.get('/form-input-data', CategoryController.formInputData);
categoryRoutes.get('/form-input-data/templates', CategoryController.getTemplate);
categoryRoutes.get('/:item_id', CategoryController.get);
categoryRoutes.put('/:item_id', CategoryController.update);
categoryRoutes.delete('/:item_id', CategoryController.remove);

// topic
const topicRoutes = express.Router();
clientRouter.use('/topics', topicRoutes);

topicRoutes.post('/', TopicController.create);
topicRoutes.post('/import-templates', TopicController.importTemplate);
topicRoutes.get('/', TopicController.getAll);
topicRoutes.get('/form-input-data', TopicController.formInputData);
topicRoutes.get('/form-input-data/templates', TopicController.getTemplate);
topicRoutes.get('/:item_id', TopicController.get);
topicRoutes.put('/:item_id', TopicController.update);
topicRoutes.put('/questions/:item_id', TopicController.addQuestion);
topicRoutes.delete('/:item_id', TopicController.remove);

// media
const mediaRoutes = express.Router();
clientRouter.use('/medias', mediaRoutes);

mediaRoutes.post('/', MediaController.create);
mediaRoutes.get('/', MediaController.getAll);
mediaRoutes.get('/:item_id', MediaController.get);
mediaRoutes.put('/:item_id', MediaController.update);
mediaRoutes.delete('/:item_id', MediaController.remove);

// company
const companyRoutes = express.Router();
clientRouter.use('/companies', companyRoutes);

companyRoutes.post('/', CompanyController.create);
companyRoutes.get('/', CompanyController.getAll);
companyRoutes.get('/form-input-data', CompanyController.formInputData);
companyRoutes.get('/:item_id', CompanyController.get);
companyRoutes.put('/:item_id', CompanyController.update);
companyRoutes.delete('/:item_id', CompanyController.remove);

// coach
const coachRoutes = express.Router();
clientRouter.use('/coaches', coachRoutes);

coachRoutes.post('/', CoachController.create);
coachRoutes.get('/', CoachController.getAll);
coachRoutes.get('/form-input-data', CoachController.formInputData);
coachRoutes.get('/:item_id', CoachController.get);
coachRoutes.put('/:item_id', CoachController.update);
coachRoutes.delete('/:item_id', CoachController.remove);

// student
const studentRoutes = express.Router();
clientRouter.use('/students', studentRoutes);

studentRoutes.post('/', StudentController.create);
studentRoutes.get('/', StudentController.getAll); 
studentRoutes.get('/form-input-data', StudentController.formInputData);
studentRoutes.get('/:item_id', StudentController.get);
studentRoutes.put('/:item_id', StudentController.update);
studentRoutes.delete('/:item_id', StudentController.remove);

module.exports = clientRouter;