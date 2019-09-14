const express           = require('express');
const adminRouter   = express.Router();

// controllers
const controllerPath = '../../controllers/admin/';
const HomeController 			    = require(controllerPath + 'home.controller');
const CategoryController 			= require(controllerPath + 'category.controller');
const TopicController 				= require(controllerPath + 'topic.controller');
const MediaController 				= require(controllerPath + 'media.controller');
const CompanyController 			= require(controllerPath + 'company.controller');
const ClientController 	            = require(controllerPath + 'client.controller');
const CoachController 	            = require(controllerPath + 'coach.controller');
const StudentController 	        = require(controllerPath + 'student.controller');
const courseCategoryController      = require(controllerPath + 'courseCategory.controller')
const levelSettingController        = require(controllerPath + 'studentExperienceSetting.controller')
const courseClientController        = require(controllerPath + 'courseClient.controller')

// const ProfileController 	        = require(controllerPath + 'profile.controller');
// const LiveGroupTrainingController   = require(controllerPath + 'live-group-training.controller');
// const ShowTimeController 			= require(controllerPath + 'show-time.controller');
// const FormInputDataController		= require(controllerPath + 'form-input-data.controller');
// const QuestionController 			= require(controllerPath + 'question.controller');
// const AskExpertController 			= require(controllerPath + 'ask-expert.controller');
// const ContactController             = require(controllerPath + 'contact.controller');
// const ChatController                = require(controllerPath + 'chat.controller');

// dashboard
adminRouter.get('/dashboard', HomeController.dashboard);

// category
const categoryRoutes = express.Router();
adminRouter.use('/categories', categoryRoutes);

categoryRoutes.post('/', CategoryController.create);
categoryRoutes.get('/', CategoryController.getAll);
categoryRoutes.get('/form-input-data', CategoryController.formInputData);
categoryRoutes.get('/:item_id', CategoryController.get);
categoryRoutes.put('/:item_id', CategoryController.update);
categoryRoutes.delete('/:item_id', CategoryController.remove);

// topic
const topicRoutes = express.Router();
adminRouter.use('/topics', topicRoutes);

topicRoutes.post('/', TopicController.create);
topicRoutes.get('/', TopicController.getAll);
topicRoutes.get('/form-input-data', TopicController.formInputData);
topicRoutes.get('/:item_id', TopicController.get);
topicRoutes.put('/:item_id', TopicController.update);
topicRoutes.put('/questions/:item_id', TopicController.addQuestion);
topicRoutes.delete('/:item_id', TopicController.remove);

// media
const mediaRoutes = express.Router();
adminRouter.use('/medias', mediaRoutes);

mediaRoutes.post('/', MediaController.create);
mediaRoutes.get('/', MediaController.getAll);
mediaRoutes.get('/:item_id', MediaController.get);
mediaRoutes.put('/:item_id', MediaController.update);
mediaRoutes.delete('/:item_id', MediaController.remove);

// company
const companyRoutes = express.Router();
adminRouter.use('/companies', companyRoutes);

companyRoutes.post('/', CompanyController.create);
companyRoutes.get('/', CompanyController.getAll);
companyRoutes.get('/form-input-data', CompanyController.formInputData);
companyRoutes.get('/:item_id', CompanyController.get);
companyRoutes.put('/:item_id', CompanyController.update);
companyRoutes.delete('/:item_id', CompanyController.remove);

// client
const clientRoutes = express.Router();
adminRouter.use('/clients', clientRoutes);

clientRoutes.post('/', ClientController.create);
clientRoutes.get('/', ClientController.getAll);
clientRoutes.get('/form-input-data', ClientController.formInputData);
clientRoutes.get('/:item_id',  ClientController.get);
clientRoutes.put('/:item_id',  ClientController.update);
clientRoutes.delete('/:item_id',  ClientController.remove);

// coach
const coachRoutes = express.Router();
adminRouter.use('/coaches', coachRoutes);

coachRoutes.post('/', CoachController.create);
coachRoutes.get('/', CoachController.getAll);
coachRoutes.get('/form-input-data', CoachController.formInputData);
coachRoutes.get('/:item_id', CoachController.get);
coachRoutes.put('/:item_id', CoachController.update);
coachRoutes.delete('/:item_id', CoachController.remove);

// student
const studentRoutes = express.Router();
adminRouter.use('/students', studentRoutes);

studentRoutes.post('/' ,StudentController.create);
studentRoutes.get('/', StudentController.getAll); 
studentRoutes.get('/form-input-data', StudentController.formInputData);
studentRoutes.get('/:item_id', StudentController.get);
studentRoutes.put('/:item_id', StudentController.update);
studentRoutes.delete('/:item_id', StudentController.remove);

// course Client
const courseClientRoutes = express.Router();
adminRouter.use('/course-client-company', courseClientRoutes);

courseClientRoutes.get('/clients' ,courseClientController.getClients)
courseClientRoutes.get('/companies/:clientId/:flag' ,courseClientController.getClientCompany)


// course category
const courseCategoryRoutes = express.Router();
adminRouter.use('/course-category', courseCategoryRoutes);

