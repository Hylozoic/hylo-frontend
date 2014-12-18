var angularModule = angular.module('hyloControllers', ['hyloFilters']);


require('./controllers/comments');
require('./controllers/community_about');
require('./controllers/community_seeds');
require('./controllers/community_users');
require('./controllers/community');
require('./controllers/fulfillModal');
require('./controllers/network');
require('./controllers/onboarding');
require('./controllers/profile_settings');
require('./controllers/search');
require('./controllers/user');
require('./controllers/view_post');
require('./controllers/view_post');
require('./controllers/profile/contributions')(angularModule);
require('./controllers/profile/thanks')(angularModule);

require('./controllers/community_settings')(angularModule);
require('./controllers/profile')(angularModule);
