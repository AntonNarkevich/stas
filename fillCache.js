var _ = require("lodash");
var Promise = require("bluebird");
var api = require('./api');
var settings = require("./settings.json");

Promise.bind({myId: settings.myId})//this becomes {..}, we're going to store data there.
	.then(function () {
		return api.getFriends(this.myId);
	})
	.then(function (myFriends) {
		this.myFriends = myFriends;
		return myFriends;
	})
	//.map(api.getFriends, {concurrency: 3})
	.then(function (friendsOfFriends) {
		return _([this.myId, this.myFriends, friendsOfFriends])
			.flattenDeep()
			.compact()
			.uniq()
			.value();
	})
	.map(api.getAudioCached, {concurrency: 3})
	.catch(function (err) {
		throw err;
	});