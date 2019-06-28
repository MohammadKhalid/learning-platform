const express = require('express');
const router = express.Router();


const DebugController = require('../controllers/debug.controller');
const UserController = require('../controllers/user.controller');
const LiveGroupTrainingController = require('../controllers/live-group-training.controller');
const ShowTimeController = require('../controllers/show-time.controller');
const CompanyController = require('../controllers/company.controller');
const HomeController = require('../controllers/home.controller');
const FileController = require('../controllers/file.controller');
const VideoController = require('../controllers/video.controller');
const FormInputDataController = require('../controllers/form-input-data.controller');
const TopicController = require('../controllers/topic.controller');
const CategoryController = require('../controllers/category.controller');
const MediaController = require('../controllers/media.controller');
const QuestionController = require('../controllers/question.controller');
const AskExpertController = require('../controllers/ask-expert.controller');
const ContactController = require('../controllers/contact.controller');
const ChatController = require('../controllers/chat.controller');
const CourseController = require('../controllers/course.controller');
const SectionController = require('../controllers/section.controller');
const SubscriptionPackageController = require('../controllers/subscription-package.controller');

const custom = require('./../middleware/custom');
const role = require('./../middleware/role');
const media = require('./../middleware/media');
const showTime = require('./../middleware/show-time');
const askExpert = require('./../middleware/ask-expert');
const liveTrainig = require('../middleware/live-training');
const user = require('../middleware/user');

const passport = require('passport');


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

require('./../middleware/passport')(passport)
/* GET home page. */
router.get('/', function (req, res, next) {
  res.json({ status: "success", message: "Thrive19 API", data: { "version_number": "v1.0.0" } })
});

router.post('/login', UserController.login);

router.get('/profile', passport.authenticate('jwt', { session: false }), user.profile, user.item, UserController.get);        // R
router.put('/profile', passport.authenticate('jwt', { session: false }), user.profile, user.role, user.item, UserController.update);     // U

router.post('/companies', passport.authenticate('jwt', { session: false }), user.company, user.role, UserController.create);	   // C
router.get('/companies', passport.authenticate('jwt', { session: false }), user.company, UserController.getAll);     // R
router.get('/companies/:item_id', passport.authenticate('jwt', { session: false }), user.company, user.role, user.item, UserController.get);        // R
router.get('/companies/:item_id/students', passport.authenticate('jwt', { session: false }), user.company, user.role, user.item, UserController.getStaff);        // R
router.get('/companies/:item_id/coaches', passport.authenticate('jwt', { session: false }), user.company, user.role, user.item, UserController.getStaff);        // R
router.put('/companies/:item_id', passport.authenticate('jwt', { session: false }), user.company, user.role, user.item, UserController.update);     // U
router.delete('/companies/:item_id', passport.authenticate('jwt', { session: false }), user.company, user.role, user.item, UserController.remove);     // D

router.post('/coaches', passport.authenticate('jwt', { session: false }), user.coach, user.role, UserController.create);	   // C
router.get('/coaches', passport.authenticate('jwt', { session: false }), user.coach, UserController.getAll);     // R
router.get('/coaches/:item_id', passport.authenticate('jwt', { session: false }), user.coach, user.item, UserController.get);        // R
router.put('/coaches/:item_id', passport.authenticate('jwt', { session: false }), user.coach, user.role, user.item, UserController.update);     // U
router.delete('/coaches/:item_id', passport.authenticate('jwt', { session: false }), user.coach, user.role, user.item, UserController.remove);     // D

router.post('/students', passport.authenticate('jwt', { session: false }), user.student, user.role, UserController.create);	   // C
router.get('/students', passport.authenticate('jwt', { session: false }), user.student, UserController.getAll);     // R
router.get('/students/:item_id/practice-time', passport.authenticate('jwt', { session: false }), user.student, user.item, showTime.practice, UserController.getAllShowTime);     // R
router.get('/students/:item_id/show-time', passport.authenticate('jwt', { session: false }), user.student, user.item, UserController.getAllShowTime);     // R
router.get('/students/:item_id', passport.authenticate('jwt', { session: false }), user.student, user.role, user.item, UserController.get);        // R
router.put('/students/:item_id', passport.authenticate('jwt', { session: false }), user.student, user.role, user.item, UserController.update);     // U
router.delete('/students/:item_id', passport.authenticate('jwt', { session: false }), user.student, user.role, user.item, UserController.remove);     // D

