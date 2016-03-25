;(function() {

  angular
    .module('chat')
    .factory('socket', socket);

  socket.$inject = ['$http', 'socketFactory', 'CONSTANTS'];


  ////////////


  function socket($http, socketFactory, CONSTANTS) {
    var ioConnection = io.connect(CONSTANTS.API_URL);

    var socket = socketFactory({
      ioSocket: ioConnection
    });

    return socket;


    ////////////  function definitions


    /**
     * Load articles from GetPocket API
     * @return {Object} Articles object
     */
    // var request = {
    //   consumer_key: 'xxxx',
    //   access_token: 'xxxx',
    //   sort: 'newest',
    //   count: 5
    // };

    // return $http({
    //   method: 'GET',
    //   url: API.url + 'v3/get',
    //   params: request
    // }).then(function(articles) {
    //   return articles.data;
    // })
    // .catch(function(error) {
    //   return error;
    // });
  }


})();