courseCategoryRoutes.post('/', courseCategoryController.create);
courseCategoryRoutes.get('/get-all', courseCategoryController.getAll);
courseCategoryRoutes.get('/:item_id', courseCategoryController.get);
courseCategoryRoutes.put('/:item_id', courseCategoryController.update);
courseCategoryRoutes.delete('/:item_id', courseCategoryController.remove);


//level settings

const levelSettingRoutes = express.Router();
adminRouter.use('/levelSetting', levelSettingRoutes);

levelSettingRoutes.get('/get/:itemId',levelSettingController.get)
levelSettingRoutes.post('/',levelSettingController.create)
levelSettingRoutes.get('/get-all', levelSettingController.getAll);
levelSettingRoutes.put('/update/:itemId', levelSettingController.update);

// // profile
// const profileRoutes = express.Router();
// adminRouter.use('/profile', profileRoutes);

// profileRoutes.get('/', ProfileController.get);
// profileRoutes.put('/', ProfileController.update);

// // live group training
// const liveGroupTrainingRoutes = express.Router();
// adminRouter.use('/live-group-trainings', liveGroupTrainingRoutes);

// liveGroupTrainingRoutes.post('/', LiveGroupTrainingController.create);
// liveGroupTrainingRoutes.get('/', LiveGroupTrainingController.getAll);
// liveGroupTrainingRoutes.get('/:item_id',  LiveGroupTrainingController.get);
// liveGroupTrainingRoutes.put('/:item_id',  liveTrainig.participantsIn, LiveGroupTrainingController.update);
// liveGroupTrainingRoutes.put('/start/:item_id',  LiveGroupTrainingController.start);
// liveGroupTrainingRoutes.put('/close/:item_id',  LiveGroupTrainingController.close);
// liveGroupTrainingRoutes.delete('/:item_id',  LiveGroupTrainingController.remove);

// // practice time
// const practiceTimeRoutes = express.Router();
// adminRouter.use('/practice-time', practiceTimeRoutes);

// practiceTimeRoutes.post('/', ShowTimeController.create);
// practiceTimeRoutes.post('/answer/:item_id', ShowTimeController.answerQuestion);
// practiceTimeRoutes.get('/', ShowTimeController.getAll);
// practiceTimeRoutes.get('/:item_id', ShowTimeController.get);
// practiceTimeRoutes.put('/:item_id', ShowTimeController.update);
// practiceTimeRoutes.put('/review/:item_id', ShowTimeController.updateReview);
// practiceTimeRoutes.put('/submit/:item_id', ShowTimeController.submit);
// practiceTimeRoutes.delete('/:item_id', ShowTimeController.remove);

// // show time
// const showTimeRoutes = express.Router();
// adminRouter.use('/show-time', showTimeRoutes);

// showTimeRoutes.post('/', ShowTimeController.create);
// showTimeRoutes.post('/answer/:item_id', ShowTimeController.answerQuestion);
// showTimeRoutes.get('/show-time', ShowTimeController.getAll);
// showTimeRoutes.get('/:item_id', ShowTimeController.get);
// showTimeRoutes.put('/:item_id', ShowTimeController.update);
// showTimeRoutes.put('/submit/:item_id', ShowTimeController.submit);
// showTimeRoutes.put('/review/:item_id', ShowTimeController.updateReview);

// // question
// const questionRoutes = express.Router();
// adminRouter.use('/questions', questionRoutes);

// questionRoutes.post('/', QuestionController.create);
// questionRoutes.get('/', QuestionController.getAll);
// questionRoutes.get('/:item_id', QuestionController.get);
// questionRoutes.put('/:item_id', QuestionController.update);
// questionRoutes.delete('/:item_id', QuestionController.remove);

// // ask expert
// const askExpertRoutes = express.Router();
// adminRouter.use('/ask-expert', askExpertRoutes);

// askExpertRoutes.post('/', AskExpertController.create);
// askExpertRoutes.post('/question-answer/:item_id', AskExpertController.questionAnswer);
// askExpertRoutes.get('/', AskExpertController.getAll);
// askExpertRoutes.get('/:item_id', AskExpertController.get);
// askExpertRoutes.put('/:item_id', AskExpertController.update);
// askExpertRoutes.delete('/:item_id', AskExpertController.remove);

// // contact
// adminRouter.post('/contact', ContactController.create);
// adminRouter.get('/contact', ContactController.findAll);
// adminRouter.get('/contact/:id', ContactController.find);
// adminRouter.get('/getcontactbyid/:id/:type', ContactController.getContactById);
// adminRouter.put('/contact', ContactController.update);
// adminRouter.delete('/contact/:id', ContactController.remove);

// // chat
// adminRouter.post('/chat', ChatController.create);
// adminRouter.get('/chat/:userId/:contactId/:date', ChatController.find);
// adminRouter.get('/chatDates/:userId/:contactId', ChatController.chatDates);
// adminRouter.put('/chat', ChatController.update);
// adminRouter.delete('/chat', ChatController.remove);

// // form
// const formInputDataRoutes = express.Router();
// adminRouter.use('/form-input-data', formInputDataRoutes);

// formInputDataRoutes.get('/', FormInputDataController.getQuery);

module.exports = adminRouter;