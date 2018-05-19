var express = require('express');
var router = express.Router();
var mysql = require('mysql');


/* GET jitbit tickets count. */
router.get('/total', function(req, res, next) {
	var con = mysql.createConnection({
	  host: "localhost",
	  user: "root",
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
	var con = mysql.createConnection({
	  host: "localhost",
	  user: "root",
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


module.exports = router;
