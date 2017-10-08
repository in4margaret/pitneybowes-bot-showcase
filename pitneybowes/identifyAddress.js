var request = require('request');
const getAccessCode = require('./common.js').getAccessCode;

function identifyAddress(addressLine1, city, country, postalCode, callback) {
    getAccessCode((bearerToken) => {
        var addressApiUrl = 'https://api.pitneybowes.com/identify/identifyaddress/v1/rest/validatemailingaddress/results.json';
        var options = {
            url: addressApiUrl,
            headers: {
                Authorization: 'Bearer ' + bearerToken,
                'Content-Type': "application/json",
                'Host': 'api.pitneybowes.com'
            }
        };
        request.post(options, (error, response, body) => {
            callback(body.Output[0].BlockAddress, body.Output[0].Status, body.Output[0]["Status.Description"]);
        }).json({
            "options": {
                "OutputCasing": "M"
            },
            "Input": {
                "Row": [
                    {
                        "AddressLine1": addressLine1,
                        "AddressLine2": "",
                        "City": city,
                        "Country": country,
                        "StateProvince": "",
                        "PostalCode": postalCode,
                        "FirmName": ""
                    }
                ]
            }
        });

    });

};
exports.identifyAddress = identifyAddress;
