var express = require('express');
var router = express.Router();
var request = require('request');

//IP ADDRESS OF TICKET COUNTER
var ticketCounterAddress = '10.0.4.10:3000/update';
/* GET update page. */
router.get('/', function(req, res, next) {
	request(ticketCounterAddress, function(error, response, body) {
		console.log("Requested: " + ticketCounterAddress + "\nBody: " + body);
		res.send(200, "You've engaged the middleman, and received this response from your destination: " + body);
	});
});


module.exports = router;