router.post('/live-group-trainings', passport.authenticate('jwt', { session: false }), role.live_group_training, liveTrainig.participantsIn, LiveGroupTrainingController.create);	   							// C
router.get('/live-group-trainings', passport.authenticate('jwt', { session: false }), LiveGroupTrainingController.getAll);     													// R
router.get('/live-group-trainings/:item_id', passport.authenticate('jwt', { session: false }), custom.live_group_training, LiveGroupTrainingController.get);        							// R
router.put('/live-group-trainings/:item_id', passport.authenticate('jwt', { session: false }), role.live_group_training, custom.live_group_training, liveTrainig.participantsIn, LiveGroupTrainingController.update);     // U
router.put('/live-group-trainings/start/:item_id', passport.authenticate('jwt', { session: false }), role.live_group_training, custom.live_group_training, LiveGroupTrainingController.start);     // U
router.put('/live-group-trainings/close/:item_id', passport.authenticate('jwt', { session: false }), role.live_group_training, custom.live_group_training, LiveGroupTrainingController.close);     // U
router.delete('/live-group-trainings/:item_id', passport.authenticate('jwt', { session: false }), role.live_group_training, custom.live_group_training, LiveGroupTrainingController.remove);     // D

router.post('/practice-time', passport.authenticate('jwt', { session: false }), showTime.practice, ShowTimeController.create);	   						// C
router.post('/practice-time/answer/:item_id', passport.authenticate('jwt', { session: false }), ShowTimeController.answerQuestion);	   						// C
router.get('/practice-time', passport.authenticate('jwt', { session: false }), showTime.practice, ShowTimeController.getAll);     					 	// R
router.get('/practice-time/:item_id', passport.authenticate('jwt', { session: false }), showTime.item, ShowTimeController.get);       		// R
router.put('/practice-time/:item_id', passport.authenticate('jwt', { session: false }), showTime.item, ShowTimeController.update);   // U
router.put('/practice-time/review/:item_id', passport.authenticate('jwt', { session: false }), showTime.item, ShowTimeController.updateReview);   // U
router.put('/practice-time/submit/:item_id', passport.authenticate('jwt', { session: false }), showTime.item, ShowTimeController.submit);   		// U
router.delete('/practice-time/:item_id', passport.authenticate('jwt', { session: false }), showTime.item, ShowTimeController.remove);     	// D

router.post('/show-time', passport.authenticate('jwt', { session: false }), ShowTimeController.create);	   						// C
router.post('/show-time/answer/:item_id', passport.authenticate('jwt', { session: false }), showTime.item, ShowTimeController.answerQuestion);	   						// C
router.get('/show-time', passport.authenticate('jwt', { session: false }), ShowTimeController.getAll);     						// R
router.get('/show-time/:item_id', passport.authenticate('jwt', { session: false }), showTime.item, ShowTimeController.get);        		// R
router.put('/show-time/:item_id', passport.authenticate('jwt', { session: false }), showTime.item, ShowTimeController.update);   		// U
router.put('/show-time/submit/:item_id', passport.authenticate('jwt', { session: false }), showTime.item, ShowTimeController.submit);   		// U
router.put('/show-time/review/:item_id', passport.authenticate('jwt', { session: false }), showTime.item, ShowTimeController.updateReview);   	// U

router.post('/categories', passport.authenticate('jwt', { session: false }), CategoryController.create);	   	// C
router.get('/categories', passport.authenticate('jwt', { session: false }), CategoryController.getAll);     				// R
router.get('/categories/:item_id', passport.authenticate('jwt', { session: false }), custom.category, CategoryController.get);        				// R
router.put('/categories/:item_id', passport.authenticate('jwt', { session: false }), role.user, custom.category, CategoryController.update);   	// U
router.delete('/categories/:item_id', passport.authenticate('jwt', { session: false }), role.user, custom.category, CategoryController.remove);   	// D

router.post('/topics', passport.authenticate('jwt', { session: false }), role.user, media.questionMediasIn, custom.categoriesIn, TopicController.create);	   					// C
router.get('/topics', passport.authenticate('jwt', { session: false }), TopicController.getAll);     																		// R
router.get('/topics/:item_id', passport.authenticate('jwt', { session: false }), custom.topic, TopicController.get);        															// R
router.put('/topics/:item_id', passport.authenticate('jwt', { session: false }), role.user, custom.topic, media.questionMediasIn, custom.categoriesIn, TopicController.update);   	// U
router.put('/topics-questions/:item_id', passport.authenticate('jwt', { session: false }), role.user, custom.topic, media.questionMediasIn, TopicController.addQuestion);						// U
router.delete('/topics/:item_id', passport.authenticate('jwt', { session: false }), role.user, custom.topic, TopicController.remove);   													// D

router.post('/questions', passport.authenticate('jwt', { session: false }), role.user, media.itemsIn, QuestionController.create);	// C
router.get('/questions', passport.authenticate('jwt', { session: false }), QuestionController.getAll);     						// R
router.get('/questions/:item_id', passport.authenticate('jwt', { session: false }), QuestionController.get);        						// R
router.put('/questions/:item_id', passport.authenticate('jwt', { session: false }), role.user, QuestionController.update); 				// U
router.delete('/questions/:item_id', passport.authenticate('jwt', { session: false }), role.user, QuestionController.remove); 				// D

