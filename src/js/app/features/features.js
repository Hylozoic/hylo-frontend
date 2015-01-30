var angularModule = angular.module('hylo.features', []);

require('./community/createCommunity');
require('./menu');
require('./mentions/userMentions')(angularModule);
