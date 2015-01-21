DomoticzMQTT
============

MQTT support for Domoticz open source Domotica server


Clone this repository to a working directory, and run server.js

ie, 

node server.js

mqttitude.js contains the logic to report Owntracks MQTT messages into Domoticz for location awareness
domoticz.js contains the logic to publish all sensor updates from Domoticz onto the MQTT broker, and to subscribe to all messages under /events/domoticz/# and submit the payload to the Domoticz server



# License
<a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/"><img alt="Creative Commons License" style="border-width:0" src="http://i.creativecommons.org/l/by-nc-sa/4.0/88x31.png" /></a><br />This work is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/">Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License</a>.
