;(function() {

    angular
      .module('chat')
      .controller('SignupCtrl', SignupCtrl);

    SignupCtrl.$inject = ['$scope', '$http', '$location', 'LocalStorage', 'QueryService', '$auth', 'toastr'];


    function SignupCtrl($scope, $http, $location, LocalStorage, QueryService, $auth, toastr) {

      $scope.signup = function() {
        $auth.signup($scope.user)
          .then(function(response) {
            $location.path('/verify-email');
            toastr.info('You have successfully created a new account.   Please check your email.');
          })
          .catch(function(response) {
            toastr.error(response.data.message);
          });
      };



      ////////////  function definitions


      /**
       * Load some data
       * @return {Object} Returned object
       */
      // QueryService.query('GET', 'posts', {}, {})
      //   .then(function(ovocie) {
      //     self.ovocie = ovocie.data;
      //   });
    }
  })();
