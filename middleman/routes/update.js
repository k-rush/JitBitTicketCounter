var express = require('express');
var router = express.Router();
var request = require('request');

//IP ADDRESS OF TICKET COUNTER
var ticketCounterAddress = 'http://10.0.4.10:3000/update';
/* GET update page. */
router.get('/', function(req, res, next) {
	request(ticketCounterAddress, function(error, response, body) {
		console.log("Requested: " + ticketCounterAddress + "\nBody: " + body + "\nError" + error);
		res.send(200, body);
	});
});


module.exports = router;
