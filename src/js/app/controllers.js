var angularModule = angular.module('hyloControllers', []);

require('./controllers/profile')(angularModule);
require('./controllers/profile/contributions')(angularModule);
require('./controllers/profile/thanks')(angularModule);
require('./controllers/user/settings')(angularModule);
require('./controllers/user/NotificationsCtrl')(angularModule);

require('./controllers/post/PostEditCtrl')(angularModule);
require('./controllers/post/PostCtrl')(angularModule);
require('./controllers/post/PostListCtrl')(angularModule);
require('./controllers/post/CommentsCtrl')(angularModule);

require('./controllers/community/CommunityCtrl')(angularModule);
require('./controllers/community/CommunitySettingsCtrl')(angularModule);
require('./controllers/community/CommunityPostsCtrl')(angularModule);
require('./controllers/community/CommunityMembersCtrl')(angularModule);
require('./controllers/community/CommunityInviteCtrl')(angularModule);
require('./controllers/community/NewCommunityCtrl')(angularModule);

require('./controllers/home/FollowedPostsCtrl')(angularModule);
require('./controllers/home/AllPostsCtrl')(angularModule);

require('./controllers/AnnouncerCtrl')(angularModule);
require('./controllers/SearchCtrl')(angularModule);
require('./controllers/FulfillmentCtrl')(angularModule);
require('./controllers/user/ForgotPasswordCtrl')(angularModule);

require('./controllers/project/ProjectEditCtrl')(angularModule);

angularModule
.controller('NavCtrl',           require('./controllers/NavCtrl'))
.controller('CommunityEventsCtrl', require('./controllers/community/CommunityEventsCtrl'))
.controller('JoinCommunityCtrl', require('./controllers/community/JoinCommunityCtrl'))
.controller('SignupCtrl',        require('./controllers/user/SignupCtrl'))
.controller('LoginCtrl',         require('./controllers/user/LoginCtrl'))
.controller('PostCardCtrl',      require('./controllers/post/PostCardCtrl'))
.controller('WelcomePostCtrl',   require('./controllers/post/WelcomePostCtrl'))
.controller('ProjectCtrl',       require('./controllers/project/ProjectCtrl'))
.controller('ProjectPostsCtrl',  require('./controllers/project/ProjectPostsCtrl'))
.controller('ProjectInviteCtrl', require('./controllers/project/ProjectInviteCtrl'))
.controller('ProjectUsersCtrl',  require('./controllers/project/ProjectUsersCtrl'))
.controller('ProfileEditCtrl', require('./controllers/profile/ProfileEditCtrl'));
