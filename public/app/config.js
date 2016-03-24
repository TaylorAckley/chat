;(function() {


	/**
	 * Place to store API URL or any other constants
	 * Usage:
	 *
	 * Inject CONSTANTS service as a dependency and then use like this:
	 * CONSTANTS.API_URL
	 */
  angular
  	.module('chat')
    .constant('CONSTANTS', {
      'API_URL': 'localhost:3000'
    });


})();
