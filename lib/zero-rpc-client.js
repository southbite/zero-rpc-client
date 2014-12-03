var zerorpc = require("zerorpc"),
moment = require('moment');

var DEFAULT_TIMEOUT = 300;
var DEFAULT_HEARTBEAT = 300000;

module.exports = {
	config:null,
	clients:{},
	getClient:function(timeout, heartbeat){
		var _this = this;

		if (!timeout)
			timeout = DEFAULT_TIMEOUT;

		if (!heartbeat)
			heartbeat = DEFAULT_HEARTBEAT;

		var client_key = 'ttl' + timeout + 'hb' + heartbeat;

		console.log('getting client with timeout' + timeout);

		if (!_this.clients[client_key]){
			_this.clients[client_key] = new zerorpc.Client({heartbeatInterval:heartbeat, timeout:timeout});
			_this.clients[client_key].connect(_this.config.server_url);
		}

		return _this.clients[client_key];
			
	},
	initialize:function(config, done){
		
		var _this = this;
		
		try{

			if (!config.server_url)
				throw 'Need parameter: server_url';

			if (config.options && config.options.DEFAULT_HEARTBEAT)
				DEFAULT_HEARTBEAT = config.options.DEFAULT_HEARTBEAT;

			if (config.options && config.options.DEFAULT_TIMEOUT)
				DEFAULT_HEARTBEAT = config.options.DEFAULT_TIMEOUT;

			_this.config = config;
			_this.initialized = true;

			done();

		}catch(e){
			done(e);
		}
	},
	performOperation:function(method, message, options, done){
		var _this = this;
		
		try{

			if (!_this.initialized)
				throw 'Not initialized';

			if (!options)
				options = {};

			options.timestamp = moment().valueOf();

			var client = _this.getClient(options.ttl, options.heartbeat);

			client.invoke(method, {data:message, options:options}, function(error, res, more) {
				if(error) {
			       done(error);
			    } else {
			       done(null, res);
			    }
			});

		}catch(e){
			done(e);
		}

		
		
	}
}