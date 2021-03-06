/**
 *
 * AngularJS Boilerplate
 * @description           Description
 * @author                Jozef Butko // www.jozefbutko.com/resume
 * @url                   www.jozefbutko.com
 * @version               1.1.7
 * @date                  March 2015
 * @license               MIT
 *
 */
;(function() {


  /**
   * Definition of the main app module and its dependencies
   */
  angular
    .module('chat', [
      'ngResource',
      'ngMessages',
      'ngAnimate',
      'toastr',
      'ui.router',
      'satellizer',
      'ui.bootstrap',
      //'textAngular',
      'btford.socket-io'
    ])
    .config(config);

  // safe dependency injection
  // this prevents minification issues
  config.$inject = ['$httpProvider', '$compileProvider', '$stateProvider', '$urlRouterProvider', '$authProvider', '$locationProvider'];

  function config($httpProvider, $compileProvider, $stateProvider, $urlRouterProvider, $authProvider) {

    $stateProvider
      .state('home', {
        url: '/',
        controller: 'HomeCtrl',
        templateUrl: 'views/home.html',
        resolve: {
          loginRequired: loginRequired
        }
      })
      .state('login', {
        url: '/login',
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl',
        resolve: {
          skipIfLoggedIn: skipIfLoggedIn
        }
      })
      .state('signup', {
        url: '/signup',
        templateUrl: 'views/signup.html',
        controller: 'SignupCtrl',
        resolve: {
          skipIfLoggedIn: skipIfLoggedIn
        }
      })
      .state('verify-email', {
        url: '/verify-email',
        templateUrl: 'views/verifyemail.html',
        controller: 'VerifyEmailCtrl',
      })
      .state('logout', {
        url: '/logout',
        template: null,
        controller: 'LogoutCtrl'
      })
      .state('profile', {
        url: '/profile',
        templateUrl: 'views/profile.html',
        controller: 'ProfileCtrl',
        resolve: {
          loginRequired: loginRequired
        }
      });

      //$locationProvider.html5Mode(true);  // Need to inject locationProvider if enabled

    $urlRouterProvider.otherwise('/');

    function skipIfLoggedIn($q, $auth) {
      var deferred = $q.defer();
      if ($auth.isAuthenticated()) {
        deferred.reject();
      } else {
        deferred.resolve();
      }
      return deferred.promise;
    }

function loginRequired($q, $location, $auth) {
    var deferred = $q.defer();
    if ($auth.isAuthenticated()) {
      deferred.resolve();
    } else {
      $location.path('/login');
    }
    return deferred.promise;
  }

// auth providers
    $authProvider.facebook({
      clientId: '657854390977827'
    });


  }


  // the below is deprecated, but if reactivated then inject into config: $httpProvider.interceptors.push('authInterceptor');
  angular
    .module('chat')
    .factory('authInterceptor', authInterceptor);

  authInterceptor.$inject = ['$rootScope', '$q', 'LocalStorage', '$location'];

  function authInterceptor($rootScope, $q, LocalStorage, $location) {

    return {

      // intercept every request
      request: function(config) {
        config.headers = config.headers || {};
                    if (localStorage.get('token')) {
                        config.headers.Authorization = localStorage.get('token');
                    }
        return config;
      },

      // Catch 404 errors
      responseError: function(response) {
        if (response.status === 404) {
          $location.path('/');
          return $q.reject(response);
        } else {
          return $q.reject(response);
        }
      }
    };
  }


  /**
   * Run block
   */
  /*angular
    .module('chat')
    .run(run);

  run.$inject = ['$rootScope', '$location'];

  function run($rootScope, $location) {

    // put here everything that you need to run on page load
  }*/

})();
