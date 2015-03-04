var angularModule = angular.module('hylo.features', []);

require('./menu');
require('./mentions/userMentions')(angularModule);
