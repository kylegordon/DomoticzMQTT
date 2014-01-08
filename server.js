var IP = '127.0.0.1';                            //IP address of Domoticz (127.0.0.1 for same machine)
var Port = '8080';                              //Port of Domoticz

var sys = require('sys');
var net = require('net');
var request = require('request');
var mqtt = require('mqtt')

client = mqtt.createClient(1883, 'localhost');

var toString = function(text) {
   return text + '';
};

client.subscribe('/Arduino/#');
client.publish('/Arduino/', 'This is Domoticz');

client.on('message', function (topic, message) {
  
  try {
    var payload = JSON.parse(message);  
    var url = 'http://'+IP+':'+Port;
    var svalue = 0;
    var idx = 0;
    var nvalue = 0;

    for (var i = payload.data.length - 1; i >= 0; i--) {
      var data = payload.data[i];
      if(data.idx) {
        idx = data.idx;
      }
      if(data.nvalue) {
        nvalue = data.nvalue;
      }
      if(data.svalue) {
        svalue = data.svalue;
      }
      url = url + "/json.htm?type=command&param=udevice&idx="+idx+"&nvalue="+nvalue+"&svalue="+svalue;
      request(url, function(error, response, body){
      });
    };
  }
  catch(e) {
    console.log("Could not parse JSON.");
    console.log(e);
  }

});