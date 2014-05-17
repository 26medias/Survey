var _ 					= require('underscore');
var qs 					= require("querystring");

// Users
function page() {
	
}
page.prototype.init = function(Gamify, callback){
	var scope = this;
	
	this.Gamify = Gamify;
	
	// Return the methods
	var paths = {
		
		'/': {
			require:		[],
			auth:			false,
			description:	"Homepage",
			params:			{},
			status:			'dev',
			version:		1.0,
			callback:		function(params, req, res, callback) {
				
				Gamify.render("site/index.html", {
					user: 	req.user,
					title:	"Survey",
					dependencies:	['theme','MeanEngine','starter-pack']
				}, function(rendered) {
					callback(rendered);
				}, Gamify, res, req);
				
			}
		},
		'/manage': {
			require:		[],
			auth:			"passport",
			description:	"Homepage",
			params:			{},
			status:			'dev',
			version:		1.0,
			callback:		function(params, req, res, callback) {
				
				Gamify.render("account/index.html", {
					user: 	req.user,
					title:	"My account",
					dependencies:	['theme-account','MeanEngine','starter-pack']
				}, function(rendered) {
					callback(rendered);
				}, Gamify, res, req);
				
			}
		},
		'/manage/account': {
			require:		[],
			auth:			"passport",
			description:	"Homepage",
			params:			{},
			status:			'dev',
			version:		1.0,
			callback:		function(params, req, res, callback) {
				
				Gamify.render("account/account.html", {
					user: 	req.user,
					title:	"My account",
					dependencies:	['theme-account','MeanEngine','starter-pack']
				}, function(rendered) {
					callback(rendered);
				}, Gamify, res, req);
				
			}
		},
		'/manage/survey/create': {
			require:		[],
			auth:			"passport",
			description:	"Homepage",
			params:			{},
			status:			'dev',
			version:		1.0,
			callback:		function(params, req, res, callback) {
				
				Gamify.render("account/survey/create.html", {
					user: 	req.user,
					title:	"New survey",
					dependencies:	['theme-account','MeanEngine','starter-pack']
				}, function(rendered) {
					callback(rendered);
				}, Gamify, res, req);
				
			}
		},
		'/register': {
			require:		[],
			auth:			false,
			description:	"Homepage",
			params:			{},
			status:			'dev',
			version:		1.0,
			callback:		function(params, req, res, callback) {
				
				Gamify.render("account/register.html", {
					user: 	req.user,
					title:	"Sign up for free",
					dependencies:	['theme','MeanEngine','starter-pack']
				}, function(rendered) {
					callback(rendered);
				}, Gamify, res, req);
				
			}
		},
		'/account/login': {
			require:		[],
			auth:			false,
			description:	"Login page",
			params:			{},
			status:			'dev',
			version:		1.0,
			callback:		function(params, req, res, callback) {
				
				Gamify.render("account/login.html", {
					user: 	req.user,
					title:	"Login",
					dependencies:	['MeanEngine','starter-pack','theme']
				}, function(rendered) {
					callback(rendered);
				}, Gamify, res, req);
				
			}
		}
	};
	
	// Init a connection
	this.mongo	= new this.Gamify.mongo({database:Gamify.settings.db});
	this.mongo.init(function() {
		callback(paths);
	});
}
exports.page = page;