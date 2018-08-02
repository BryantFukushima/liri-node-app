require("dotenv").config();

var keys = require("./keys.js");

var Twitter = require("twitter");
var Spotify = require("node-spotify-api");
var request = require("request");
var fs = require("fs");

var client = new Twitter(keys.twitter);
var spotify = new Spotify(keys.spotify);

var action = process.argv[2];

function twitterSearch() {

		client.get('statuses/user_timeline', {count: 20}, function(err, tweets) {
			if (!err) {
				for (var i =0; i < tweets.length; i++) {
					console.log(tweets[i].text);
					console.log(tweets[i].created_at);
				}
			}
		   
		});
	}


function spotifySearch(song) {
		if (process.argv.length <= 3 && process.argv[2] == "spotify-this-song") {
			spotify.request('https://api.spotify.com/v1/tracks/3DYVWvPh3kGwPasp7yjahc', function(err , data) {
				if (!err) {
					
					console.log("Artists: " + data.artists[0].name);
					console.log("Song: " + data.name);
					console.log("Preview: " + data.preview_url);
					console.log("Album: " + data.album.name);
					
				}
			});
		} else {
			spotify.search({type: 'track' , query: song, limit: 1} , function(err , data){
				if (!err) {
					console.log("Artists: " + data.tracks.items[0].album.name);
					console.log("Song: " +data.tracks.items[0].name);
					console.log("Preview: " +data.tracks.items[0].preview_url);
					console.log("Album: " +data.tracks.items[0].artists[0].name);
				}
			});
		}
	}

function movieSearch(movie) {
		if (process.argv.length <= 3) {

			request("http://www.omdbapi.com/?t=mr.nobody&y=&plot=short&apikey=trilogy", function(err, response , data) {

				if (!err && response.statusCode === 200) {
					console.log("Title: " + JSON.parse(data).Title);
					console.log("Date: " + JSON.parse(data).Year)
					console.log("Rating: " + JSON.parse(data).imdbRating);
					console.log("Rotten Tomatoes Rating: " + JSON.parse(data).Ratings[1].Value);
					console.log("Locations: " + JSON.parse(data).Country);
					console.log("Language: " + JSON.parse(data).Language);
					console.log("Plot: " + JSON.parse(data).Plot);
					console.log("Actors: " + JSON.parse(data).Actors);
				}

			});

		} else {
			request("http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy", function(err, response , data) {

				if (!err && response.statusCode === 200) {
					console.log("Title: " + JSON.parse(data).Title);
					console.log("Date: " + JSON.parse(data).Year)
					console.log("Rating: " + JSON.parse(data).imdbRating);
					console.log("Rotten Tomatoes Rating: " + JSON.parse(data).Ratings[1].Value);
					console.log("Locations: " + JSON.parse(data).Country);
					console.log("Language: " + JSON.parse(data).Language);
					console.log("Plot: " + JSON.parse(data).Plot);
					console.log("Actors: " + JSON.parse(data).Actors);
				}

			});

		}
	}

if (action == "my-tweets"){

	twitterSearch();

} else if (action == 'spotify-this-song') {

	spotifySearch(process.argv.slice(3).join(" "));

} else if (action == 'movie-this') {

	movieSearch(process.argv.slice(3).join(" "));

} else if (action == 'do-what-it-says') {

	fs.readFile("random.txt", "utf8", function(err, data) {
		if (!err) {
			var dataArr = data.split(",");
			if (dataArr[0] == "spotify-this-song") {
				spotifySearch(dataArr[1]);
			}
		}
	});

}
