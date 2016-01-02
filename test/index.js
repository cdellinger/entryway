var assert = require('assert');
var should = require('should');

var UserSchema = require('../lib/index');

describe('Core Tests', function() {
	this.timeout(5000);

	before(function(){
	});

	describe('Instantiate user with provider', function () {
		it('should instantiate successfully', function (done) {
			var mockProvider = {};
			var errorFound = false;
			try{
				var user = new UserSchema(mockProvider);
			}
			catch(e){
					if (e.message === 'You must provide a provider.'){
					errorFound = true;
				}
			}
			finally{
				errorFound.should.equal(false);
				done();
			}			
		});
	});

	describe('Instantiate user without provider', function () {
		it('should fail to instantiate', function (done) {
			var errorFound = false;
			try{
				var user = new UserSchema();
			}
			catch(e){
				if (e.message === 'You must provide a provider.'){
					errorFound = true;
				}
			}
			finally{
				errorFound.should.equal(true);
				done();
			}			
		});
	});

});






