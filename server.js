// Dependencies
var express = require("express");
var bodyParser = require("body-parser");
var exphbs = require("express-handlebars");
var mongoose = require("mongoose");
// Requiring our Note and Article models
var Note = require("./models/Note.js");
var Article = require("./models/Article.js");
// Our scraping tools
var request = require("request");
var cheerio = require("cheerio");
// Set mongoose to leverage built in JavaScript ES6 Promises
mongoose.Promise = Promise;


// Initialize Express
var app = express();

// Use body parser with our app
app.use(bodyParser.urlencoded({
  extended: false
}));

// Make public a static dir
app.use(express.static("public"));

// Database configuration with mongoose
mongoose.connect("mongodb://heroku_ldmd2zww:7864n8dgcq76lqrguvrdna3tbb@@ds151431.mlab.com:51431/heroku_8r3btq1p");
var db = mongoose.connection;

// Show any mongoose errors
db.on("error", function(error) {
  console.log("Mongoose Error: ", error);
});

// Once logged in to the db through mongoose, log a success message
db.once("open", function() {
  console.log("Mongoose connection successful.");
});

// //handlebars boilerplate
// app.engine("handlebars", exphbs({ defaultLayout: "main" }));
// app.set("view engine", "handlebars");

//GET request to scrape the NYT website and save the data to the database
app.get("/scrape", function(req, res) {
	request("https://www.nytimes.com/", function(error, response, html) {
		//load the html into cheerio
		var $ = cheerio.load(html);
		//grab every h2 within an article tab and perform the following actions
		$("article h2").each(function(i, element) {
			console.log("The index is: " + i);
			console.log("The element is: " + element);

			//empty result object
			var result = {};

			//add the text of the title and text of each link
			result.title = $(this).children("a").text();
			result.link = $(this).children("a").attr("href");

			//create new article entry with article model
			var entry = new Article(result);
			//db.articles.update({upsert:true})
			//saving entry to the db
			entry.save(function(err, doc) {
				if(err) {
					console.log(err);
				}
				else {
					console.log(doc);
				}//else
			});//entry
		});//each
	});//request
	res.send("Scrape Complete");
});//.get

//get all articles
app.get("/articles", function(req, res) {
	Article.find({}, function(error, found) {
		if(error) {
			console.log(error);
		}
		else {
			res.json(found);
		}
	});//find
});//get

//app.get("/notes")

//get articles by ID
app.get("/articles/:id", function(req, res) {
	Article.findOne({"_id": req.params.id})
	.populate("note")
	.exec(function(error, doc) {
		if(error) {
			console.log(error);
		}
		else {
			res.json(doc);
			console.log(doc);
		}
	});
});

//post note to article by id
app.post("/articles/:id", function (req, res) {
	var newNote = new Note(req.body);
	newNote.save(function(err, doc) {
		if(err) {
			res.send(err);
		}
		else {
			Article.findOneAndUpdate({"_id": req.params.id}, {"note": doc._id}, {upsert:true})
				.exec(function(err, doc) {
					if(err) {
						console.log(err);
					}
					else {
						res.send(doc);
					}
				})//exec
		}//else
	})//save
})//post


// Listen on port 3000
app.listen(3000, function() {
  console.log("App running on port 3000!");
});
