const request = require('request')
const http = require('http')

// Modify these strings and messages to change the behavior of your Lambda function
const config = {};
config.MULESOFT_SERVICE_PATH = "/event";
config.MULESOFT_CLOUDHUB_HOST = "echobutton-ejta.us-e2.cloudhub.io";
config.MULESOFT_SERVICE_PORT = 8081;


// HKA: MuleSoft Functions  =====================================
const MuleSoft = {

	PostToListener: function (buttonEvent, uColor, callback) {

		for (var i in buttonEvent) {
			buttonEvent[i].color = uColor

			var body = JSON.stringify(buttonEvent[i]);

			console.log("**************>>>>>>>> MuleSoft::PostToListener REQUEST *********** " + body);
			
			var headers = {
				"Content-Type": "application/json",
				"Content-Length": Buffer.byteLength(body)
			}
			
			// Configure the request
			var options = {
    			url: 'http://echobutton-ejta.us-e2.cloudhub.io/event',
    			method: 'POST',
    			headers: headers,
				form: body
			}

			// Start the request
			request(options, function (error, response, body) {
				if (error) {
					console.log("**************<<<<<< MuleSoft::PostToListener:ERROR ***********: ", error);
					console.log(error, error.stack); // an error occurred
					callback("MuleSoft::PostToListener:ERROR");
				} else {
					// Print out the response body
					console.log('**************<<<<<< MuleSoft::PostToListener BODY ***********: ' + body);
					callback("MuleSoft::PostToListener:SUCCESS");     // successful response
				}
			})
			
			var clientRequest = new http.ClientRequest({
				hostname: config.MULESOFT_CLOUDHUB_HOST,
				//	port: config.MULESOFT_SERVICE_PORT,
				path: config.MULESOFT_SERVICE_PATH,
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"Content-Length": Buffer.byteLength(body)
				}
			});

			clientRequest.write(body);
			clientRequest.end();

			clientRequest.on('response', function (response) {
				console.log('**************<<<<<< MuleSoft::PostToListener STATUS ***********: ' + response.statusCode);
				console.log('**************<<<<<< MuleSoft::PostToListener HEADERS ***********: ' + JSON.stringify(response.headers));
				response.setEncoding('utf8');
				response.on('data', function (chunk) {
					console.log('**************<<<<<< MuleSoft::PostToListener BODY ***********: ' + chunk);
				});

				console.log("**************<<<<<< MuleSoft::PostToListener.RESPONSE ***********: ", response);
				callback("MuleSoft::PostToListener:SUCCESS");     // successful response
			});

		}
	}
}


module.exports = MuleSoft;