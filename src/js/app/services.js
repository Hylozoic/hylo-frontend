var angularModule = angular.module('hyloServices', ['ngResource']).

factory('User', ['$resource',
  function($resource) {
    return $resource('/noo/user/:id', {
      id: '@id'
    }, {

    });
  }]).

factory('CurrentUser', ['$resource',
  function($resource) {
    return $resource('/current_user', {}, {
      savePrefs: {
        method: "POST",
        params: {prefs: true}
      }
    });
  }]).

factory('OldUser', ['$resource',
  function($resource) {
    return $resource('/users/:id',
      {
        id: "@id"
      });
  }]).

factory('Notification', ['$resource',
  function($resource) {
    return $resource('/notifications/:id',
      {
        id: "@id"
      },{
        markRead: {
          method: "POST"
        }
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
          forUser: {
            method: "GET",
            isArray: true,
            params: {
              listController: "user"
            }
          },
          vote: {
            method: "POST",
            params: {
              postController: "vote"
            }
          },
          comment: {
            method: "POST",
            params: {
              postController: "comment"
            }
          },
          getComments: {
            method: "GET",
            isArray: true,
            params: {
              postController: "comments"
            }
          },
          followers: {
            method: "GET",
            isArray: true,
            params: {
              postController: "followers"
            }
          },
          addFollower: {
            method: "POST",
            params: {
              postController: "addfollower"
            }
          },
          removeFollower: {
            method: "POST",
            params: {
              postController: "removefollower"
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
}]);

require('./services/community.js')(angularModule);