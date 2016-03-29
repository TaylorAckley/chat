;(function() {

    angular
      .module('chat')
      .controller('VerifyEmailCtrl', VerifyEmailCtrl);

    VerifyEmailCtrl.$inject = ['$scope', '$http', '$location', 'LocalStorage', 'QueryService', '$auth', 'toastr', 'Account'];


    function VerifyEmailCtrl($scope, $http, $location, LocalStorage, QueryService, $auth, toastr, Account) {

      $scope.tokenParam = $location.search().token;

      if ($location.search().token) {
      Account.verifyEmail($scope.tokenParam)
      .then(function(response){
        $scope.token = response.data.token;
        $auth.setToken(response);
        $location.path('/');
        toastr.info('You have successfully created a new account.   Please check your email.');
      })
      .catch(function(response) {
        console.log(response);
        toastr.error('We were unable to consume your token or verify your email.' + response);
      });
    } else {
      $scope.token = "no token";
    }




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
