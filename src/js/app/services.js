angular.module('hyloServices', ['ngResource']).

factory('Community', ['$resource',
  function($resource) {
    var Community = $resource('/noo/community/:id', {
      id: '@id'
    }, {
      invite: {
        method: 'POST',
        url: '/noo/community/:id/invite'
      },
      findModerators: {
        url: '/noo/community/:id/moderators',
        isArray: true
      },
      removeModerator: {
        url: '/noo/community/:id/moderator/:user_id',
        method: 'DELETE'
      }
    });

    // let's make things a bit more OO around here
    _.extend(Community.prototype, {
      findModerators: function(success, error) {
        return Community.findModerators({id: this.id}, success, error);
      },
      removeModerator: function(params, success, error) {
        return Community.removeModerator(_.extend({id: this.id}, params), success, error);
      }
    });

    return Community;
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
