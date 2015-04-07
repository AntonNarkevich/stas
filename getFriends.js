var settings = require("./settings.json");

var request = require('request');
var q = require('q');
var util = require('util');

var get = q.denodeify(request.get);

function getFriends(userId) {
	var url = util.format("https://api.vk.com/method/friends.get?user_id=%d&access_token=%s", +userId, settings.token);

	return get({url: url, json: true}).then(function (response) {
		var error = response[1].error;
		if (error) {
			console.log("Error getting friends for %d: %s", userId, error.error_msg);

			if (error.error_code === 15) { //User is blocked.
				return [];
			}

			throw error;
		}

		console.log("Got friends for %d", userId);
		return response[1].response;
	}).delay(settings.pauseBetweenRequests);
}

module.exports = getFriends;