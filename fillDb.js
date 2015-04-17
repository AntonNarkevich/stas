var _ = require("lodash");

var Promise = require("bluebird");

var getAudio = require("./getAudio");
var getFriends = require("./getFriends");

var settings = require("./settings.json");

Promise.bind({myId: settings.myId}) //this becomes {}, we're going to store data there.
    .then(function () {
        return getFriends(this.myId);
    })
    .then(function (myFriends) {
        this.myFriends = myFriends;
        return myFriends;
    })
    .then(function (friendsOfFriends) {
        return _([this.myId, this.myFriends, friendsOfFriends])
            .flattenDeep()
            .compact()
            .uniq()
            .value();
    })
    .map(getAudio, {concurrency: 3})
    .then(function (audios) {
        console.log(audios);
    });