var Datastore = require('nedb');
var db = new Datastore({filename: 'data/audio.json', autoload: true});

var Promise = require("bluebird");
Promise.promisifyAll(db);

var getAudio = function (userId) {
    return db.findOneAsync({userId: userId});
};

var saveAudio = function (audio) {
    return db.insertAsync(audio);
};

var doesAudioExist = function (userId) {
    return db.findOneAsync({userId: userId})
        .then(function (audioInfo) {
            return !!audioInfo;
        });
};

module.exports = {
    getAudio: getAudio,
    saveAudio: saveAudio,
    doesAudioExist: doesAudioExist
};