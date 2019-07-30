const express   = require('express');
const path      = require('path');
const passport 	= require('passport');

const apiRoutes = express.Router();
const requireAuth = passport.authenticate('jwt', { session: false });

// middleware
require('./../../middleware/passport')(passport);
const userMidware = require('../../middleware/user');

/* GET home page. */
apiRoutes.get('/', function(req, res, next) {
  res.json({status:"success", message:"Thrive19 API", data:{"version_number":"v1.0.0"}})
});

// assets
const VideoController = require('../../controllers/video.controller');

apiRoutes.use('/img',  express.static(path.join(__dirname, '/../public/img')));
apiRoutes.get('/uploads/:folder/:filename', VideoController.get);
// user
apiRoutes.use("/auth", require("./auth"));
console.log(__dirname+'/../uploads')
apiRoutes.use('/uploads',express.static('../uploads'))
// apiRoutes.use('/uploads',express.static(path.join(__dirname, '/../uploads')))

const userTypes = ['admin', 'client', 'student', 'coach'];
for (let index = 0; index < userTypes.length; index++) {
  const userType = userTypes[index];
  
  // user assets
  apiRoutes.use("/" + userType + '/img',  express.static(path.join(__dirname, '/../public/img')));
  apiRoutes.get("/" + userType + '/uploads/:folder/:filename', VideoController.get);

  // user routes
  apiRoutes.use("/" + userType, userMidware.accessLevel[userType], requireAuth, require("./" + userType));
}

module.exports = apiRoutes;

