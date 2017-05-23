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

$(document).on("click", "p", function() {
	//empty the notes
	//$("#notes").empty();
	//save id from p tag
	var thisId = $(this).attr("data-id");

	//ajax call for the article
	$.ajax({
		method: "GET",
		url: "/articles/" + thisId
	})
	.done(function(data) {
		console.log(data);
		//title of the article
		$("#notes").append("<h2>" + data.title + "</h2>");
		//an input to enter a new note title
		$("#notes").append("<input id='titleinput' name='title'><br>");
		//a textarea to add a new note body
		$("#notes").append("<textarea id='bodyinput' name='body'></textarea><br>");
		//a button to submit a new note, with the id of the article saved to it
		$("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button><br>");
		//Display all notes for that article
      	//for (var i = 0; i < data.note.length; i++) {
      		$("#notes").append("<p> Title: " + data.note.title + "<br>" + "Body: " + data.note.body + "</p>");
      	//}//for
	});//done
});//click

$(document).on("click", "#savenote", function() {
	//grab id associated with article from button
	var thisId = $(this).attr("data-id");

	$.ajax({
		method: "POST",
		url: "/articles/" + thisId,
		data: {
			title: $("#titleinput").val(),
			body: $("#bodyinput").val()
		}//data
	})//ajax
	.done(function(data) {
		console.log(data);
		$("#notes").empty();
	});

	$("#titleinput").val("");
	$("#bodyinput").val("");

});//document
