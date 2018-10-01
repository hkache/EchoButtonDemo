const jsforce = require('jsforce');

// Modify these strings and messages to change the behavior of your Lambda function
const config = {};
config.PLATFORM_EVENT = "Echo_Button_Event__e";

var conn = new jsforce.Connection({
	oauth2: {
		clientId: process.env.clientId,
		clientSecret: process.env.clientSecret,
		redirectUri: process.env.redirectUri,
	},
	instanceUrl: process.env.instanceUrl,
	accessToken: process.env.accessToken,
	refreshToken: process.env.refreshToken
});

conn.oauth2.refreshToken(conn.refreshToken, function(err, results) {
	if (err) {
		console.log('ERROR: ' + JSON.stringify(err));
	}
	console.log('RESULTS: ' + JSON.stringify(results));
});

// HKA: Salesforce Functions  =====================================
const Salesforce = {

	IngestPlatformEvent: function(buttonEvent, uColor, callback) {

		for (var i in buttonEvent) {
			buttonEvent[i].color = uColor

			var event = {
				gadgetId__c: buttonEvent[i].gadgetId,
				color__c: buttonEvent[i].color,
				timestamp__c: buttonEvent[i].timestamp,
				action__c: buttonEvent[i].action
			};

			console.log("**************>>>>>>>> Salesforce::IngestPlatormEvent REQUEST *********** " + JSON.stringify(event));

			conn.sobject(config.PLATFORM_EVENT).create(event,function (err, rets) {
					if (err) {
						console.log("**************<<<<<< Salesforce::IngestPlatormEvent.ERROR ***********");
						console.log(err, err.stack); // an error occurred
						callback("Salesforce::IngestPlatormEvent:ERROR");
					} else {
						console.log("**************<<<<<< Salesforce::IngestPlatormEvent.RESPONSE ***********: " + JSON.stringify(rets));
						callback("Salesforce::IngestPlatormEvent:SUCCESS");     // successful response
					}
				});
		}	
	},

	ApexREST: function(buttonEvent, uColor, callback) {

		for (var i in buttonEvent) {
			buttonEvent[i].color = uColor
			buttonEvent[i].topic = "thing/EchoButton"

			var event = {"jsonStr": JSON.stringify(buttonEvent[i]) };

			console.log("**************>>>>>>>> Salesforce::ApexREST *********** " + JSON.stringify(event));
			conn.apex.post("/PlatformEvent/", event, function (err, res) {

				if (err) {
					console.log("**************<<<<<< Salesforce::ApexREST.ERROR ***********: ", err);
					console.log(err, err.stack); // an error occurred
					callback("Salesforce::ApexREST:ERROR");
				} else {
					console.log("**************<<<<<< Salesforce::ApexREST.RESPONSE ***********: ", res);
					callback("Salesforce::ApexREST:SUCCESS");     // successful response
				}
			});
		}
	}
	
}


module.exports = Salesforce;