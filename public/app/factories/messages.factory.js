;(function() {

  angular
    .module('chat')
    .factory('Messages', Messages);

  Messages.$inject = ['$http', 'LocalStorage'];


  ////////////


  function Messages($http, LocalStorage) {

    return {
          getMessages: function(r) {
            return $http.get('/api/Messages', {
              params: {
                room: r
              }
            });
          }
        };


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
