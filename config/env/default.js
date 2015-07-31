'use strict';

module.exports = {
	app: {
		title: 'Its Carnival Time Again',
		description: '',
		keywords: '',
		googleAnalyticsTrackingID: process.env.GOOGLE_ANALYTICS_TRACKING_ID || 'GOOGLE_ANALYTICS_TRACKING_ID'
	},
	port: process.env.PORT || 3000,
	templateEngine: 'swig',
	sessionSecret: 'itscarnivalagain',
	sessionCollection: 'sessions',
	logo: 'modules/core/img/brand/logo.png',
	favicon: 'modules/core/img/brand/favicon.ico'
};
