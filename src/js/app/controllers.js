var angularModule = angular.module('hyloControllers', ['hyloFilters']);

require('./controllers/comments');
require('./controllers/fulfillModal');
require('./controllers/network');
require('./controllers/search');

require('./controllers/profile')(angularModule);
require('./controllers/profile/edit')(angularModule);
require('./controllers/profile/seeds')(angularModule);
require('./controllers/profile/contributions')(angularModule);
require('./controllers/profile/thanks')(angularModule);
require('./controllers/user/settings')(angularModule);

require('./controllers/SeedEditCtrl')(angularModule);
require('./controllers/seeds/SeedCtrl')(angularModule);

require('./controllers/community/CommunityCtrl')(angularModule);
require('./controllers/community/CommunitySettingsCtrl')(angularModule);
require('./controllers/community/CommunityAboutCtrl')(angularModule);
require('./controllers/community/CommunitySeedsCtrl')(angularModule);
require('./controllers/community/CommunityMembersCtrl')(angularModule);

require('./controllers/AnnouncerCtrl')(angularModule);
require('./controllers/OverlayCtrl')(angularModule);
