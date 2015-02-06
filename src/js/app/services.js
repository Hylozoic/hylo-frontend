var angularModule = angular.module('hyloServices', ['ngResource']).

factory('CurrentUser', ['$resource',
  function($resource) {
    return $resource('/current_user', {});
  }]).

factory('OldUser', ['$resource',
  function($resource) {
    return $resource('/users/:id',
      {
        id: "@id"
      });
  }]).

factory("Post", ["$resource",
  function($resource) {
    return $resource("/posts/:listController:id/:postController:userId",
        {
          id: "@id",
          listController: "@listController",
          postController: "@postController"
        },
        {
          vote: {
            method: "POST",
            params: {
              postController: "vote"
            }
          },
          getComments: {
            method: "GET",
            isArray: true,
            params: {
              postController: "comments"
            }
          },
          follow: {
            method: "POST",
            params: {
              postController: "follow"
            }
          },
          unfollow: {
            method: "POST",
            params: {
              postController: "unfollow"
            }
          },
          markFulfilled: {
            method: "POST",
            params: {
              postController: "markfulfilled"
            }
          }
        })
}]).

factory("Seed", ["$resource",
  function($resource) {
    return $resource("/noo/seed/:id/:action", {
      id: '@id'
    }, {
      comment: {
        method: "POST",
        params: {
          action: "comment"
        }
      },
      addFollowers: {
        method: 'POST',
        params: {
          action: 'followers'
        }
      }
    })
  }]);

require('./services/user')(angularModule);
require('./services/community')(angularModule);
require('./services/bodyClass').service(angularModule);
require('./services/popupDone');