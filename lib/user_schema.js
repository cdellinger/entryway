/*jslint node: true */
"use strict";

var bcryptjs = require('bcryptjs');

var User = function(provider){

	if (provider === undefined) throw new Error('You must provide a provider.');
 	this.provider = provider;
	this.id = '';
	this.userHandle = '';
	this.fullName = '';
	this.email = '';
	this.location = '';
	this.tenant = '';
	this.avatar = '';
	this.bio = '';
	this.strategies = [];
};


//public methods
User.prototype.addLocalStrategy = function(userName, password, cb){
	var _this = this;

	this.provider.validateAddingNewStrategy('LOCAL', userName, this, function(err, results){
		if (err) return cb(err, null);
		var salt = bcryptjs.genSaltSync(10);
		var hash = bcryptjs.hashSync(password, salt);
		_this.strategies.push({id: userName, type: 'LOCAL', token: hash});
		return cb(null, true);
	});
};

User.prototype.addEvernoteStrategy = function(userHandle, accessToken, cb){
	var _this = this;
	this.provider.validateAddingNewStrategy('EVERNOTE', userHandle, this, function(err, results){
		if (err) return cb(err, null);
		_this.strategies.push({id: userHandle, type: 'EVERNOTE', token: accessToken});
		return cb(null, true);
	});
};

User.prototype.addPocketStrategy = function(userHandle, accessToken, cb){
	var _this = this;
	this.provider.validateAddingNewStrategy('POCKET', userHandle, this, function(err, results){
		if (err) return cb(err, null);
		_this.strategies.push({id: userHandle, type: 'POCKET', token: accessToken});
		return cb(null, true);
	});
};

User.prototype.addTwitterStrategy = function(userHandle, accessToken, tokenSecret, cb){
	var _this = this;
	this.provider.validateAddingNewStrategy('TWITTER', userHandle, this, function(err, results){
		if (err) return cb(err, null);
		_this.strategies.push({id: userHandle, type: 'TWITTER', token: accessToken, tokenSecret: tokenSecret});
		return cb(null, true);
	});
};

User.prototype.getById = function(id, cb){
	this.provider.getById(id, this, cb);
};

User.prototype.getByStrategy = function(strategyType, strategyId, tenant, cb){
	this.provider.getByStrategy(strategyType, strategyId, tenant, this, cb);
};

User.prototype.init = function(){
	this.id = '';
	this.userHandleTenant = '';
	this.fullName = '';
	this.location = '';
	this.email = '';
	this.tenant = '';
	this.avatar = '';
	this.bio = '';
	this.strategies = [];		
};


User.prototype.loginViaEvernote = function(userHandle, accessToken, tenant, cb){
	this.provider.strategyLogin(userHandle, 'EVERNOTE', accessToken, tenant, this, cb);
};

User.prototype.loginViaPassword = function(userHandle, password, tenant, cb){
	this.provider.passwordLogin(userHandle, password, tenant, this, cb);
};

User.prototype.loginViaPocket = function(userHandle, accessToken, tenant, cb){
	this.provider.strategyLogin(userHandle, 'POCKET', accessToken, tenant, this, cb);
};

User.prototype.loginViaTwitter = function(userHandle, accessToken, tenant, cb){
	this.provider.strategyLogin(userHandle, 'TWITTER', accessToken, tenant, this, cb);
};

User.prototype.remove = function(cb){
	this.provider.remove(this, cb);
};

User.prototype.save = function(cb){
	var objectToSave = JSON.parse(JSON.stringify(this));
	var self = this;

	if (this.email === '') objectToSave.email = undefined;
	if (this.tenant === '') objectToSave.tenant = undefined;
	if (this.fullName === '') objectToSave.fullName = undefined;
	if (this.location === '') objectToSave.location = undefined;
	if (this.avatar === '') objectToSave.avatar = undefined;
	if (this.bio === '') objectToSave.bio = undefined;
	objectToSave.provider = undefined;

	if (this.id === ''){
		this.provider.create(objectToSave, function(err, data){
			if (err) return cb(err, null);
			repopulateDataFromSavedObject(self, objectToSave, data, cb);
		});
	}
	else{
		this.provider.update(objectToSave, function(err, data){
			if (err) return cb(err, null);
			repopulateDataFromSavedObject(self, objectToSave, data, cb);
		});
	}
};

function repopulateDataFromSavedObject(self, objectToSave, data, cb){
	for (var s in objectToSave){
		if (objectToSave[s] !== undefined) self[s] = objectToSave[s];
	}				
	return cb(null, data);
}

module.exports = User;