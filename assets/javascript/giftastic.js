$(document).ready(function() {

	var gifButtons = ["meme", "Reactions", "Bruce Lee"];

	var renderGifButtons = function() {
		$("#gif-buttons").empty();
		for (var i = 0; i < gifButtons.length; i++) {
			var button = $("<button class=\"gif-btns\">").attr("data-name", gifButtons[i]).text(gifButtons[i]);
			$("#gif-buttons").append(button);
		}
	}

	var toggleAnimation = function() {
		var status = $(this).attr("data-status");
		if (status === "still") { 
			$(this).attr("src", $(this).attr("data-animate")) 
			$(this).attr("data-status", "animate");
		} else {
			$(this).attr("src", $(this).attr("data-still")) 
			$(this).attr("data-status", "still");
		}
	}

	var renderGifs = function(input) {
		$("#gif-container").empty();
		var apiKey = "3703fe99db3742bf9c7915cad1d54adc";
		var queryURL = "http://api.giphy.com/v1/gifs/";
		queryURL += 'search?' + $.param({
			'api_key': apiKey,
			'q' : input
		});

		$.ajax({
			url: queryURL,
			method: "GET"
		}).done(function(response) {
			var result = response.data;
			for (var i = 0; i < 5; i++) {
				var gifContainer = $("<div class=\"gif-container\">");

				var gif = $("<img class=\"gif\">").attr("src", result[i].images.fixed_width_still.url).attr("data-status", "still");
				gif.attr("data-still", result[i].images.fixed_width_still.url);
				gif.attr("data-animate", result[i].images.fixed_width.url);

				var rating = $("<p>").text("Rating: " + result[i].rating);

				gifContainer.append(gif);
				gifContainer.append(rating);
				$("#gif-container").append(gifContainer);
			}
		});
	}

	$("#search-submit").on("click", function(event) {
		event.preventDefault();
		input = $("#search-input").val().trim();
		gifButtons.push(input);
		renderGifButtons();
		renderGifs(input);
	});

	$(document).on("click", ".gif", toggleAnimation);

	$(document).on("click", ".gif-btns", function () {
		var input = $(this).attr("data-name");
		renderGifs(input);
	});

	renderGifButtons();

});