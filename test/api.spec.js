var chai = require('chai');
chai.should();
var api = require("../api");
var storage = require("../storage");
var settings = require("../settings.json");

describe("VK api methods", function () {
	describe("getFriends", function () {
		it("should return array of firends", function (done) {
			api.getFriends(settings.myId)
				.then(function (friends) {
					friends.should.be.an.array;
					friends.should.not.be.empty;

					done();
				})
				.catch(done);
		})
	});

	describe("getAudio", function () {
		it("should return audio info", function (done) {
			api.getAudio(settings.myId)
				.then(function (audioInfo) {
					audioInfo.userId.should.be.equal(settings.myId);
					audioInfo.tracks.should.be.an.array;
					audioInfo.tracks.should.not.be.empty;
					audioInfo.tracks[0].artist.should.be.defined;
					audioInfo.tracks[0].title.should.be.defined;

					done();
				})
				.catch(done);
		});
	});

	describe("getAudioCached", function () {
		it("should not throw errors", function (done) {
			api.getAudioCached(settings.myId)
				.then(function () {
					done();
				});
		});

		it("should add audioInfo to storage", function (done) {
			storage.removeAudio(settings.myId)
				.then(function () {
					return api.getAudioCached(settings.myId);
				})
				.then(function () {
					return storage.getAudio(settings.myId);
				})
				.then(function (audio) {
					audio.userId.should.be.equal(settings.myId);

					done()
				})
				.catch(done);
		});
	});
});