var util = require("util");
var Promise = require("bluebird");

var readlineSync = require('readline-sync');

var inputCaptcha = function (captchaInfo) {
    var message = util.format("Input captcha %s:", captchaInfo.captcha_img);

    var captcha = readlineSync.question(message);

    return Promise.resolve(captcha);
};

module.exports = inputCaptcha;