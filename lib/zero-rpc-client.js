var zerorpc = require("zerorpc"),
moment = require('moment');

module.exports = {
	wait:function(method){

		var _this = this;

		var timedout = false;
		var calltimeout;
		
		if (ttl > 0){
			calltimeout = setTimeout(function(){
				
				timedout = true;
				done('Call timed out');
				
			},ttl);
		}

		if (options.event == null)
			options.event = 'child_added';
		
		endpoint.once(options.event, function(snapshot) {
			if (!timedout){
				if (calltimeout != null)
					clearTimeout(calltimeout);
				
				done(null, snapshot);
			}
		});
	},
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

			if (!options)
				options = {};

			options.timestamp = moment().valueOf();

			var response = null;

			var timedout = false;
			var calltimeout;
			
			if (options.ttl && options.ttl > 0){
				calltimeout = setTimeout(function(){
					
					timedout = true;
					done('Call timed out');
					
				},options.ttl);
			}

			_this.client.invoke(method, {data:message, options:options}, function(error, res, more) {

				if (!timedout){
					if (calltimeout != null)
						clearTimeout(calltimeout);
					
					if(error) {
				       done(error);
				    } else {
				       done(null, res);
				    }
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