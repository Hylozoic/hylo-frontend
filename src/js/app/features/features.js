var angularModule = angular.module('hylo.features', []);

require('./seeds/seeds');
require('./community/createCommunity');
require('./menu');
require('./mentions/userMentions')(angularModule);
