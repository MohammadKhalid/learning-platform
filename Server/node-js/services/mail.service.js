const CONFIG = require('../config/config');
const mandrill = require('mandrill-api/mandrill');

module.exports.send_message = (subject, message, recipients, extra = {}) => {
    let mandrill_client = new mandrill.Mandrill(CONFIG.MANDRILL_API_KEY);

    let mail = {
        "html": message,
        "subject": subject,
        "from_email": "support@thrive19.com",
        "from_name": extra.from_name || "Thrive19.com",
        "to": recipients,
        "headers": {
            "Reply-To": "support@thrive19.com"
        },
        "important": false,
        "track_opens": true,
        "track_clicks": true,
        "bcc_address": "manvillt.developer@gmail.com",
        
        // "attachments": [{
        //         "type": "text/plain",
        //         "name": "myfile.txt",
        //         "content": "ZXhhbXBsZSBmaWxl"
        //     }],
        // "images": [{
        //         "type": "image/png",
        //         "name": "IMAGECID",
        //         "content": "ZXhhbXBsZSBmaWxl"
        //     }]
    };

    let async = false;
  
    mandrill_client.messages.send({"message": mail, "async": async}, function(result) {
        console.log('EMAIL RESPONSE', result);
        /*
        [{
          "email": "recipient.email@example.com",
          "status": "sent",
          "reject_reason": "hard-bounce",
          "_id": "abc123abc123abc123abc123abc123"
        }]
        */
    }, function(e) {
        // Mandrill returns the error as an object with name and message keys
        console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
        // A mandrill error occurred: Unknown_Subaccount - No subaccount exists with the id 'customer-123'
    });
};