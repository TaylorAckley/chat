;(function() {

    angular
      .module('chat')
      .controller('HomeCtrl', HomeCtrl);

    HomeCtrl.$inject = ['$scope', '$http', '$location', '$stateParams', 'LocalStorage', 'QueryService', 'socket', 'Account', 'Messages'];


    function HomeCtrl($scope, $http, $location, $stateParams, LocalStorage, QueryService, socket, Account, Messages) {

      incrementRoom = function(r, u) {
        return _($scope.rooms)
        .filter(function(prop) {
          return prop.name === r;
        })
        .map(function(prop) {
          prop.count +=1;
          prop.users.push(u);
          return prop;
        })
        .value();
      };

      decrementRoom = function(r) {
        return _($scope.rooms)
        .filter(function(prop) {
          return prop.name === r;
        })
        .map(function(prop) {
          prop.count +=1;
          prop.users.push(u);
          return prop;
        })
        .value();
      };

      $scope.room = "general";
      $scope.rooms = [];
      $scope.usersConnected = [];

      $scope.getUser = Account.getUser()
          .then(function(response) {
            $scope.user = response.data;
            socket.emit('new user', {
              username: response.data.username
              });
              $scope.usersConnected.push(response.data.username);
              console.log($scope.usersConnected);
          })
          .catch(function(response) {
            toastr.error(response.data.message, response.status);
          });


      socket.on('setup', function(data) {
        _.forEach(data.rooms, function(val) {
          obj = {
            name: val,
            count: 0,
            users: []
          };
          $scope.rooms.push(obj);
        });
        $scope.users = data.users;
      });

      socket.on('disconnect', function(data) {
        decrementRoom($scope.room);
      });

      socket.on('user joined', function(user) {
        $scope.room = user.room;
        incrementRoom(user.room, user.username);

        Messages.getMessages($scope.room)
        .then(function(response) {
          $scope.messages = response.data;
        })
        .catch(function(response) {
          toastr.error(response.data.message, response.status);
        });
      });

      socket.on('message created', function(data) {
        console.log('message event received from server');
        console.log(data);
        $scope.messages.push(data);
        console.log($scope.messages);
        $scope.message = "";
      });

      $scope.send = function(msg) {
        socket.emit('new message', {
          room: $scope.room,
          message: msg,
          user: $scope.user._id,
          username: $scope.user.username
        });
      };

      $scope.switchRoom = function(r) {
        $scope.room = r;
        socket.emit('switch room', {
          newRoom: r,
          username: $scope.username
        });
        Messages.getMessages(r)
        .then(function(response) {
          console.log(response.data);
          $scope.messages = response.data;
        })
        .catch(function(response) {
          toastr.error(response.data.message, response.status);
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
