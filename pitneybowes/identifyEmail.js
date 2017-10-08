var request = require('request');
const getAccessCode = require('./common.js').getAccessCode;

function identifyEmail(email, callback) {
    getAccessCode((bearerToken) => {
        var emailUrl = 'https://api.pitneybowes.com/identify/identifyemail/v1/rest/validateemailaddress/results.json';
        var options = {
            url: emailUrl,
            headers: {
                Authorization: 'Bearer ' + bearerToken,
                'Content-Type': "application/json",
                'Host': 'api.pitneybowes.com'
            }
        };
        request.post(options, (error, response, body) => {
            callback(body.Output[0].FINDING, body.Output[0].ERROR_RESPONSE);
        }).json({
            "Input": {
                "Row": [
                    {
                        "atc": "a",
                        "bogus": "true",
                        "complain": "true",
                        "disposable": "true",
                        "emailAddress": email,
                        "emps": "true",
                        "fccwireless": "true",
                        "language": "true",
                        "role": "true",
                        "rtc": "true",
                        "rtc_timeout": "1200"
                    }
                ]
            }
        });

    });
};
exports.identifyEmail = identifyEmail;
