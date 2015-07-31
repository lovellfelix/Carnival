'use strict';

describe('Videos E2E Tests:', function() {
	describe('Test Videos page', function() {
		it('Should not include new Videos', function() {
			browser.get('http://localhost:3000/#!/videos');
			expect(element.all(by.repeater('video in videos')).count()).toEqual(0);
		});
	});
});
