// Cron job to get ticket counts from jitbit API.
// Must have mysql database set up.  Run the following commands in mysql commnd line:
// create database jbcache;
// use jbcache;
// create table cache (type VARCHAR(255), count INTEGER);
// insert into cache (type, count) values (unclosed, 0);
// insert into cache (type, count) values (total, 0);

var request = require('request');
var async = require('async');
var mysql = require('mysql');

var con;


connectToDB().then(function() {
	getTicketCount(0).then(function(tickets) {
		console.log("NUMBER OF TICKETS:" + tickets);
		var sql = "UPDATE cache SET count = " + tickets + " WHERE type = 'total'";
		con.query(sql, function (err, result) {
	    	if (err) throw err;
	    	console.log("Total count updated");
	    	getUnclosedTicketCount(0).then(function(unclosedTickets) {
				console.log("NUMBER OF UNCLOSED TICKETS:" + unclosedTickets);
				var sql = "UPDATE cache SET count = " + unclosedTickets + " WHERE type = 'unclosed'";
				con.query(sql, function (err, result) {
			    	if (err) throw err;
			    	console.log("Unclosed count updated");
			    	process.exit();
				});
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
