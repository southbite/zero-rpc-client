var zerorpc = require("zerorpc");

module.exports = {
	initialize:function(config, done){
		
		var _this = this;

		try{

			if (!config.server_url)
				throw 'Need parameter: server_url';

			if (!config.options)
				config.options = {};

			_this.client = new zerorpc.Client(config.options);
			_this.client.connect(config.server_url);

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

			var response = null;

			_this.client.invoke(method, {data:message, options:options}, function(error, res, more) {
			    if(error) {
			       done(error);
			    } else {
			       done(null, res);
			    }
			    /*
			    No streaming
			    if(!more) {
			        console.log("Done.");
			    }
			    */
			});

		}catch(e){
			done(e);
		}

		
		
	}
}