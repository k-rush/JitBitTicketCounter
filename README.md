My goal was to make a simple little 7-segment LED display to show how many open help desk tickets our IT team has.  We use Jitbit for our ticketing system, which has an api, however the /tickets endpoint doesn’t have a count response, and is paginated with a max of 100 tickets that it will respond with.  So that presented my first challenge, how can I get a count of the number of tickets I I’m receiving if it’s over 100?

Well, I wanted to use node, just because I haven’t in a little while and I thought it would be a nice refresher.  So at first I wrote a little server using the express and request modules, that when it got a GET request to /total or /unclosed, it would in turn call the jitbit API repeatedly in sequence until it got to the end.  To do this, I used javascipt Promises recursively:
<pre>
function getTicketCount(offset) {
	return new Promise(function (resolve, reject) {
		var url = jitbit-url + offset;
		var options = {
			  url: url,
			  auth: {
			    user: username,
			    password: password
			  }
			};
		request(options, function(err, res, body) {
			if(err) {
				console.log(err);
				reject(err);
				return;
			}
			tickets = JSON.parse(body);
			ticketCount = tickets.length;
			resolve(ticketCount);
		});		
	})
	.then(function(ticketCount) {
		return ticketCount > 0 ? getTicketCount(offset + ticketCount) : offset;
	});
}
 </pre>

And then call that function with

<pre>getTicketCount(0).then(function(ticketCount) { ... });</pre>

Now, another problem:  With how many requests I needed to make to get the total number of tickets, it was taking upwards of a minute.  So, I needed to cache this data.  I made a quick mySQL database, and separated my requests into a separate javascript cron job that ran every few minutes to grab and cache the ticket count, so I wasn’t calling the jitbit API a bunch of times every time I needed the data.

With that working, I went out and bought a raspberry pi.  I had everything else I needed laying around: an adafruit 7-segment display with “backpack”, some wires and a plastic enclosure.  I soldered the backpack on the display and wired up the raspberry pi, fooled around with the adafruit python library to get a basic clock working, and was almost ready to go.

I don’t work in python too much, so it took me a little bit of trial and error to get mysql connecting, and eventually just granted all permissions to root and was good to go.  The python script runs every minute to query the database for the current ticket count, and display it on the 7-segment display.
