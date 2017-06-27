'use strict';

angular.module('nogginasiaJananApp')
	.constant('githubOptions', {

	GITHUB_API_URL:'https://api.github.com/',

	// https://api.github.com/users/:username
	// https://api.github.com/users/:user/repos
	// https://api.github.com/repos/:owner/:repo/contributors
	// https://api.github.com/repos/:owner/:repo/languages

});

angular.module('nogginasiaJananApp')
	.service('githubService', function ($http, githubOptions) {
	// AngularJS will instantiate a singleton by calling "new" on this function

	var githubService = {};

	githubService.getUserRepo = function(username) {

		// id, name, full_name, owner { login, avatar_url, id, gravatar_id, url, html_url, repos_url, type  } , 
		// private, html_url, description url ... https://developer.github.com/v3/repos/

		return $http({
			method: 'GET',
			url: githubOptions.GITHUB_API_URL + 'users/' + username + '/repos',
			headers : { Accept: 'application/vnd.github.v3+json' },
		}).then(function(res) {
			//success callback
			if(res.status === 200) {
				//success
				return res;
			}

			return res;
		}, function(res) {
			//error callback
			res.status = res.status || 'Request failed';
			return res;
		}).catch(function(err){
			//API level error
			console.log("error occured", err);
			return err;
		});	

	}

	githubService.getRepoContributors = function(ownerId, repoId) {

		// anon 1 to include anonymous contributions
		// anon 0 to include anonymous contributions
		return $http({
			method: 'GET',
			url: githubOptions.GITHUB_API_URL + 'repos/' + ownerId + '/' + repoId + '/contributors?anon=1',
			headers : { Accept: 'application/vnd.github.v3+json' },
		}).then(function(res) {
			//success callback
			if(res.status === 200) {
				//success
				return res;
			}

			return res;
		}, function(res) {
			//error callback
			res.status = res.status || 'Request failed';
			return res;
		}).catch(function(err){
			//API level error
			console.log("error occured", err);
			return err;
		});	
	}

	githubService.getRepoLanguages = function(ownerId, repoId) {

		// value is bytes in code
		return $http({
			method: 'GET',
			url: githubOptions.GITHUB_API_URL + 'repos/' + ownerId + '/' + repoId + '/languages',
			headers : { Accept: 'application/vnd.github.v3+json' },
		}).then(function(res) {
			//success callback
			if(res.status === 200) {
				//success
				return res;
			}

			return res;
		}, function(res) {
			//error callback
			res.status = res.status || 'Request failed';
			return res;
		}).catch(function(err){
			//API level error
			console.log("error occured", err);
			return err;
		});	

	}
	
	githubService.getRateLimit = function() {
		
		return $http({
			method: 'GET',
			url: githubOptions.GITHUB_API_URL + 'rate_limit',
			headers : { Accept: 'application/vnd.github.v3+json' },
		}).then(function(res) {
			//success callback
			if(res.status === 200) {
				//success
				return res;
			}

			return res;
		}, function(res) {
			//error callback
			res.status = res.status || 'Request failed';
			return res;
		}).catch(function(err){
			//API level error
			console.log("error occured", err);
			return err;
		});	
	}

	return githubService;

});


