var util = require("util");
var Promise = require("bluebird");
var readlineSync = require('readline-sync'); //Sync method to lock console.

//TODO: should use audomatic captcha recognition.
var input = function (captchaUrl) {
	var message = util.format("Please, input captcha %s:", captchaUrl);
	var captcha = readlineSync.question(message);

	return Promise.resolve(captcha);
};

module.exports = {
	input: input
};