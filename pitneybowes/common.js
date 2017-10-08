var request = require('request');

function getAccessCode(callback) {
    var outhtoken = new Buffer(`${process.env.PITNEYBOWES_API_KEY}:${process.env.PITNEYBOWES_API_SECRET}`).toString('base64');
    console.log(outhtoken);
    var options = {
        url: 'https://api.pitneybowes.com/oauth/token',
        headers: {
            Authorization: 'Basic ' + outhtoken,
            'Content-Type': "application/x-www-form-urlencoded"
        }
    };
    request.post(options, function (error, response, body) {
        var accesstoken = JSON.parse(body).access_token;
        callback(accesstoken);
    }).form({ grant_type: 'client_credentials' });
};
exports.getAccessCode = getAccessCode;