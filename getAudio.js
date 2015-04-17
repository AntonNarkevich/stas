var _ = require("lodash");
var Promise = require("bluebird");
var request = Promise.promisifyAll(require('request'));

var getApiUrl = require("./apiUrl");
var inputCaptcha = require("./inputCaptcha");
var audioDb = require("./audioDb");

var settings = require("./settings.json");

var AudioInfo = function (userId, tracks) {
    this.userId = userId;
    this.tracks = tracks || [];
};

var getAudioFromApi = function (userId, params) {
    var urlParams = params || {};
    urlParams.owner_id = userId;
    urlParams.access_token = settings.token;

    var url = getApiUrl("audio.get", urlParams);
    console.log("getAudio: url is %s", url);

    return request.getAsync({url: url, json: true, timeout: settings.requestTimeout}).spread(function (response, body) {
        var error = body.error;
        if (error) {
            console.log("Error in getAudio userId: %d, msg: %s, code: %d", userId, error.error_msg, error.error_code);

            var errorCode = error.error_code;
            //Captcha needed
            if (errorCode === 14) {
                console.log("Capthca is needed for %d. Creating special promise.", userId);

                return inputCaptcha(error)
                    .then(function (captcha) {
                        urlParams.captcha_sid = error.captcha_sid;
                        urlParams.captcha_key = captcha;

                        return getAudio(userId, urlParams);
                    });
            }

            //User is blocked or audio info is hidden.
            if (error && _.includes([201, 15], errorCode)) {
                return new AudioInfo(userId); //Empty audio array [].
            }

            throw error;
        }

        console.log("Got audio for %d", userId);
        return new AudioInfo(userId, _.rest(response.body.response));
    }).delay(settings.pauseBetweenRequests);
};

var getAudio = function (userId) {
    return audioDb.getAudio(userId)
        .then(function (audio) {
            if (audio) {
                return audio;
            }

            return getAudioFromApi(userId).then(audioDb.saveAudio);
        })
};

module.exports = getAudio;
