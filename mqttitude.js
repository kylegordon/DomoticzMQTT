// go to http://mqttitude.org/ and install the android or ios app

// this is the location of the Eiffel Tower, but you can change it in whatever location you want (e.g. your home)
var home = new LatLon(48.858292,3.294723);

// thanks to Chris Veness for the calcuation stuff. http://www.movable-type.co.uk/scripts/latlong.html
//
// ---- extend Number object with methods for converting degrees/radians

/** Converts numeric degrees to radians */
if (typeof Number.prototype.toRad == 'undefined') {
  Number.prototype.toRad = function() {
    return this * Math.PI / 180;
  }
}

/** Converts radians to numeric (signed) degrees */
if (typeof Number.prototype.toDeg == 'undefined') {
  Number.prototype.toDeg = function() {
    return this * 180 / Math.PI;
  }
}
/** 
 * Formats the significant digits of a number, using only fixed-point notation (no exponential)
 * 
 * @param   {Number} precision: Number of significant digits to appear in the returned string
 * @returns {String} A string representation of number which contains precision significant digits
 */
if (typeof Number.prototype.toPrecisionFixed == 'undefined') {
  Number.prototype.toPrecisionFixed = function(precision) {
    
    // use standard toPrecision method
    var n = this.toPrecision(precision);
    
    // ... but replace +ve exponential format with trailing zeros
    n = n.replace(/(.+)e\+(.+)/, function(n, sig, exp) {
      sig = sig.replace(/\./, '');       // remove decimal from significand
      l = sig.length - 1;
      while (exp-- > l) sig = sig + '0'; // append zeros from exponent
      return sig;
    });
    
    // ... and replace -ve exponential format with leading zeros
    n = n.replace(/(.+)e-(.+)/, function(n, sig, exp) {
      sig = sig.replace(/\./, '');       // remove decimal from significand
      while (exp-- > 1) sig = '0' + sig; // prepend zeros from exponent
      return '0.' + sig;
    });
    
    return n;
  }
} 

/** Trims whitespace from string (q.v. blog.stevenlevithan.com/archives/faster-trim-javascript) */
if (typeof String.prototype.trim == 'undefined') {
  String.prototype.trim = function() {
    return String(this).replace(/^\s\s*/, '').replace(/\s\s*$/, '');
  }
}

function LatLon(lat, lon, rad) {
  if (typeof(rad) == 'undefined') rad = 6371;  // earth's mean radius in km
  // only accept numbers or valid numeric strings
  this._lat = typeof(lat)=='number' ? lat : typeof(lat)=='string' && lat.trim()!='' ? +lat : NaN;
  this._lon = typeof(lon)=='number' ? lon : typeof(lon)=='string' && lon.trim()!='' ? +lon : NaN;
  this._radius = typeof(rad)=='number' ? rad : typeof(rad)=='string' && trim(lon)!='' ? +rad : NaN;
}

LatLon.prototype.distanceTo = function(point, precision) {
  // default 4 sig figs reflects typical 0.3% accuracy of spherical model
  if (typeof precision == 'undefined') precision = 4;
  
  var R = this._radius;
  var lat1 = this._lat.toRad(), lon1 = this._lon.toRad();
  var lat2 = point._lat.toRad(), lon2 = point._lon.toRad();
  var dLat = lat2 - lat1;
  var dLon = lon2 - lon1;

  var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.cos(lat1) * Math.cos(lat2) * 
          Math.sin(dLon/2) * Math.sin(dLon/2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  var d = R * c;
  return d.toPrecisionFixed(precision);
}
/* here the mqttitude part starts. 
Put mqttitude = require
*/
mqtt = require('mqtt');


client = mqtt.createClient(1883, 'localhost');

client.subscribe('/mqttitude');
client.on('message', function (topic, message) {
  console.log('Mqttitude Received: '+ topic + ' ' + message);
  
  var lat = 0;
  var lon = 0;
  
  try {
    var payload = JSON.parse(message);  
    if (payload !=  null) {
		console.log('JSON Payload');
		if(payload.lat) {	
			lat = payload.lat;
		}
		if(payload.lon) {
			lon = payload.lon;
		}
	  }
		  
	var location = new LatLon(lat, lon);  
	var distance = home.distanceTo(location, 4);
	console.log('Lat = '+lat+' Lon = '+lon+' Distance = '+distance);
	
	var pubmessage = '{"SensorType":"counter","svalue":"'+distance+'km"}';
	console.log(pubmessage);
	client.publish('/actions/domoticz/mqttitude', pubmessage);
	
  }
  catch(e) {
    console.log("Could not parse payload");
    console.log(e);
  }
});