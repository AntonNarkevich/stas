var Promise = require("bluebird");
var request = require('request');
Promise.promisifyAll(request);
var apiUtil = require("./../util/index");
var status = apiUtil.responseStatus;
var settings = require("./../../settings.json");

var getFriends = function (userId) {
	var url = apiUtil.getUrl("friends.get", {user_id: userId});

	return request.getAsync({
		url: url,
		json: true,
		timeout: settings.requestTimeout
	}).spread(function (response, body) {
		var error = body.error;
		if (error) {
			console.log("getFriends Error. userId: %d, msg: %s, code: %d", userId, error.error_msg, error.error_code);

			switch (error.error_code) {
				case status.NO_ACCESS_RIGHTS:
				case status.USER_BLOCKED:
					return []; //Can't get info. Consider this as if user has no friends.
				default:
					throw error; //Otherwise stop processing.
			}
		}

		console.log("getFriends Success. Got friends for %d", userId);

		return body.response;
	}).delay(settings.pauseBetweenRequests);
};

module.exports = getFriends;