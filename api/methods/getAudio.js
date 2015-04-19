var _ = require("lodash");
var Promise = require("bluebird");
var request = require('request');
Promise.promisifyAll(request);
var apiUtil = require("./../util/index");
var status = apiUtil.responseStatus;
var settings = require("./../../settings.json");
var captcha = require("./../../captcha");

//If no tracks passed sets empty array.
var AudioInfo = function (userId, tracks) {
	this.userId = userId;
	this.tracks = tracks || [];
};

//Because of CAPTHAs this method is recursive. Pass only userId from outside.
var getAudio = function (userId, params) {
	var urlParams = params || {};
	urlParams.owner_id = userId;
	urlParams.access_token = settings.token;

	var url = apiUtil.getUrl("audio.get", urlParams);

	return request.getAsync({
		url: url,
		json: true,
		timeout: settings.requestTimeout
	}).spread(function (response, body) {

		var error = body.error;
		if (error) {
			console.log("getAudio Error. userId: %d, msg: %s, code: %d", userId, error.error_msg, error.error_code);

			switch (error.error_code) {
				case status.NO_ACCESS_RIGHTS:
				case status.USER_BLOCKED:
					return new AudioInfo(userId); //Cannot get data. Return empty audio array [].
				case status.CAPTCHA_NEEDED:
					console.log("Capthca is needed for %d. Creating special promise.", userId);

					return captcha.input(error.captcha_img)
						.then(function (captchaKey) {
							urlParams.captcha_sid = error.captcha_sid;
							urlParams.captcha_key = captchaKey;

							//Add captcha to urlParams and try to call api again. (recursion)
							return getAudio(userId, urlParams);
						});
				default:
					throw error; //Otherwise stop processing.
			}
		}

		console.log("getAudio Success. Got audio for %d", userId);

		return new AudioInfo(userId, _.rest(response.body.response)); //Data comes in strange format.
	}).delay(settings.pauseBetweenRequests);
};

module.exports = getAudio;