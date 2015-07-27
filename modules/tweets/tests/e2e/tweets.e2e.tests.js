'use strict';

describe('Tweets E2E Tests:', function() {
	describe('Test Tweets page', function() {
		it('Should not include new Tweets', function() {
			browser.get('http://localhost:3000/#!/tweets');
			expect(element.all(by.repeater('tweet in tweets')).count()).toEqual(0);
		});
	});
});
