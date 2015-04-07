var settings = require("./settings.json");

var request = require('request');
var q = require('q');
var util = require('util');
var _ = require('lodash');

var get = q.denodeify(request.get);

function getAduio(userId) {
	var url = util.format("https://api.vk.com/method/audio.get?owner_id=%d&access_token=%s", +userId, settings.token);

	return get({url: url, json:true}).then(function (response) {
		var error = response[1].error;
		if (error) {
			console.log("Error getting audios for %d: %s", userId, error.error_msg);

			if (error.error_code === 15) { //User is blocked.
				return [];
			}

			throw error;
		}

		console.log("Got audio for %d", userId);

		return _.rest(response[1].response, 1);
	}).delay(settings.pauseBetweenRequests)
}

module.exports = getAduio;
