var express = require('express');
var request = require('request');
var async = require('async');
var router = express.Router();
const https = require('https');


/* GET jitbit tickets count. */
router.get('/total', function(req, res, next) {

	console.log('');
	const success = function(results) {
			res.status(200).send(results.toString());
		};
	const failure = function(error) {
			console.log(error);
			res.status(500).send(error);
		};
	getTicketCount(0).then(success);
	
});

/* GET unclosed ticket count. */
router.get('/unclosed', function(req, res, next) {

	console.log('');
	const success = function(results) {
			res.status(200).send(results.toString());
		};
	const failure = function(error) {
			console.log(error);
			res.status(500).send(error);
		};
	getUnclosedTicketCount(0).then(success);
	
});

function getTicketCount(offset) {
	if(offset > 100000) {
		throw new Error("Too many tickets!");
	}

	return new Promise(function (resolve, reject) {
		var url = 'https://help.mysonobello.com/api/tickets?count=100&offset=' + offset;
		var options = {
			  url: url,
			  auth: {
			    user: username,
			    password: password
			  }
			};
		console.log(url);

		request(options, function(err, res, body) {
			if(err) {
				console.log(err);
				reject(err);
				return;
			}
			
			tickets = JSON.parse(body);
			ticketCount = tickets.length;
			console.log('Offset: ' + offset + '\nTicket count from call: ' + tickets.length);
			resolve(ticketCount);
		});		
	})
	.then(function(ticketCount) {
		return ticketCount > 0 ? getTicketCount(offset + ticketCount) : offset;
	});

}

function getUnclosedTicketCount(offset) {
	if(offset > 100000) {
		throw new Error("Too many tickets!");
	}

	return new Promise(function (resolve, reject) {
		var url = 'https://help.mysonobello.com/api/tickets?mode=unclosed&count=100&offset=' + offset;
		var options = {
			  url: url,
			  auth: {
			    user: username,
			    password: password
			  }
			};
		console.log(url);

		request(options, function(err, res, body) {
			if(err) {
				console.log(err);
				reject(err);
				return;
			}
			
			tickets = JSON.parse(body);
			ticketCount = tickets.length;
			console.log('Offset: ' + offset + '\nTicket count from call: ' + tickets.length);
			resolve(ticketCount);
		});		
	})
	.then(function(ticketCount) {
		return ticketCount > 0 ? getUnclosedTicketCount(offset + ticketCount) : offset;
	});
}

module.exports = router;
