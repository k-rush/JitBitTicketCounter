var express = require('express');
var router = express.Router();
var request = require('request');

//IP ADDRESS OF TICKET COUNTER
var ticketCounterAddress = 'krush-pi.sonobelloapps.com/update';
/* GET update page. */
router.get('/', function(req, res, next) {
	request(ticketCounterIP, function(error, response, body) {
		console.log("Requested: " + ticketCounterIP + "\nBody: " + body);
		res.send(200, "You've engaged the middleman, and received this response from your destination: " + body);
	});
});


module.exports = router;
