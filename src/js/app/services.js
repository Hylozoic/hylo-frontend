var angularModule = angular.module('hyloServices', ['ngResource']).

factory('CurrentUser', ['$resource',
  function($resource) {
    return $resource('/current_user', {});
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

    var Seed = $resource("/noo/seed/:id/:action", {
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
    });

    // let's make things a bit more OO around here
    _.extend(Seed.prototype, {
      update: function(params, success, error) {
        return Seed.save(_.extend({id: this.id}, params), success, error);
      },
    });

    return Seed;
  }]);

require('./services/user')(angularModule);
require('./services/community')(angularModule);
require('./services/bodyClass').service(angularModule);
require('./services/popupDone');