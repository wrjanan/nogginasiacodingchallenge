'use strict';

(function() {

	class MainController {

		constructor($http, githubService, $scope) {
			this.$http = $http;
			this.awesomeThings = [];
			this.githubService = githubService;
			this.githubUserInput = '';
			this.rateLimit = {};
			this.userRepos = {};
			this.userRepoShow = false;
			this.userGlobalLanguages = {};
			this.userGlobalLanguagesArray = [];
			this.scope = $scope;

			this.errorMessage = '';
		}

		$onInit() {
			this.$http.get('/api/things').then(response => {
				this.awesomeThings = response.data;
			});

			this.githubService.getRateLimit().then(response => {

				var alertMessageClass = "";

				if(response.data.rate.remaining > response.data.rate.limit / 2) {
					alertMessageClass = "alert-success";
				} else if(response.data.rate.remaining === 0) {
					alertMessageClass = "alert-danger";
				} else {
					alertMessageClass = "alert-warning";
				}

				angular.element( document.querySelector( '#alertMessage' ) ).addClass(alertMessageClass);

				this.rateLimit = response.data;
			});
		}

		addThing() {
			if (this.newThing) {
				this.$http.post('/api/things', { name: this.newThing });
				this.newThing = '';
			}
		}

		deleteThing(thing) {
			this.$http.delete('/api/things/' + thing._id);
		}

		getUserRepo() {
			this.errorMessage = "";

			this.githubService.getUserRepo(this.githubUserInput)
				.then(res => {

				if(res.status === 200) {
					//success
					this.userRepos = res.data;
					this.userRepos.forEach(k => {
						k.isCollapsed = true;
					});
					this.userRepoShow = true;

					// auto populate individual repos with contributors and languages used
					return this.userRepos.forEach(function repoParser(repo, index, arr) {

						// repo contributors function
						this.getRepoContributors(repo.owner.login, repo.name, index) 
							.then(res => {
							if(res != null) {
								this.userRepos[index].contributorList = res;
							}
						});

						// repo languages function
						this.getRepoLanguages(repo.owner.login, repo.name, index) 
							.then(res => {
							if(res != null) {
								var languageList = Object.keys(res);
								var returnLanguageList = [];

								languageList.forEach((language, index, array) => {
									var languageObj = {"name" : language, "bytes": res[language]}
									if(languageObj.name && languageObj.bytes) {
										this.maintainGlobalLanguage(languageObj);
									}

									returnLanguageList.push(languageObj);
								});
								this.updateGlobalLanguages();
								this.userRepos[index].languageList = returnLanguageList;

							}
						});
					}, this);
				}

				//failure
				this.errorMessage = "Error: " + res.data.message;
			});
		}

		getRepoContributors(ownerId, repoId, index) {
			return this.githubService.getRepoContributors(ownerId, repoId)
				.then(res => {

				if(res.status === 200) {
					//success
					return res.data;
				}
				return null;
			});
		}

		getRepoLanguages(ownerId, repoId, index) {
			return this.githubService.getRepoLanguages(ownerId, repoId)
				.then(res => {

				if(res.status === 200) {
					//success
					return res.data;
				}
				return null;
			});
		}

		maintainGlobalLanguage(languageObj) {
			if(!this.userGlobalLanguages[languageObj.name]) {
				this.userGlobalLanguages[languageObj.name] = languageObj.bytes;
			} else {
				this.userGlobalLanguages[languageObj.name] += languageObj.bytes;
			}
		}



		updateGlobalLanguages() {
			var tempLanguages = Object.keys(this.userGlobalLanguages);
			this.userGlobalLanguagesArray = [];

			tempLanguages.forEach(language => {
				this.userGlobalLanguagesArray.push({"name" :language, "bytes" : this.userGlobalLanguages[language]} );
			});
		}

		tableCollapse(selection) {
			var collapseAll;
			switch(selection) {
				case 1:
					collapseAll = true;
					break;
				case 2:
					collapseAll = false
					break;
			}			

			this.userRepos.forEach(k => {
				k.isCollapsed = collapseAll;
			});
		}
	}


	angular.module('nogginasiaJananApp')
		.component('main', {
		templateUrl: 'app/main/main.html',
		controller: MainController
	});

}



)();

