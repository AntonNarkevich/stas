var Datastore = require('nedb');
var db = new Datastore({filename: './storage/data/audio.json', autoload: true});

var Promise = require("bluebird");
Promise.promisifyAll(db);

var getAudio = function (userId) {
	return db.findOneAsync({userId: userId});
};

var saveAudio = function (audio) {
	return db.insertAsync(audio);
};

var removeAudio = function (userId) {
	return db.removeAsync({userId: userId}, { multi: true });
};

module.exports = {
	getAudio: getAudio,
	saveAudio: saveAudio,
	removeAudio: removeAudio
};