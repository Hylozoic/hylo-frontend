var angularModule = angular.module('hyloServices', ['ngResource']).

factory('Overlay', function($rootScope) {
  // just need a state object here
  // in order to account for the fact that sometimes
  // when we want to set up the overlay, OverlayCtrl
  // has not yet been initialized
  var storedData;

  return {
    show: function(data) {
      storedData = data;
      $rootScope.$emit('overlay:load', data);
    },
    resetData: function() {
      storedData = null;
    },
    storedData: function() {
      return storedData;
    }
  };
}).

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

// resources
require('./services/user')(angularModule);
require('./services/community')(angularModule);
require('./services/Activity')(angularModule);
require('./services/Comment')(angularModule);

// other services
require('./services/bodyClass').service(angularModule);
require('./services/onboarding')(angularModule);
require('./services/clickthroughTracker')(angularModule);
require('./services/history')(angularModule);
require('./services/popupDone');