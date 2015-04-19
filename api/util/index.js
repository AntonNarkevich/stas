var qs = require("qs");

var getUrl = function (apiMethod, params) {
	var query = qs.stringify(params);

	return "https://api.vk.com/method/" + apiMethod + "?" + query;
};

var responseStatus = {
	CAPTCHA_NEEDED: 14,
	NO_ACCESS_RIGHTS: 201,
	USER_BLOCKED: 15
};

module.exports = {
	getUrl: getUrl,
	responseStatus: responseStatus
};