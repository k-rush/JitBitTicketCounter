var express = require('express');
var router = express.Router();
var request = require('request');
var async = require('async');
var mysql = require('mysql');

var con;


/* GET jitbit tickets count. */
router.get('/total', function(req, res, next) {
	con = mysql.createConnection({
	  host: "localhost",
	  user: "root",
	  password: "password",
	  database: "JBCACHE"
	});

	con.connect(function(err) {
	  	if (err) throw err;
	  	var sql = "SELECT count FROM cache WHERE type = 'total'";
		con.query(sql, function (err, result) {
	    	if (err) throw err;
	    	res.status(200).send(result);
		});
	});
});

/* GET unclosed ticket count. */
router.get('/unclosed', function(req, res, next) {
	con = mysql.createConnection({
	  host: "localhost",
	  user: "root",
	  password: "password",
	  database: "JBCACHE"
	});

	con.connect(function(err) {
	  	if (err) throw err;
	  	var sql = "SELECT count FROM cache WHERE type = 'unclosed'";
		con.query(sql, function (err, result) {
	    	if (err) throw err;
	    	res.status(200).send(result);
		});
	});
});

//Use this to force update...
router.get('/update', function(req, res, next) {
	connectToDB().then(function() {
    	getUnclosedTicketCount(0).then(function(unclosedTickets) {
			console.log("NUMBER OF UNCLOSED TICKETS:" + unclosedTickets);
			var sql = "UPDATE cache SET count = " + unclosedTickets + " WHERE type = 'unclosed'";
			con.query(sql, function (err, result) {
		    	if (err) throw err;
		    	console.log("Unclosed count updated");
		    	res.send(200, {count:unclosedTickets})
		    	process.exit();
			});
		});
	});
	
});


function connectToDB() {
	return new Promise(function(resolve, reject) {
		con = mysql.createConnection({
		  host: "localhost",
		  user: "root",
		  database: "JBCACHE"
		});

		con.connect(function(err) {
		  if (err) throw err;
		  console.log("Connected!");
		  resolve();
		});
	});
}

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
		//console.log(url);

		request(options, function(err, res, body) {
			if(err) {
				console.log(err);
				reject(err);
				return;
			}
			
			tickets = JSON.parse(body);
			ticketCount = tickets.length;
			//console.log('Offset: ' + offset + '\nTicket count from call: ' + tickets.length);
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
		//console.log(url);

		request(options, function(err, res, body) {
			if(err) {
				console.log(err);
				reject(err);
				return;
			}
			
			tickets = JSON.parse(body);
			ticketCount = tickets.length;
			//console.log('Offset: ' + offset + '\nTicket count from call: ' + tickets.length);
			resolve(ticketCount);
		});		
	})
	.then(function(ticketCount) {
		return ticketCount > 0 ? getUnclosedTicketCount(offset + ticketCount) : offset;
	});
}


module.exports = router;
