var directive = function() {
  return {
    restrict: 'E',
    scope: {
      community: '=',
      update: '&',
      hidePostButton: '@',
      hideWelcomePosts: '='
    },
    link: function(scope, element, attrs) {
      scope.hidePostButton = attrs.hidePostButton;
    },
    controller: function($scope, CurrentUser) {
      $scope.currentUser = CurrentUser.get();

      $scope.selectOptions = {
        sort: [
          {label: 'Recent', value: 'recent'},
          {label: 'Top', value: 'top'},
          {label: 'Suggested', value: 'suggested'}
        ],
        filter: [
          {label: 'All Posts', value: ($scope.hideWelcomePosts ? 'all' : 'all+welcome')},
          {label: 'Intentions', value: 'intention'},
          {label: 'Offers', value: 'offer'},
          {label: 'Requests', value: 'request'},
          {label: 'Chats', value: 'chat'}
        ]
      };

      $scope.selected = {
        sort: $scope.selectOptions.sort[0],
        filter: $scope.selectOptions.filter[0]
      };

      $scope.select = function(type, value) {
        $scope.selected[type] = _.find(
          $scope.selectOptions[type],
          function(x) { return x.value === value; }
        );

        $scope.update({data: $scope.selected});
      };

      $scope.update({data: $scope.selected});

    },
    templateUrl: '/ui/post/toolbar.tpl.html',
    replace: true
  };
};

module.exports = function(angularModule) {
  angularModule.directive('postsToolbar', directive);
};
