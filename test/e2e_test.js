var expect = require('expect.js');
var firebase_service = require('pluggable-services').get('firebase');
var firebase_service_instance;
var firebase_service_client;
var uuid = require('uuid');

var testurl = 'https://wesgro.firebaseio.com/test_firebase_service';
var testsecret = 'dKwltecfpDanbiJ3cAkxeYlVW6LrU6ds3Ze9kSzk';
var testtokenObj = {account:'wesgro'};
var testData = {id:uuid.v4(), property1:uuid.v4()};
var moment = require('moment');

describe('e2e test', function() {

	it('should initialize', function(callback) {
		//console.log('in initialize test');
		 this.timeout(10000);
		 
		 firebase_service.initialize(function(e, instance){
			expect(e).to.be(null);
			firebase_service_instance = instance; 
			callback();
		 });

	});
	

	it('should return a client', function(callback) {
		//console.log('in client test');
		 this.timeout(10000);
		 
		 firebase_service_instance.newclient({}, function(e, client){
			
			 callback(e);
			 
		 });
		 
	});
	

	it('should return an authorized client', function(callback) {
		//console.log('in auth client test');
		 this.timeout(10000);
		 
		 firebase_service_instance.newclient({auth:true, url:testurl, secret:testsecret, tokenObj:testtokenObj}, function(e, client){
			
			 if (e)
				 callback(e);
			 else{
				 firebase_service_client = client;
				 callback();
			 }
				 
			 
		 });
		 
	});
	
	it('should add a new item', function(callback) {
		//console.log('in new item test');
		 this.timeout(10000);
		 
		 firebase_service_client.set(testurl + '/' + testData.id + '/test_add', testData, null, function(e){
			 
			 if (e)
				 callback(e.toString());
			 else
				 callback();
			 
		 });
		 
	});
	
	it('should fetch the new item', function(callback) {
		//console.log('in new item fetch test');
		 this.timeout(20000);
		 
		 firebase_service_client.fetch(testurl + '/' + testData.id + '/test_add', {ttl:0}, function(e, snapshot){
			 console.log('in new item fetch test fetched');
			 console.log(snapshot.val());
			 expect(snapshot != null).to.be(true);
			 expect(snapshot.val().id == testData.id).to.be(true);
			 callback();
			 
		 });
		 
	});
	

	/*
	it('should try to fetch the new item, but timeout', function(callback) {
		//console.log('in new item fetch timeout test');
		 this.timeout(10000);
		 
		 firebase_service_client.fetch(testurl + '/' + testData.id + '/test_add', {ttl:20}, function(e, snapshot){
			 
			expect(e != null).to.be(true);
			callback();
			 
		 });
		 
	});
	*/

	
	it('should push to a list, verify the result', function(callback) {
		//console.log('in list push test');
		 this.timeout(20000);
		 
		 firebase_service_client.push(testurl + '/' + testData.id + '/test_list', testData, null, function(e, pushname){
			 //console.log('in list push test pushed');
			 //console.log(pushname);
			 if (e)
				 callback(e.toString());
			 else
				 firebase_service_client.fetch(testurl + '/' + testData.id + '/test_list/' + pushname, null, function(e, fetchsnapshot){
					 //console.log('in list push test pushed fetch');
					 //console.log(fetchsnapshot.val());
					 if (e)
						 callback(e.toString());
					 else{
						 expect(fetchsnapshot.val().id == testData.id).to.be(true);
						 callback();
					 }
					 
				 });
			 
		 });
		 
	});
	

	
	it('should update an added item', function(callback) {
		//console.log('in update item test');
		 this.timeout(20000);
		 
		 firebase_service_client.update(testurl + '/' + testData.id + '/test_add', {newproperty:'test'}, null, function(e){
			 
			 if (e)
				 callback(e.toString());
			 else{
				 	firebase_service_client.fetch(testurl + '/' + testData.id + '/test_add', null, function(e, fetchsnapshot){
					 
					 if (e)
						 callback(e.toString());
					 else{
						 //console.log('in aded item update test');
						 //console.log(fetchsnapshot.val());
						 expect(fetchsnapshot.val().id == testData.id).to.be(true);
						 expect(fetchsnapshot.val().newproperty == 'test').to.be(true);
						 callback();
					 }
					 
				 });
			 }
				
			 
		 });
		 
	});
	
	
	it('should logoff, then reconnect when fetching', function(callback) {
		//console.log('in logoff logon test');
		
		 this.timeout(10000);
		 
		 firebase_service_client.authResult.expires = parseInt(moment().valueOf().toString().substring(0, 10));
		 
		 setTimeout(function(){
			 firebase_service_client.fetch(testurl + '/' + testData.id + '/test_add', null, function(e, fetchsnapshot){
				 
				 if (e)
					 callback(e.toString());
				 else{
					 //console.log('unauthed fetch happend');
					 expect(fetchsnapshot != null).to.be(true);
					 callback();
				 }
				 
			 }.bind(this));
			 
		 }, 1000);

	});
	
});