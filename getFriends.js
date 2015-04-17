var util = require('util');

var Promise = require("bluebird");
var request = Promise.promisifyAll(require('request'));
var _ = require("lodash");

var settings = require("./settings.json");

var getFriends = function (userId) {
    //TODO: {} => url params
    var url = util.format("https://api.vk.com/method/friends.get?user_id=%d", +userId);

    return request.getAsync({url: url, json: true, timeout: settings.requestTimeout}).spread(function (response, body) {
        var error = body.error;

        if (error) {
            console.log("Error in getFriends userId: %d, msg: %s, code: %d", userId, error.error_msg, error.error_code);

            if (error && _.includes([201, 15], error.error_code)) {
                return [];
            } else {
                throw error;
            }
        }

        console.log("Got friends for %d", userId);

        return body.response;

    }).delay(settings.pauseBetweenRequests);
};

module.exports = getFriends;