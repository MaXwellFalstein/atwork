var unirest = require('unirest');

module.exports = function(System) {
  var sck = System.webSocket;
  var plugin = {
    /**
     * The helper register method
     * @return {Void}
     */
    register: function () {
      sck.on('connection', function(socket) {
        socket.on('request', function(params) {
          // console.log(params.url);
          // console.log(params.transformRequest);
          console.log(params);
          var method = params.method.toLowerCase();
          var url = System.config.baseURL + '/' + params.originalUrl;
          var headers = params.headers;
          var requestParams = params.params;
          
          console.log('MAKING REQ: ', url)
          
          unirest[method](url)
          .headers(headers)
          .send(requestParams)
          .end(function (response) {
            console.log(response.body);
            socket.emit('response', {resId: params.reqId, data: response.body, url: url});
          });

          setTimeout(function() {
            // socket.emit('response', {resId: params.reqId, data: {dummy: true}});
          }, 1000);
        });
      });
      return {
        
      };
    }
  };

  /**
   * Attributes to identify the plugin
   * @type {Object}
   */
  plugin.register.attributes = {
    name: 'Web Requests over Socket',
    key: 'socketRequests',
    version: '1.0.0'
  };
  return plugin;
};