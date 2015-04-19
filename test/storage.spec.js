var chai = require('chai');
var should = chai.should();
var api = require("../api");
var storage = require("../storage");
var settings = require("../settings.json");

describe("Storage", function () {
	describe("getAudio method", function () {
		it("should return null on non-existend audio", function (done) {
			storage.getAudio("not exists")
				.then(function (audio) {
					should.not.exist(audio);

					done();
				})
				.catch(done);
		});

		it("should return audio after it's been inserted", function (done) {
			storage.saveAudio({userId: 'testId'})
				.then(storage.getAudio('testId'))
				.then(function (audio) {
					audio.userId.should.be.equal('testId');

					done();
				})
				.catch(done);
		});
	});

	describe("removeAudio method", function () {
		it('should remove saved audio', function (done) {
			storage.saveAudio({userId: 'testId'})
				.then(function () {
					return storage.removeAudio('testId');
				})
				.then(function () {
					return storage.getAudio('testId');
				})
				.then(function (audio) {
					should.not.exist(audio);

					done();
				})
				.catch(done);
		});
	})
});