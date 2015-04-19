var storage = require("../../storage");
var getAudio = require("./getAudio");

var getAudioCached = function (userId) {
	return storage.getAudio(userId)
		.then(function (audio) {
			if (audio) {
				console.log("getAudioCached: Got cached audio for %d", userId);
				return audio;
			}

			console.log("getAudioCached: Getting audio for %d from the API.", userId);
			return getAudio(userId).then(storage.saveAudio);
		});
};

module.exports = getAudioCached;