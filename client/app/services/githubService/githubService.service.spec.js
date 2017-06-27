'use strict';

describe('Service: githubService', function () {

  // load the service's module
  beforeEach(module('nogginasiaJananApp.githubService'));

  // instantiate service
  var githubService;
  beforeEach(inject(function (_githubService_) {
    githubService = _githubService_;
  }));

  it('should do something', function () {
    expect(!!githubService).toBe(true);
  });

});
