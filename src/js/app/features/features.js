var angularModule = angular.module('hylo.features', []);

require('./billing/billing');
require('./seeds/seeds');
require('./community/createCommunity');
require('./menu');
require('./mentions/userMentions')(angularModule);
