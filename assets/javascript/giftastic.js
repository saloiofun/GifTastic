$(document).ready(function() {

	var gifButtons = ["Luke Skywalker", "Yoda", "Boba Fett", "Chewbacca"];
	var btnsTypes = ["btn-primary", "btn-secondary", "btn-success", "btn-info", "btn-warning", "btn-danger"]
	const APIKEY = "3703fe99db3742bf9c7915cad1d54adc";

	var renderGifButtons = function() {
		$("#gif-buttons").empty();

		for (var i = 0; i < gifButtons.length; i++) {
			var index = Math.floor((Math.random() * btnsTypes.length));
			var button = $("<button type=\"button\" class=\"btn " + btnsTypes[index] + " gif-btns\">").attr("data-name", gifButtons[i]).text(gifButtons[i]);
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
				var gifItem = $("<div class=\"grid-item text-right\">");

				var gif = $("<img class=\"gif\">").attr("src", result[i].images.fixed_width_still.url).attr("data-status", "still");
				gif.attr("data-still", result[i].images.fixed_width_still.url);
				gif.attr("data-animate", result[i].images.fixed_width.url);

				var rating = $("<span class=\"badge badge-default\">Rating: " + "<span class=\"text-uppercase\">" + result[i].rating + "</span></span>");

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

	var renderTrending = function() {
		$("#page-header").html("<h1 class=\"h-title\">Trending Now</h1>");
		$("#gif-container").empty();
		var queryURL = "https://api.giphy.com/v1/gifs/";
		queryURL += 'trending?' + $.param({
			'api_key': APIKEY
		});

		ajaxCall(queryURL);
	}

	$("#search-submit").on("click", function(event) {
		event.preventDefault();
		input = $("#search-input").val().trim();
		if (input) {
			gifButtons.push(input);
			renderGifButtons();
			renderSearchGifs(input);
		} else {
			renderTrending();
		}

	});

	$(document).on("click", ".gif", toggleAnimation);

	$(document).on("click", "#trending", renderTrending);

	$(document).on("click", "#reactions", function() {
		$("#page-header").html("<h1 class=\"h-title\">Reactions</h1>");
		renderSearchGifs("Reactions");
	});

	$(document).on("click", "#entertainment", function() {
		$("#page-header").html("<h1 class=\"h-title\">Entertainment</h1>");
		renderSearchGifs("Entertainments gifs");
	});

	$(document).on("click", "#memes", function() {
		$("#page-header").html("<h1 class=\"h-title\">Memes</h1>");
		renderSearchGifs("Memes");
	});

	$(document).on("click", ".gif-btns", function() {
		var input = $(this).attr("data-name");
		$("#page-header").html("<h1 class=\"h-title text-capitalize\">" + input + "</h1>");
		renderSearchGifs(input);
	});

	$(function () {
		$('[data-toggle="tooltip"]').tooltip()
	})

	renderGifButtons();

	renderTrending();
});