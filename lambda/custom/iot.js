// import the Iot SDK 
const AWS = require('aws-sdk');

// Modify these strings and messages to change the behavior of your Lambda function
const config = {};
config.IOT_BROKER_ENDPOINT      = "a225gcmxqu0ixq.iot.us-east-1.amazonaws.com";  // also called the REST API endpoint
config.IOT_BROKER_REGION        = "us-east-1";  // eu-west-1 corresponds to the Oregeon Region.  Use us-east-1 for the N. Virginia region
config.IOT_THING_NAME           = "EchoButton";
config.IOT_TOPIC_NAME           = "thing/EchoButton";
config.IOT_ACCESSKEY_ID         = "AKIAJZGSILLO274B5A5A";
config.IOT_SECRET_ACCESSKEY     = "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";

var iotdata = new AWS.IotData({endpoint: config.IOT_BROKER_ENDPOINT});

// HKA: IoT Functions  =====================================
const IoTCore = {
        
        HandleUpdateShadow: function(buttonEvent, uColor, callback) {
 
            // update AWS IOT thing shadow
            AWS.config.region = config.IOT_BROKER_REGION;
            AWS.config.accessKeyId = config.IOT_ACCESSKEY_ID;
            AWS.config.secretAccessKey = config.IOT_SECRET_ACCESSKEY;

            // HKA: overwrite the color attribute with a verb
            for (var i in buttonEvent) {
                buttonEvent[i].color = uColor
            }
    
            //Prepare the parameters of the update call
            var params = {
                "topic" : config.IOT_TOPIC_NAME,
                "qos": 0,
                "payload" : JSON.stringify(
                        { "inputEvents": buttonEvent}
            )};

    		console.log("**************>>>>>>>> IoTCore::HandleTopicPublish *********** " + JSON.stringify(buttonEvent));
            
            iotdata.publish(params, function (err, res) {
                if (err) {
                    console.log("**************<<<<<< IoTCore::HandleTopicPublish.ERROR ***********: ", err);
					console.log(err, err.stack); // an error occurred
                    callback("IoTCore::HandleTopicPublish:ERROR");
                }
                else {
        		    console.log("**************<<<<<< IoTCore::HandleTopicPublish:SUCCESS ***********: ", res);
                    callback("IoTCore::HandleTopicPublish:SUCCESS");
                }
                console.log("**************<<<<<< IoTCore RESPONSE *********** ButtonEvent: " + res);
            });
        }
}


module.exports = IoTCore;