/*
const express = require('express');

const DebugController				      = require('../../controllers/debug.controller');
const AuthController 				      = require('../../controllers/auth.controller');
const UserController 				      = require('../../controllers/user.controller');
const LiveGroupTrainingController = require('../../controllers/live-group-training.controller');
const ShowTimeController 			    = require('../../controllers/show-time.controller');
const CompanyController 			    = require('../../controllers/company.controller');
const HomeController 				      = require('../../controllers/home.controller');
const FileController 				      = require('../../controllers/file.controller');
const VideoController 				    = require('../../controllers/video.controller');
const FormInputDataController		  = require('../../controllers/form-input-data.controller');
const TopicController 				    = require('../../controllers/topic.controller');
const CategoryController 			    = require('../../controllers/category.controller');
const MediaController 				    = require('../../controllers/media.controller');
const QuestionController 			    = require('../../controllers/question.controller');
const AskExpertController 			  = require('../../controllers/ask-expert.controller');
const ContactController           = require('../../controllers/contact.controller');
const ChatController              = require('../../controllers/chat.controller');

const custom 	    = require('../../middleware/custom');
const role 	   	  = require('../../middleware/role');
const media 	    = require('../../middleware/media');
const showTime 	  = require('../../middleware/show-time');
const askExpert	  = require('../../middleware/ask-expert');
const liveTrainig = require('../../middleware/live-training');
const user        = require('../../middleware/user');
const company     = require('../../middleware/company');

const passport 	= require('passport');
const path  = require('path');

const requireAuth = passport.authenticate('jwt', {session: false});
// const requireLogin = passport.authenticate('local', {session: false});

var apiRoutes = express.Router();

require('./../../middleware/passport')(passport);

//********** GET home page. **********
apiRoutes.get('/', function(req, res, next) {
  res.json({status:"success", message:"Thrive19 API", data:{"version_number":"v1.0.0"}})
});

// auth
const authRoutes = express.Router();
apiRoutes.use('/auth', authRoutes);

authRoutes.post('/login', AuthController.login);

// dashboard
apiRoutes.get('/dashboard', requireAuth, HomeController.Dashboard);

// profile
const profileRoutes = express.Router();
apiRoutes.use('/profile', profileRoutes);

profileRoutes.get('/', requireAuth, user.type.profile, user.item, UserController.get);
profileRoutes.put('/', requireAuth, user.type.profile, user.item, UserController.update);

// client
const clientRoutes = express.Router();
apiRoutes.use('/clients', clientRoutes);

clientRoutes.post('/', requireAuth, user.type.client, UserController.create);
clientRoutes.get('/', requireAuth, user.type.client, UserController.getAll);
clientRoutes.get('/:item_id',  requireAuth, user.type.client, user.item, UserController.get);
clientRoutes.put('/:item_id',  requireAuth, user.type.client, user.item, UserController.update);
clientRoutes.delete('/:item_id',  requireAuth, user.type.client, user.item, UserController.remove);

// coach
const coachRoutes = express.Router();
apiRoutes.use('/coaches', coachRoutes);

coachRoutes.post('/', requireAuth, company.client, user.type.coach, UserController.create);
coachRoutes.get('/', requireAuth, user.type.coach, UserController.getAll);
coachRoutes.get('/:item_id',  requireAuth, user.type.coach, user.item, UserController.get);
coachRoutes.put('/:item_id',  requireAuth, user.type.coach, user.item, UserController.update);
coachRoutes.delete('/:item_id',  requireAuth, user.type.coach, user.item, UserController.remove);

// student
const studentRoutes = express.Router();
apiRoutes.use('/students', studentRoutes);

studentRoutes.post('/', requireAuth, user.type.student, UserController.create);
studentRoutes.get('/', requireAuth, user.type.student, UserController.getAll); 
studentRoutes.get('/:item_id/practice-time', requireAuth, user.item, showTime.practice, UserController.getAllShowTime);
studentRoutes.get('/:item_id/show-time', requireAuth, user.item, UserController.getAllShowTime);
studentRoutes.get('/:item_id', requireAuth, user.type.student, user.item, UserController.get);
studentRoutes.put('/:item_id', requireAuth, user.type.student, user.item, UserController.update);
studentRoutes.delete('/:item_id', requireAuth, user.type.student, user.item, UserController.remove);

// live group training
const liveGroupTrainingRoutes = express.Router();
apiRoutes.use('/live-group-trainings', liveGroupTrainingRoutes);

liveGroupTrainingRoutes.post('/', requireAuth, role.live_group_training, liveTrainig.participantsIn, LiveGroupTrainingController.create);
liveGroupTrainingRoutes.get('/', requireAuth, LiveGroupTrainingController.getAll);
liveGroupTrainingRoutes.get('/:item_id',  requireAuth, custom.live_group_training, LiveGroupTrainingController.get);
liveGroupTrainingRoutes.put('/:item_id',  requireAuth, role.live_group_training, custom.live_group_training, liveTrainig.participantsIn, LiveGroupTrainingController.update);
liveGroupTrainingRoutes.put('/start/:item_id',  requireAuth, role.live_group_training, custom.live_group_training, LiveGroupTrainingController.start);
liveGroupTrainingRoutes.put('/close/:item_id',  requireAuth, role.live_group_training, custom.live_group_training, LiveGroupTrainingController.close);
liveGroupTrainingRoutes.delete('/:item_id',  requireAuth, role.live_group_training, custom.live_group_training, LiveGroupTrainingController.remove);

// practice time
const practiceTimeRoutes = express.Router();
apiRoutes.use('/practice-time', practiceTimeRoutes);

practiceTimeRoutes.post('/', requireAuth, showTime.practice, ShowTimeController.create);
practiceTimeRoutes.post('/answer/:item_id', requireAuth, showTime.item, ShowTimeController.answerQuestion);
practiceTimeRoutes.get('/', requireAuth, showTime.practice, ShowTimeController.getAll);
practiceTimeRoutes.get('/:item_id', requireAuth, showTime.item, ShowTimeController.get);
practiceTimeRoutes.put('/:item_id', requireAuth, showTime.item, ShowTimeController.update);
practiceTimeRoutes.put('/review/:item_id', requireAuth, showTime.item, ShowTimeController.updateReview);
practiceTimeRoutes.put('/submit/:item_id', requireAuth, showTime.item, ShowTimeController.submit);
practiceTimeRoutes.delete('/:item_id', requireAuth, showTime.item, ShowTimeController.remove);

// show time
const showTimeRoutes = express.Router();
apiRoutes.use('/show-time', showTimeRoutes);

showTimeRoutes.post('/', requireAuth, ShowTimeController.create);
showTimeRoutes.post('/answer/:item_id', requireAuth, showTime.item, ShowTimeController.answerQuestion);
showTimeRoutes.get('/show-time', requireAuth, ShowTimeController.getAll);
showTimeRoutes.get('/:item_id', requireAuth, showTime.item, ShowTimeController.get);
showTimeRoutes.put('/:item_id', requireAuth, showTime.item, ShowTimeController.update);
showTimeRoutes.put('/submit/:item_id', requireAuth, showTime.item, ShowTimeController.submit);
showTimeRoutes.put('/review/:item_id', requireAuth, showTime.item, ShowTimeController.updateReview);

// category
const categoryRoutes = express.Router();
apiRoutes.use('/categories', categoryRoutes);

categoryRoutes.post('/', requireAuth, role.user, CategoryController.create);
categoryRoutes.get('/', requireAuth, CategoryController.getAll);
categoryRoutes.get('/:item_id', requireAuth, custom.category, CategoryController.get);
categoryRoutes.put('/:item_id', requireAuth, role.user, custom.category, CategoryController.update);
categoryRoutes.delete('/:item_id', requireAuth, role.user, custom.category, CategoryController.remove);

// topic
const topicRoutes = express.Router();
apiRoutes.use('/topics', topicRoutes);

topicRoutes.post('/', requireAuth, role.user, media.questionMediasIn, custom.categoriesIn, TopicController.create);
topicRoutes.get('/', requireAuth, TopicController.getAll);
topicRoutes.get('/:item_id', requireAuth, custom.topic, TopicController.get);
topicRoutes.put('/:item_id', requireAuth, role.user, custom.topic, media.questionMediasIn, custom.categoriesIn, TopicController.update);
topicRoutes.put('/questions/:item_id', requireAuth, role.user, custom.topic, media.questionMediasIn, TopicController.addQuestion);
topicRoutes.delete('/:item_id', requireAuth, role.user, custom.topic, TopicController.remove);

// question
const questionRoutes = express.Router();
apiRoutes.use('/questions', questionRoutes);

questionRoutes.post('/', requireAuth, role.user, media.itemsIn, QuestionController.create);
questionRoutes.get('/', requireAuth, QuestionController.getAll);
questionRoutes.get('/:item_id',  requireAuth, QuestionController.get);
questionRoutes.put('/:item_id',  requireAuth, role.user, QuestionController.update);
questionRoutes.delete('/:item_id',  requireAuth, role.user, QuestionController.remove);

// media
const mediaRoutes = express.Router();
apiRoutes.use('/medias', mediaRoutes);

mediaRoutes.post('/', requireAuth, MediaController.create);
mediaRoutes.get('/', requireAuth, MediaController.getAll);
mediaRoutes.get('/:item_id',  requireAuth, MediaController.get);
mediaRoutes.put('/:item_id',  requireAuth, role.user, MediaController.update);
mediaRoutes.delete('/:item_id',  requireAuth, role.user, MediaController.remove);

// ask expert
const askExpertRoutes = express.Router();
apiRoutes.use('/ask-expert', askExpertRoutes);

askExpertRoutes.post('/', requireAuth, media.itemsIn, AskExpertController.create);
askExpertRoutes.post('/question-answer/:item_id', requireAuth, askExpert.item, media.itemsIn, AskExpertController.questionAnswer);
askExpertRoutes.get('/', requireAuth, AskExpertController.getAll);
askExpertRoutes.get('/:item_id', requireAuth, askExpert.item, AskExpertController.get);
askExpertRoutes.put('/:item_id', requireAuth, askExpert.item, AskExpertController.update);
askExpertRoutes.delete('/:item_id', requireAuth, askExpert.item, AskExpertController.remove);

// company
const companyRoutes = express.Router();
apiRoutes.use('/companies', companyRoutes);

companyRoutes.post('/', requireAuth, company.client, CompanyController.create);
companyRoutes.get('/', requireAuth, CompanyController.getAll);
companyRoutes.get('/:item_id', requireAuth, custom.company, CompanyController.get);
companyRoutes.put('/:item_id', requireAuth, custom.company, CompanyController.update);
companyRoutes.delete('/:item_id', requireAuth, custom.company, CompanyController.remove);

// contact
apiRoutes.post('/contact', ContactController.create);
apiRoutes.get('/contact', ContactController.findAll);
apiRoutes.get('/contact/:id', ContactController.find);
apiRoutes.get('/getcontactbyid/:id/:type', ContactController.getContactById);
apiRoutes.put('/contact', ContactController.update);
apiRoutes.delete('/contact/:id', ContactController.remove);

// chat
apiRoutes.post('/chat', ChatController.create);
apiRoutes.get('/chat/:userId/:contactId/:date', ChatController.find);
apiRoutes.get('/chatDates/:userId/:contactId', ChatController.chatDates);
apiRoutes.put('/chat', ChatController.update);
apiRoutes.delete('/chat', ChatController.remove);

// form
const formInputDataRoutes = express.Router();
apiRoutes.use('/form-input-data', formInputDataRoutes);

formInputDataRoutes.get('/', requireAuth, FormInputDataController.getQuery);

// public
apiRoutes.get('/media-viewer/:item_id', media.item, MediaController.get);

// debugging
const debugRoutes = express.Router();
apiRoutes.use('/debug', debugRoutes);

debugRoutes.get('/send-mail', DebugController.send_mail);
debugRoutes.get('/', DebugController.debug);

//********* assets **********
apiRoutes.use('/img',  express.static(path.join(__dirname, '/../public/img')));
apiRoutes.get('/uploads/:folder/:filename', VideoController.get);

//********* API DOCUMENTATION **********
const docRoutes = express.Router();
apiRoutes.use('/docs', docRoutes);

docRoutes.use('/api.json',  express.static(path.join(__dirname, '/../../public/v1/documentation/api.json')));
docRoutes.use('/', express.static(path.join(__dirname, '/../../public/v1/documentation/dist')));

module.exports = apiRoutes;
*/