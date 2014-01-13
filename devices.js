/*
* devices.js
* Returns the dtype, dsubtype and svalue needed to send the command to Domoticz
* Requires the Device type and svalue
*
*/



function getDevice(DeviceType, svalue) {

	switch (DeviceType.toLowerCase()) {
		case "temperature":
			dtype = 80;
			dsubtype = 1;
			svalue = svalue;
			var result = new array();
			result['dtype'] = dtype;
			result['dsubtype'] = dsubtype;
			result['svalue'] = svalue;
			return result;
			break;
		case "humidity":
			dtype = 81;
			dsubtype = 1;
			svalue = svalue;
			var result = new array();
			result['dtype'] = dtype;
			result['dsubtype'] = dsubtype;
			result['svalue'] = svalue;
			return result;
			break;
		case "temp+hum":
			dtype = 82;
			dsubtype = 1;
			svalue = svalue + ';0';  // don't know why this is needed
			// also for no apparent reason the &did cannot be a random string so it will end up like 0000
			var result = new array();
			result['dtype'] = dtype;
			result['dsubtype'] = dsubtype;
			result['svalue'] = svalue;
			return result;
			break;
		case "temp+hum+baro":
			dtype = 84;
			dsubtype = 1;
			svalue = svalue;
			// unclear what the svalue should look like ???
			var result = new array();
			result['dtype'] = dtype;
			result['dsubtype'] = dsubtype;
			result['svalue'] = svalue;
			return result;
			break;
		case "rain":
			dtype = 85;
			dsubtype = 3;
			svalue = svalue;
			var result = new array();
			result['dtype'] = dtype;
			result['dsubtype'] = dsubtype;
			result['svalue'] = svalue;
			return result;
			break;
		case "wind":
			dtype = 86;
			dsubtype = 1;
			svalue = svalue;
			// 0;N;0;0;0;0 ???
			var result = new array();
			result['dtype'] = dtype;
			result['dsubtype'] = dsubtype;
			result['svalue'] = svalue;
			return result;
			break;
		case "uv":
			dtype = 87;
			dsubtype = 1;
			svalue = svalue;
			var result = new array();
			result['dtype'] = dtype;
			result['dsubtype'] = dsubtype;
			result['svalue'] = svalue;
			return result;
			// 0.0 UVI
			break;
		case "electricity":
			dtype = 250;
			dsubtype = 1;
			svalue = svalue;
			var result = new array();
			result['dtype'] = dtype;
			result['dsubtype'] = dsubtype;
			result['svalue'] = svalue;
			return result;
			break;
		case "gas":
		    dtype = 113;
			dsubtype = 0;
			svalue = svalue;
			var result = new array();
			result['dtype'] = dtype;
			result['dsubtype'] = dsubtype;
			result['svalue'] = svalue;
			return result;
			break;
		case "shuttercontact":
			dtype = 32;
			dsubtype = 1;
			svalue = svalue;
			var result = new array();
			result['dtype'] = dtype;
			result['dsubtype'] = dsubtype;
			result['svalue'] = svalue;
			return result;
			break;
		default:
			dtype = 0;
			dsubtype = 0;
			svalue = svalue;
			var result = new array();
			result['dtype'] = dtype;
			result['dsubtype'] = dsubtype;
			result['svalue'] = svalue;
			return result;
			break;				
	};

}