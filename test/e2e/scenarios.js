'use strict';

/* http://docs.angularjs.org/guide/dev_guide.e2e-testing */
describe('Seed App', function () {

  describe('Page one', function () {

    beforeEach(function () {
      browser().navigateTo('app/index.html#/one');
    });

    it('#main should have 2 p tags', function () {
      expect(repeater('#main p').count()).toBe(2);
    });
  });
});