router.post('/medias', passport.authenticate('jwt', { session: false }), MediaController.create);	   		// C
router.get('/medias', passport.authenticate('jwt', { session: false }), MediaController.getAll);     		// R
router.get('/medias/:item_id', passport.authenticate('jwt', { session: false }), MediaController.get);        		// R
router.put('/medias/:item_id', passport.authenticate('jwt', { session: false }), role.user, MediaController.update); // U
router.delete('/medias/:item_id', passport.authenticate('jwt', { session: false }), role.user, MediaController.remove); // D

router.post('/ask-expert', passport.authenticate('jwt', { session: false }), media.itemsIn, AskExpertController.create);	   							// C
router.post('/ask-expert/question-answer/:item_id', passport.authenticate('jwt', { session: false }), askExpert.item, media.itemsIn, AskExpertController.questionAnswer);	   	// C
router.get('/ask-expert', passport.authenticate('jwt', { session: false }), AskExpertController.getAll);     						// R
router.get('/ask-expert/:item_id', passport.authenticate('jwt', { session: false }), askExpert.item, AskExpertController.get);        		// R
router.put('/ask-expert/:item_id', passport.authenticate('jwt', { session: false }), askExpert.item, AskExpertController.update);   			// U
router.delete('/ask-expert/:item_id', passport.authenticate('jwt', { session: false }), askExpert.item, AskExpertController.remove);   			// U

// router.post(    '/subscription-packages',           passport.authenticate('jwt', {session:false}), user.role, UserController.create);	   // C
router.get('/subscription-packages', passport.authenticate('jwt', { session: true }), SubscriptionPackageController.getAll);     // R
// router.get(     '/subscription-packages/:item_id',  passport.authenticate('jwt', {session:false}), user.role, user.item, UserController.get);        // R
// router.put(     '/subscription-packages/:item_id',  passport.authenticate('jwt', {session:false}), user.role, user.item, UserController.update);     // U
// router.delete(  '/subscription-packages/:item_id',  passport.authenticate('jwt', {session:false}), user.role, user.item, UserController.remove);     // D

// router.post(    '/companies',             passport.authenticate('jwt', {session:false}), CompanyController.create);                  // C
// router.get(     '/companies',             passport.authenticate('jwt', {session:false}), CompanyController.getAll);                  // R
// router.get(     '/companies/:company_id', passport.authenticate('jwt', {session:false}), custom.company, CompanyController.get);     // R
// router.put(     '/companies/:company_id', passport.authenticate('jwt', {session:false}), custom.company, CompanyController.update);  // U
// router.delete(  '/companies/:company_id', passport.authenticate('jwt', {session:false}), custom.company, CompanyController.remove);  // D

router.post('/contact', ContactController.create);
router.get('/contact', ContactController.findAll);
router.get('/contact/:id', ContactController.find);
router.get('/getcontactbyid/:id/:type', ContactController.getContactById);
router.put('/contact', ContactController.update);
router.delete('/contact/:id', ContactController.remove);

router.post('/chat', ChatController.create);
router.get('/chat/:userId/:contactId/:date', ChatController.find);
router.get('/chatDates/:userId/:contactId', ChatController.chatDates);
router.put('/chat', ChatController.update);
router.delete('/chat', ChatController.remove);


router.post('/courses', passport.authenticate('jwt', { session: false }), role.user,CertificationUpload, CourseController.create);
router.get('/courses/:coachId', passport.authenticate('jwt', { session: false }), role.user, CourseController.getCourse);
router.delete('/courses/:courseId', passport.authenticate('jwt', { session: false }), role.user, CourseController.removeCourse);
router.put('/courses/:courseId', passport.authenticate('jwt', { session: false }), role.user, CourseController.updateCourse);

router.post('/sections', passport.authenticate('jwt', { session: false }), role.user,CertificationUpload, SectionController.create);
router.get('/sections/:courseId', passport.authenticate('jwt', { session: false }), role.user,CertificationUpload, SectionController.getSections);
router.delete('/sections/:sectionId', passport.authenticate('jwt', { session: false }), role.user,CertificationUpload, SectionController.removeSection);
router.put('/sections/:sectionId', passport.authenticate('jwt', { session: false }), role.user,CertificationUpload, SectionController.updateSection);


router.get('/dashboard', passport.authenticate('jwt', { session: false }), HomeController.Dashboard);

router.get('/form-input-data', passport.authenticate('jwt', { session: false }), FormInputDataController.getAll); // R
router.get('/form-input-data/user', passport.authenticate('jwt', { session: false }), FormInputDataController.getUserInputData); // R

router.get('/uploads/:folder/:filename', VideoController.get); // R

// public
router.get('/media-viewer/:item_id', media.item, MediaController.get);     			// R

// debugging
router.get('/debug/send-mail', DebugController.send_mail);     			// R
router.get('/debug', DebugController.debug);     			// R

//********* assets **********
router.use('/img', express.static(path.join(__dirname, '/../public/img')));

//********* API DOCUMENTATION **********
router.use('/docs/api.json', express.static(path.join(__dirname, '/../public/v1/documentation/api.json')));
router.use('/docs', express.static(path.join(__dirname, '/../public/v1/documentation/dist')));
module.exports = router;