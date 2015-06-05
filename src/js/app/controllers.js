var angularModule = angular.module('hyloControllers', []);

require('./controllers/profile')(angularModule);
require('./controllers/profile/edit')(angularModule);
require('./controllers/profile/contributions')(angularModule);
require('./controllers/profile/thanks')(angularModule);
require('./controllers/user/settings')(angularModule);
require('./controllers/user/NotificationsCtrl')(angularModule);

require('./controllers/seeds/SeedEditCtrl')(angularModule);
require('./controllers/seeds/SeedCtrl')(angularModule);
require('./controllers/seeds/SeedListCtrl')(angularModule);
require('./controllers/seeds/CommentsCtrl')(angularModule);

require('./controllers/community/CommunityCtrl')(angularModule);
require('./controllers/community/CommunitySettingsCtrl')(angularModule);
require('./controllers/community/CommunityAboutCtrl')(angularModule);
require('./controllers/community/CommunitySeedsCtrl')(angularModule);
require('./controllers/community/CommunityMembersCtrl')(angularModule);
require('./controllers/community/CommunityInviteCtrl')(angularModule);
require('./controllers/community/NewCommunityCtrl')(angularModule);

require('./controllers/home/HomeCtrl')(angularModule);
require('./controllers/home/FollowedSeedsCtrl')(angularModule);
require('./controllers/home/AllSeedsCtrl')(angularModule);

require('./controllers/AnnouncerCtrl')(angularModule);
require('./controllers/OverlayCtrl')(angularModule);
require('./controllers/SearchCtrl')(angularModule);
require('./controllers/FulfillmentCtrl')(angularModule);
require('./controllers/user/ForgotPasswordCtrl')(angularModule);

require('./controllers/project/ProjectEditCtrl')(angularModule);

angularModule
.controller('SignupCtrl',        require('./controllers/user/SignupCtrl'))
.controller('LoginCtrl',         require('./controllers/user/LoginCtrl'))
.controller('ProjectCtrl',       require('./controllers/project/ProjectCtrl'))
.controller('ProjectPostsCtrl',  require('./controllers/project/ProjectPostsCtrl'))
.controller('ProjectInviteCtrl', require('./controllers/project/ProjectInviteCtrl'))
.controller('ProjectUsersCtrl',  require('./controllers/project/ProjectUsersCtrl'));
