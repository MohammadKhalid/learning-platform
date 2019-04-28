const { ShowTime, User, Answer, Topic } = require('../models');
const { to, ReE, ReS } = require('../services/util.service');
const mandrill = require('mandrill-api/mandrill');
const { send_message } = require('../services/mail.service');

const debug = async function(req, res){
    let err, item, items, answer;

    // add show time, answer
    // User.findOne({
    //     where: { username: 'student123' }
    // }).then((user) => {
    //     Topic.findOne({
    //         where:{ id: 4 },
    //         include: ['questions']
    //     }).then((topic) => {
    //         user.createShowTime({
    //             isPractice: false,
    //             topicId: topic.id,
    //         }, {
    //             include: ['topic']
    //         }).then((showtime) => {
    //             for (var i = topic.questions.length - 1; i >= 0; i--) {
    //                 showtime.createAnswer(
    //                     { answer: '=1', answerableId: topic.questions[i].id }
    //                 ),
    //                 showtime.createAnswer(
    //                     { answer: '=2', answerableId: topic.questions[i].id }
    //                 ),
    //                 showtime.createAnswer(
    //                     { answer: '=3', answerableId: topic.questions[i].id }
    //                 )
    //             }
    //         });
    //     });
    // });

    // [err, item] = await to(Topic.findOne({
    //     where:{ id: 4 },
    //     include: ['questions']
    // }));
    // if(err) return ReE(res, err);
    
    // [err, items] = await to(item.getAnswers());
    // if(err) return ReE(res, err);

    // console.log('ITEMMM', item);
    
    return ReS(res, {item});
}
module.exports.debug = debug

const send_mail = async function(req, res){
    let item_id, err, item;
        item_id = 2; // Temp

    [err, item] = await to(ShowTime.findOne({
        where: { id:item_id },
        include: [ 
            {
                association: 'answers',
                include: ['medias']
            },
            {
                association: 'coach',
                attributes: [ 'id', 'firstName', 'lastName' ]
            },
            {
                association: 'student',
                attributes: [ 'id', 'firstName', 'lastName' ]
            },
            {
                association: 'topic',
                include: [ 
                    {
                        association: 'questions',
                        include: [ 
                            {
                                association: 'question',
                                include: ['medias']
                            }
                        ]
                    }
                ]
            }
        ]
    }));
    if(err) return ReE(res, "err finding");
    if(!item) return ReE(res, "not found with id: " + item_id);

    item = item.toJSON();

	let item_data = {
        sendTo: 'manvillt@gmail.com'
    };

    let subject = item.isPractice ? 'Practice Time' : 'Show Time';
    let message = await composeEmail(item);

    let sendTo = ((item_data.sendTo.replace(/\s/g, '')).replace(/,\s*$/, '')).split(',');
    let sendToArray = [].concat(sendTo);

    let recipients = [];
    for (var i = sendToArray.length - 1; i >= 0; i--) {
        recipients.push({email: sendToArray[i]});
    }

    send_message(subject, message, recipients);

	return res.json({success: true, message: message.success});
}
module.exports.send_mail = send_mail

