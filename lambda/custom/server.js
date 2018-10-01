const jsforce = require('jsforce');

// Modify these strings and messages to change the behavior of your Lambda function
const config = {};
config.PLATFORM_EVENT = "Echo_Button_Event__e";

var buttonEvent = [{"gadgetId__c": "1", "color__c": "red", "timestamp__c": "1234", "action__c": "down" }];

var conn = new jsforce.Connection({
    oauth2: {
        clientId: "3MVG9I5UQ_0k_hTmN3Zdd6S3UwJNTr_yNr18M.oYuQuKsRzlvHHsVJCBxns9oK4nGxSquNeu6E.hIKjgfVhgm",
        clientSecret: "7188543176248263902",
        redirectUri: "https://login.salesforce.com",
    },
    instanceUrl: "https://myiot.my.salesforce.com",
    accessToken: "00D0O000002Ff3I!ARUAQNNzxxhr_owLIAcSaSJxE9fI9OaPNx.f37pkJY1an7Oytluw4HeCIjRCBDt9mnw1UrDl8U.Ala_q8WqezRPkSJMvGUdd",
    refreshToken: "5Aep861k6qv8Dh1kgZhe03NHALrRZ7j0.4t2E9yrzlT3dBqrKFmXjrMdGmOojciohI20sb7uoAZxpX2OMSrpNMp"
});

conn.oauth2.refreshToken(conn.refreshToken, (err, results) => {
    if (err) {
        console.log('ERROR: ' + JSON.stringify(err));
    }
    console.log('RESULTS: ' + JSON.stringify(results));
});


for (var i in buttonEvent) {
    console.log("**************>>>>>>>> IngestPlatformEvent REQUEST *********** " + JSON.stringify(buttonEvent[i]));

    conn.sobject(config.PLATFORM_EVENT).create(buttonEvent[i],function (err, rets) {
            if (err) {
                console.log("**************<<<<<< Salesforce ERROR ***********");
                console.log(err, err.stack); // an error occurred
                // callback("Salesforce::IngestPlatormEvent:ERROR");
            } else {
                console.log("**************<<<<<< Salesforce RESPONSE ***********: " + JSON.stringify(rets));
                // callback("Salesforce::IngestPlatormEvent:SUCCESS");     // successful response
            }
        });

    const jsonStr = { "Salesforce::ApexREST.jsonStr": JSON.stringify(buttonEvent, 0, 0) }; 
	conn.apex.post("/PlatformEvent/", jsonStr, function(err, res) {
		if (err) { return console.error(err); }
		console.log("response: ", res);
		callback("Salesforce::ApexREST:SUCCESS");     // successful response
	});
}
