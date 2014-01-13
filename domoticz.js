/*
*
*
*
*/


//Include required libraries and files
var mqtt = require('mqtt');
var sys = require('sys');
var net = require('net');
var request = require('request');
var devices = require('./devices.js');

//Configure Domoticz server settings
var	Domoticz_HID = '3'; 										//Hardware ID of dummy in Domoticz
var DomoticzHost = '127.0.0.1'; 								//IP address of Domoticz (127.0.0.1 for same machine)
var DomoticzPort = '8080';										//Port of Domoticz

//Configure MQTT Broker settings
var BrokerHost = 'localhost';
var BrokerPort = 1883;
var BrokerTopic = '/Domoticz/#';

//Connect to the MQTT Broker
client = mqtt.createClient(BrokerPort, BrokerHost);
//Subscribe to topic
client.subscribe(BrokerTopic);
client.publish(BrokerTopic, 'Domoticz online');

// the lua-script in domoticz pushes all events to port 5001. This function will republish them on the mqtt bus
// http.createServer(function (req, res) {
// 	res.writeHead(200, {'Content-Type': 'text/plain'});
// 	res.end('Response from Node.js \n');
	
// 	console.log('publish: '+'/events/domoticz'+url.parse(req.url).pathname, url.parse(req.url).query);
// 	client.publish('/events/domoticz'+url.parse(req.url).pathname, url.parse(req.url).query);	
// }).listen(5001, 'localhost');

/* here we subscribe to topic /actions/domoticz in mqtt. Parsable messages which are published here will be sent to domoticz
Example data 1 (JSON, idx-value):
mosquitto_pub -t /actions/domoticz/xyz -m '
{
   "data":[{
      "idx":247,
      "svalue":"21.1;70%"
   }]
}'

Example data 2 (JSON, did/dunit/dtype/dsubtype):
{
   "data":[{
      "dunit":1,
	  "dtype":80,
	  "dsubtype":9,
      "svalue":"21.1"
   }]
}
(for dtype and dsubtype please refer to http://sourceforge.net/p/domoticz/code/HEAD/tree/domoticz/main/RFXtrx.h
e.g. 80,9 = temperature, 82,10 = temperature+humidity, 32, 1 = shuttercontact)

Example data 3 (Normal, idx-value):
mosquitto_pub -t /actions/domoticz/247 -m 21.1

Example data 4 (JSON, SensorType):
{
   "data":[{
      "SensorType":"Temperature",
      "svalue":"21.1"
   }]
}
*/

client.on('message', function (topic, message) {
  console.log('Received: '+ topic + ' ' + message);
  var url = 'http://'+DomoticzHost+':'+DomoticzPort;
  
  var idx;
  var nvalue = 0;
  var svalue = 0;
  
  var dunit;
  var dtype;
  var dsubtype;
      
  try {
    var payload = JSON.parse(message);  
    if (payload.data !=  null) {
	  console.log('JSON Payload');
	  for (var i = payload.data.length - 1; i >= 0; i--) {
	      var data = payload.data[i];
	      if(data.nvalue) {
	        nvalue = data.nvalue;
	      }
	      if(data.svalue) {
	        svalue = data.svalue;
	      }
		  if(data.dunit) {
		    dunit = data.dunit;
		  }
		  if(data.dsubtype) {
		    dsubtype = data.dsubtype;
		  }
		  
		  //use idx if found, otherwise use hid/did/dunit/dtype/dsubtype style of interfacing with domoticz.
		  if(data.idx) {
	        idx = data.idx;
			url = url + "/json.htm?type=command&param=udevice&idx="+idx+"&nvalue="+nvalue+"&svalue="+svalue;
	      }
		  else if(data.SensorType) {
			var device = devices.getDevice(data.SensorType, svalue);
			dtype = device['dtype'];
			dsubtype = device['dsubtype'];
			svalue = device['svalue'];
			url = url + "/json.htm?type=command&param=udevice&hid="+Domoticz_HID+"&did="+topic+"&dunit="+dunit+"&dtype="+dtype+"&dsubtype="+dsubtype+"&nvalue="+nvalue+"&svalue="+svalue;  	
		  };

		  //Send data to Domoticz
		  sendDomoticz(url);
	  }
    }
	else {
		console.log('Normal Payload');
	  
		var parts = topic.split("/");
		idx = parts.pop();
		svalue = message;
		
		url = url + "/json.htm?type=command&param=udevice&idx="+idx+"&nvalue=0&svalue="+svalue;
		
		sendDomoticz(url);
		
	};
  }
  catch(e) {
    console.log("Could not parse payload");
    console.log(e);
  }
});


function sendDomoticz (url) {
	request(url, function(error, response, body){
		console.log("Sending request");
	    console.log(url);
	    console.log(error);
	    //  console.log(response);
	    console.log(body);
	});
}
