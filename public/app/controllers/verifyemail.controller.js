;(function() {

    angular
      .module('chat')
      .controller('VerifyEmail', VerifyEmail);

    VerifyEmail.$inject = ['$scope', '$http', '$location', 'LocalStorage', 'QueryService', '$auth', 'toastr'];


    function VerifyEmail($scope, $http, $location, LocalStorage, QueryService, $auth, toastr) {



      Account.VerifyEmail($location.search().token)
      .then(function(response){
        console.log(response.data);
        $scope.token = response.data.token;
        $auth.setToken(response);
        $location.path('/');
        toastr.info('You have successfully created a new account.   Please check your email.');
      })
      .error(function() {
        console.log('Error');
      });




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
