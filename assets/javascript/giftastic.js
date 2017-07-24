$(document).ready(function() {

	var gifButtons = ["meme", "Reactions", "Bruce Lee"];
	const APIKEY = "3703fe99db3742bf9c7915cad1d54adc";

	var renderGifButtons = function() {
		$("#gif-buttons").empty();
		for (var i = 0; i < gifButtons.length; i++) {
			var button = $("<button type=\"button\" class=\"gif-btns btn btn-primary\">").attr("data-name", gifButtons[i]).text(gifButtons[i]);
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

	var ajaxCall = function(queryURL) {
		$.ajax({
			url: queryURL,
			method: "GET"
		}).done(function(response) {
			var result = response.data;
			var $grid = $('.grid').masonry({
				itemSelector: '.grid-item',
				columnWidth: 200,
				gutter: 10,
				fitWidth: true
			});
			for (var i = 0; i < result.length; i++) {
				var gifItem = $("<div class=\"grid-item\">");

				var gif = $("<img class=\"gif\">").attr("src", result[i].images.fixed_width_still.url).attr("data-status", "still");
				gif.attr("data-still", result[i].images.fixed_width_still.url);
				gif.attr("data-animate", result[i].images.fixed_width.url);

				var rating = $("<p>").text("Rating: " + result[i].rating);

				gifItem.append(gif);
				gifItem.append(rating);
				$("#gif-container").append(gifItem).masonry( 'appended', gifItem );;
			}

			$grid.imagesLoaded().progress( function() {
				$grid.masonry('layout');
			});
		});
	}

	var renderSearchGifs = function(input) {
		$("#gif-container").empty();
		var queryURL = "https://api.giphy.com/v1/gifs/";
		queryURL += 'search?' + $.param({
			'api_key': APIKEY,
			'q' : input
		});

		ajaxCall(queryURL);
	}

	$("#search-submit").on("click", function(event) {
		event.preventDefault();
		input = $("#search-input").val().trim();
		gifButtons.push(input);
		renderGifButtons();
		renderSearchGifs(input);
	});

	$(document).on("click", ".gif", toggleAnimation);

	$(document).on("click", "#trending", function () {
		$("#gif-container").empty();
		var queryURL = "https://api.giphy.com/v1/gifs/";
		queryURL += 'trending?' + $.param({
			'api_key': APIKEY
		});

		ajaxCall(queryURL);
	});

	$(document).on("click", ".gif-btns", function () {
		var input = $(this).attr("data-name");
		renderSearchGifs(input);
	});

	renderGifButtons();
});