var getAudio = require("./getAudio");
var getFriends = require("./getFriends");
var _ = require("lodash");
var q = require("q");
var fs = require("fs");

var myId = 20528987;
var authorRegex = /Moby/;

getFriends(myId)
	.then(function (friends) {
//		var friendsArray = [myId, friends];
//		var promiseChain = q();
//
//		friends.forEach(function (friendId) {
//			promiseChain = promiseChain.then(function () {
//				return getFriends(friendId).then(function (friends) {
//					friendsArray.push(friends);
//				})
//			});
//		});
//
//		return promiseChain.thenResolve(friendsArray);

		//in bluebird it should be
		// return friends.map(... {concurrency: 3});
	})
	.then(function (friendsArrays) {
		return _(friendsArrays)
			.flatten()
			.uniq()
			.value();
	})
	.then(function (friends) {
//		var promiseChain = q();
//		var audioArrays = [];
//
//		friends.forEach(function (friendId) {
//			promiseChain = promiseChain.then(function () {
//				return getAudio(friendId).then(function (audios) {
//					audioArrays.push(audios);
//				})
//			});
//		});
//
//		return promiseChain.thenResolve(audioArrays);

		//in bluebird map again.
	})
//q.when(require("./dump.json"))
	.then(function (audioArrays) {
		_(audioArrays)
			.filter('length')
			.map(function (audioArray) {
				return {
					id: audioArray[0].owner_id,
					trackCount: audioArray.filter(function (track) {
						return authorRegex.test(track.artist);
					}).length
				};
			})
			.sortByOrder(['trackCount'], false)
			.take(5)
			.forEach(function (fan) {
				console.log("User %d has %d tracks", fan.id, fan.trackCount);
			})
			.value();
	}).catch(function (err) {
		console.log(err);
	});
