var Server = function () {
	/**
	 * Obtains parameters from the hash of the URL
	 * @return Object
	 */

	var displayName = 'RECEIPTIFY';
	var dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
	var today = new Date();
	var receiptNum = 0;

	var userProfileSource = document.getElementById('user-profile-template').innerHTML,
		userProfileTemplate = Handlebars.compile(userProfileSource),
		userProfilePlaceholder = document.getElementById('receipt');

	var userPlaylistSource = document.getElementById('user-playlists-template').innerHTML,
		userPlaylistTemplate = Handlebars.compile(userPlaylistSource),
		userPlaylistPlaceholder = document.getElementById('dropdown');

	Handlebars.registerHelper('ifCond', function(value, options) {
		if(value < 10) {
			return options.fn(this);
		}
		return options.inverse(this);
	});

	function getHashParams() {
		var hashParams = {};
		var e,
			r = /([^&;=]+)=?([^&;]*)/g,
			q = window.location.hash.substring(1);
		while ((e = r.exec(q))) {
			hashParams[e[1]] = decodeURIComponent(e[2]);
		}
		return hashParams;
	}

	
	function retrieveArtistSearch(search) {
		$.ajax({
			url: `https://api.spotify.com/v1/search?q=${search}&type=artist`,
			headers: {
				Authorization: 'Bearer ' + access_token
			},
			success: function (response) {
				console.log(search);
				var artistId = "";
				var data = {
					artistName: response.artists.items,
					json: true
				};
				for(var i = 0; i < data.artistName.length; i++) {
					if(data.artistName[i].name == search) {
						artistId = data.artistName[i].id;
					}
				}
				if(artistId !== "") {
					console.log(data.artistName);
					retrieveTopTracks(artistId, search);
				} else {
					console.log("failure");
				}
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				// error handler here
				console.error("Failed to access playlist endpoint");
			}
		});
	}

	function retrieveArtistName(artistId) {
		$.ajax({
			url: `https://api.spotify.com/v1/artists/${artistId}`,
			headers: {
				Authorization: 'Bearer ' + access_token
			},
			success: function (response) {
				console.log(response);
				var data = {
					artistName: response.name,
					json: true
				};
				retrieveTopTracks(artistId, data.artistName);
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				// error handler here
				console.error("Failed to access playlist endpoint");
			}
		});
	}

	function retrieveTopTracks(artistId, artistName) {
		$.ajax({
			url: `https://api.spotify.com/v1/artists/${artistId}/top-tracks?market=ES`,
			headers: {
				Authorization: 'Bearer ' + access_token
			},
			success: function (response) {
				console.log(artistName);
				var itemNumber = 1;
				var data = {
					trackList: response.tracks,
					total: 0,
					date: today.toLocaleDateString('en-US', dateOptions).toUpperCase(),
					json: true
				};
				artistName = artistName.toUpperCase();
				for (var i = 0; i < data.trackList.length; i++) {
					data.trackList[i].name = data.trackList[i].name.toUpperCase();
					data.trackList[i].itemNum = itemNumber;
					data.total += data.trackList[i].duration_ms;
					let minutes = Math.floor(data.trackList[i].duration_ms / 60000);
					let seconds = ((data.trackList[i].duration_ms % 60000) / 1000).toFixed(0);
					data.trackList[i].duration_ms = minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
					for (var j = 0; j < data.trackList[i].artists.length; j++) {
						data.trackList[i].artists[j].name = data.trackList[i].artists[j].name.trim();
						data.trackList[i].artists[j].name = data.trackList[i].artists[j].name.toUpperCase();
						if (j != data.trackList[i].artists.length - 1) {
							data.trackList[i].artists[j].name = data.trackList[i].artists[j].name + ', ';
						}
					}
					itemNumber++;
				}
				minutes = Math.floor(data.total / 60000);
				seconds = ((data.total % 60000) / 1000).toFixed(0);
				receiptNum++;
				data.total = minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
				userProfilePlaceholder.innerHTML = userProfileTemplate({
					title: artistName,
					tracks: data.trackList,
					total: data.total,
					time: data.date,
					num: receiptNum,
					name: displayName,
				});

				document.getElementById('download').addEventListener('click', function () {
					var offScreen = document.querySelector('.receiptContainer');

					window.scrollTo(0, 0);
					// Use clone with htm2canvas and delete clone
					html2canvas(offScreen).then((canvas) => {
						var dataURL = canvas.toDataURL();
						var link = document.createElement('a');
						link.download = `${data.title}_receiptify.png`;
						link.href = dataURL;
						document.body.appendChild(link);
						link.click();
						document.body.removeChild(link);
						delete link;
					});
				});
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				// error handler here
				console.error("Failed to access endpoint");
			}
		});
	}

	var params = getHashParams();

	var access_token = params.access_token,
		refresh_token = params.refresh_token,
		error = params.error;

	if (error) {
		alert('There was an error during the authentication');
	} else {
		if (access_token) {
			$.ajax({
				url: 'https://api.spotify.com/v1/me',
				headers: {
					Authorization: 'Bearer ' + access_token
				},
				success: function (response) {
					displayName = response.display_name.toUpperCase();
					$('#login').hide();
					$('#loggedin').show();
				}
			});
		} else {
			// render initial screen
			$('#login').show();
			$('#loggedin').hide();
		}

		document.getElementById("submit").addEventListener("click", function(){ retrieveArtistSearch(document.getElementById("selection").elements[0].value); });
		// "0TnOYISbd1XYRBk9myaseg" pitbull
		// "6ueGR6SWhUJfvEhqkvMsVs" janelle monae
	}
}();
