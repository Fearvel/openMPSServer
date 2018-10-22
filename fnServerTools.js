var request = require('request');

module.exports = {

    CreateSimpleAnswer: function (b) {
        var s = "{\"Result\": ";
        if (b) {
            s += "\"True\"";
        } else {
            s += "\"False\"";
        }
        s += "}";
        return s;
    },
    post : function (url, json, callback) {

        request.post(
            url,
            json,
            function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    callback(body);
                } else {
                    callback( null);
                }
            }
        );


    }
}

