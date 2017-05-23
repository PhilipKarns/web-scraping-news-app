//when user hits the Scrape New Articles button
$("#scrape-articles").on("click", function() {
	$.get("/scrape").done(function() {
	$.getJSON("/articles", function(data) {
		console.log(data);
		//empty results section and set to show
		if(data.length !== 0) {
			    $("#articles").empty();
			    $("#articles").show();		
			for (var i = 0; i < data.length; i++) {
				//display the information in the results section			
				$("#articles").append("<div><p data-id='" + data[i]._id + "'>Title: " + data[i].title + "<br>" + "Link: " + data[i].link + "</p>" +
				"<br>" + "<button id='save-article' type='submit'>" + "Save Article" + "</button><div>");

			};//for
		};//if
		alert("You have scraped " + data.length + " articles");
	});//json
	});//scrape-done
});

// $("save-article").on("click", function() {
// 	varthisId = $(this).attr("data-id");

// });//save

// $(document).on("click", "p", function() {
// 	//empty the notes
// 	$("#notes").empty();
// 	//save id from p tag
// 	var thisId = $(this).attr("data-id");

// 	//ajax call for the article
// 	$.ajax({
// 		method: "GET",
// 		url: "/articles/" + thisId
// 	})
// 	.done(function(data) {
// 		console.log(data);
		
// 	});

// });//
