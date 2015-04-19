var _ = require("lodash");
var Promise = require("bluebird");
var api = require("./api");
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
	.then(function (audioInfos) {
		return _(audioInfos)
			.filter(function (audioInfo) {
				return !!audioInfo.tracks.length;
			})
			.map(function (audioInfo) {
				return {
					userId: audioInfo.userId,
					trackCount: audioInfo.tracks.filter(function (track) {
						return _.contains(track.artist, settings.author);
					}).length
				};
			})
			.sortByOrder(['trackCount'], false)
			.take(5)
			.value();
	})
	.each(function (fan) {
		console.log("User %d has %d tracks", fan.userId, fan.trackCount);
	})
	.catch(function (err) {
		throw err;
	});