async function composeEmail(item) {
    let subject = item.isPractice ? 'Practice Time' : 'Show Time';
    let coachFirstName, coachLastName;
    let baseUrl = 'https://api.thrive19.com/v1/';
    // let baseUrl = 'http://api.thrive19.local:3000/v1/';
    let body_html = '';

    if(item.coach) {
        coachFirstName = item.coach.firstName;
        coachLastName = item.coach.lastName;
    }

    // build answer
    let answers = {};
    for (var ii = item.answers.length - 1; ii >= 0; ii--) {
        let videoPoster, videoPath;

        for (var i = item.answers[ii].medias.length - 1; i >= 0; i--) {
            let media       = item.answers[ii].medias[i];

            let type        = media.type;
            let typeArray   = type.split('/')[0];

            let mediaPaths = [
                { type: type, path: baseUrl + media.path }
            ];

            if(typeArray === 'video' || type === 'application/octet-stream') {
                // set poster
                if(!videoPoster && media.snapshot) videoPoster = baseUrl + media.snapshot;

                // set video link
                if(!videoPath && media.path) videoPath = baseUrl + media.path;

                // mp4 path
                let mediaPath = media.path;

                let mediaPathArray  = mediaPath.split('.');
                let mediaFileExt    = mediaPathArray[mediaPathArray.length - 1];
                
                if(mediaFileExt !== 'mp4') {
                    let newMediaPathArray   = mediaPathArray;
                        newMediaPathArray.pop();
                    
                    let newMediaPath    = newMediaPathArray.join('.') + '.mp4'; 
                    mediaPaths.push({type: 'video/mp4', path: baseUrl + newMediaPath});
                } else if(mediaFileExt === 'mp4') {
                    // mp4 is priority
                    videoPath = baseUrl + mediaPath;
                }
            }
            
            item.answers[ii].medias[i].paths = mediaPaths;
        }

        // set video link
        item.answers[ii].videoPath = videoPath;

        // set poster for old media
        item.answers[ii].videoPoster = videoPoster ? videoPoster : baseUrl + 'img/video-poster.jpg';

        answers[item.answers[ii].ShowTimeAnswer.topicQuestionId] = item.answers[ii];
    }

    let questionsHtml = '';
    for (var i = item.topic.questions.length - 1; i >= 0; i--) {
        let challenge = item.topic.questions[i];

        questionsHtml += '<div style="margin-bottom:1px; padding: 1.6rem;min-height: 30px; background-color: #222222; text-align: center; color: #eeeeee;">';
        
            questionsHtml += '<h3 style="font-size: 20px;margin:0 0 .6rem; padding:0; color:#3dc4e2;">#' + challenge.number + '</h3> \
            <p style="font-size: 14px;margin:0 0 1.6rem; padding:0; font-size: 13px; letter-spacing: .5px;">' + challenge.question.question + '</p>';

            if(answers[challenge.id]) {
                questionsHtml += '<video \
                    poster="' + answers[challenge.id].videoPoster + '" width="100%" controls="controls"> \
                ';

                for (var ii = answers[challenge.id].medias[0].paths.length - 1; ii >= 0; ii--) {
                    let mediaPath = answers[challenge.id].medias[0].paths[ii];

                    if(answers[challenge.id].medias[0].type === 'video/webm' || answers[challenge.id].medias[0].type === 'video/mp4' || answers[challenge.id].medias[0].type === 'application/octet-stream') {
                        questionsHtml += '<source src="' + mediaPath.path + '" type="' + mediaPath.type +'" />';
                    }
                }

                questionsHtml += '<a target="_blank" href="' + answers[challenge.id].videoPath +'"> \
                        <img src="' + answers[challenge.id].videoPoster + '" width="100%" height="50%" alt="image instead of video" /> \
                    </a> \
                </video>';
            } else {
                questionsHtml += '<p style="color: red;">No answer provided.</p>';
            }

        questionsHtml += '</div>';
    }

    body_html = '<center> \
        <table border="0" cellpadding="0" cellspacing="0" width="100%" \
            style="height:100%;margin:0;padding:30px 0 20px;background-color:#eee;width:100%!important"> \
            <tbody> \
                <tr> \
                    <td align="center" valign="top"> \
                        <table border="0" cellpadding="0" cellspacing="0" width="600" style="background-color:#0065b3"> \
                            <tbody> \
                                <tr> \
                                    <td valign="top" \
                                        style="color:#3276b1;font-family:Arial;font-size:10px;line-height:100%;text-align:left"> \
                                        <table border="0" cellpadding="0" cellspacing="0" width="100%"> \
                                            <tbody> \
                                                <tr> \
                                                    <td valign="top"> \
                                                        <div \
                                                            style="display:none;font-size:1px;color:#ffffff;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden"> \
                                                            ' + item.topic.title + ' - ' + item.topic.description + '</div><br> \
                                                    </td> \
                                                </tr> \
                                            </tbody> \
                                        </table> \
                                    </td> \
                                </tr> \
                            </tbody> \
                        </table> \
                        <table border="0" cellpadding="0" cellspacing="0" width="600" \
                            style="border:0;background-color:#fdfdfd"> \
                            <tbody> \
                                <tr> \
                                    <td align="center" valign="top"> \
                                        <table border="0" cellpadding="0" cellspacing="0" width="600" \
                                            style="background-color:#ffffff;border-bottom:0"> \
                                            <tbody> \
                                                <tr> \
                                                    <td valign="center" width="50%"> \
                                                        <div style="padding: 1rem 1.5rem;"> \
                                                            <img alt="" border="0" src="https://thrive19.com/assets/img/logo.png" width="175"> \
                                                        </div> \
                                                    </td> \
                                                    <td valign="center" width="50%"> \
                                                        <h1 style="font-family: Arial, Helvetica, sans-serif; font-size: 22px;margin:0; padding:0 1.6rem 0 0; text-transform: uppercase; text-align:right;">' + subject + '</h1> \
                                                    </td> \
                                                </tr> \
                                            </tbody> \
                                        </table> \
                                    </td> \
                                </tr> \
                                <tr> \
                                    <td align="center" valign="top"> \
                                        <table border="0" cellpadding="0" cellspacing="0" width="600"> \
                                            <tbody> \
                                                <tr> \
                                                    <td valign="top" \
                                                        style="background-color:#fdfdfd;color:#505050;font-family:Arial;font-size:14px;line-height:150%;text-align:left;"> \
                                                        <table border="0" cellpadding="0" cellspacing="0" width="100%"> \
                                                            <tbody> \
                                                                <tr> \
                                                                    <td valign="top"> \
                                                                        <div style="background-color:#f4f4f4;padding:1rem 1.6rem .2rem;border-bottom:2px dashed #cccccc;"> \
                                                                            <div style="padding:3px 0 8px;font-size:14px;"> \
                                                                                <table width="100%" height="100%" border="0" \
                                                                                    cellspacing="0" cellpadding="0"> \
                                                                                    <tbody> \
                                                                                        <tr> \
                                                                                            <td valign="top" width="50%"> \
                                                                                                <div style="color:#999; font-size: 12px; padding-bottom: 6px;">NAME</div> \
                                                                                                ' + item.student.firstName + ' \
                                                                                                ' + item.student.lastName + ' \
                                                                                            </td> \
                                                                                            <td valign="top" width="50%"> \
                                                                                                <div style="color:#999; font-size: 12px; padding-bottom: 6px;">COACH</div> \
                                                                                                ' + coachFirstName + ' \
                                                                                                ' + coachLastName + ' \
                                                                                            </td> \
                                                                                        </tr> \
                                                                                    </tbody> \
                                                                                </table> \
                                                                            </div> \
                                                                        </div> \
                                                                        <div style="padding:1.6rem; text-align: center;"> \
                                                                            <h2 style="font-size: 20px;margin:0 0 1rem; padding:0; color:#0065b3;">' + item.topic.title + '</h2> \
                                                                            <p style="margin:0 0 1.6rem; padding:0; color:#999999; font-size: 14px;">' + item.topic.description + '</p> \
                                                                            <h2 style="font-size: 16px;margin:0 0 1rem; padding:0; color:#0065b3;">Challenges / Questions</h2> \
                                                                            ' + questionsHtml + ' \
                                                                        </div> \
                                                                        <div style="padding:1.6rem;"> \
                                                                            <p \
                                                                                style="font-weight:bold;margin-bottom:25px;font-size:14px"> \
                                                                                Support Team <br><span \
                                                                                    style="font-size:12px;color:#999999;">THRIVE19</span> \
                                                                            </p> \
                                                                            <p style="font-size:11px;margin-bottom:15px">If you have any questions or for more information on how we can help increase your sales. Contact us at -  \
                                                                                <a href="mailto:support@thrive19.com" style="color:#336699;font-weight:normal;text-decoration:underline" target="_blank">support@thrive19.com</a> \
                                                                            </p> \
                                                                        </div> \
                                                                    </td> \
                                                                </tr> \
                                                            </tbody> \
                                                        </table> \
                                                    </td> \
                                                </tr> \
                                            </tbody> \
                                        </table> \
                                    </td> \
                                </tr> \
                                <tr> \
                                    <td align="center" valign="top"> \
                                        <table border="0" cellpadding="10" cellspacing="0" width="600" \
                                            style="background-color:#fafafa;border-top:1px solid #dddddd"> \
                                            <tbody> \
                                                <tr> \
                                                    <td valign="top"> \
                                                        <table border="0" cellpadding="10" cellspacing="0" width="100%"> \
                                                            <tbody> \
                                                                <tr> \
                                                                    <td valign="top" width="370" style="font-size:12px"><br> \
                                                                        <div \
                                                                            style="color:#707070;font-family:Arial;font-size:12px;line-height:125%;text-align:center"> \
                                                                            <em>&copy; <span>2019</span>. <a href="https://thrive19.com/" style="color:#0065b3; text-decoration: none;">Thrive19 - Let Your Self Grow</a>. All rights reserved.</em> <br> \
                                                                            <br> \
                                                                            <strong>Our mailing address is:</strong> <br> \
                                                                            <div><a href="https://thrive19.com/" style="color:#0065b3; text-decoration: none; font-weight: bold;">THRIVE19</a> \
                                                                                <div> \
                                                                                    <div>PO Box 1611</div> \
                                                                                    <div>Bondi Junction</div> \
                                                                                    <span>Sydney</span>, <span>Nsw</span> \
                                                                                    <span>1355</span> \
                                                                                    <div>Australia</div> \
                                                                                </div> \
                                                                            </div> \
                                                                        </div> \
                                                                    </td> \
                                                                </tr> \
                                                            </tbody> \
                                                        </table> \
                                                    </td> \
                                                </tr> \
                                            </tbody> \
                                        </table> \
                                    </td> \
                                </tr> \
                            </tbody> \
                        </table> \
                    </td> \
                </tr> \
            </tbody> \
        </table> \
    </center>';

    // body_html += '<video \
    //     poster="https://www.formget.com/wp-content/uploads/2015/09/video-in-email-image.png" width="100%" height="50%" controls="controls"> \
    //     <source src="https://www.formget.com/wp-content/uploads/2015/09/MailGet-Explainer-Video.mp4" type="video/mp4" /> \
    //     <a href="https://www.youtube.com/watch?v=QpeQx8bE598"> \
    //         <img src="https://www.formget.com/wp-content/uploads/2015/09/video-in-email-image.png" width="100%" height="50%" alt="image instead of video" /> \
    //     </a> \
    // </video>';

    return await body_html;

}