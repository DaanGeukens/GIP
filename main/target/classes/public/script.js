var totalScore = 0;
var vorigeLocatie = null;
var maxLocaties = 5; // Maximaal aantal te bezoeken locaties
var locatieNummer = 0; // Houdt het aantal bezochte locaties bij
var playerName = ''
var steden = []
var polyline = null;
var currentMarker = null;

var nieuweLocatie = '';

function startGame() {
	playerName = document.getElementById('playerName').value;
	
	if (playerName.length < 4 || playerName.length > 14) {
        alert("De spelersnaam moet tussen de 4 en 14 tekens lang zijn.");
        return; // Stop de startGame-functie als de naam niet aan de eisen voldoet
    }
    var validCharacters = /^[a-zA-Z0-9]+$/;
    if (!playerName.match(validCharacters)) {
        alert("De spelersnaam mag alleen letters en cijfers bevatten.");
        return; // Stop de startGame-functie als de naam ongeldige tekens bevat
    }
    console.log('Player name: ', playerName)
    
	maxLocaties = parseInt(document.getElementById('roundsInput').value);
    // Verberg het startscherm
    document.getElementById('startScreen').style.display = 'none';
    // Start het spel (bijvoorbeeld door de initMap-functie aan te roepen)
    initMap(); // Je moet initMap implementeren in dit bestand
}

// Voeg event listener toe aan de startGameButton
document.addEventListener('DOMContentLoaded', function () {
    var startGameButton = document.getElementById('startGameButton');
    var settingsButton = document.getElementById('settingsButton');
    var settingsOverlay = document.getElementById('settingsOverlay');
    var closeSettingsButton = document.getElementById('closeSettingsButton');

    startGameButton.addEventListener('click', startGame);
    settingsButton.addEventListener('click', openSettings);
    closeSettingsButton.addEventListener('click', closeSettings);

    function openSettings() {
        settingsOverlay.style.display = 'block';
    }

    function closeSettings() {
        settingsOverlay.style.display = 'none';
    }
});



function initMap() {
	steden = []
	axios.get('http://localhost:8080/steden')
  	.then(function (response) {
	    // handle success
		for (let item of response.data){
			steden.push(item)
		}
	    
		console.log(steden)
		// Eerste kaart   
    var map1 = L.map('map1', {
        maxZoom: 13,
        minZoom: 13,
        dragging: false,
        zoomControl: false // Verwijder de zoombediening
    });
	
	
	
	nieuweLocatie = getRandomLocation();
	
	console.log('Gekozen locatie:', nieuweLocatie)
	 
	 coords = [nieuweLocatie.latitude, nieuweLocatie.longitude]
	
	map1.setView(coords, 13);
//    var nieuweLocatie = getRandomLocation(locations);
//    map1.setView(nieuweLocatie.coords, 13);

    var Esri_WorldImagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
    }).addTo(map1);

    // Tweede kaart
    var map2 = L.map('map2').setView([40, 15], 1);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors'
    }).addTo(map2);

    map2.on('click', function (event) {
        var lat2 = event.latlng.lat; //hoogte coördinaat kaart 2
        var lng2 = event.latlng.lng; //

        console.log('Geklikte coördinaten: ', lat2, lng2);
        var pointOnMap2 = L.latLng(lat2, lng2);

        var lat1 = map1.getCenter().lat;
        var lng1 = map1.getCenter().lng;

		// Tekenen van de rode lijn op kaart
    	var latlngs = [[lat1, lng1], [lat2, lng2]];
//    	var polyline = L.polyline(latlngs, {color: 'red'}).addTo(map2);
        polyline = L.polyline(latlngs, {
    	color: 'red',   // Kleur van de lijn
    	weight: 3,      // Dikte van de lijn
    	opacity: 0.7,   // Ondoorzichtigheid van de lijn
    	dashArray: '3, 5'  // Stippelpatroon (bijvoorbeeld '5, 10' voor een gestippelde lijn)
	}).addTo(map2);
        
        if (currentMarker) {
			map2.removeLayer(currentMarker);
		}
        currentMarker = L.marker([lat1, lng1]).addTo(map2);
        
        var pointOnMap2 = L.latLng(lat2, lng2);
        var centerOfMap1 = L.latLng(lat1, lng1);
        var distance = calculateDistance(centerOfMap1, pointOnMap2);

		
        document.getElementById('distance').innerHTML = 'Afstand tot stad: ' + distance + ' km';
        var currentRoundScore = calculateScore(distance);
        document.getElementById('score').innerHTML = 'Score deze ronde: ' + currentRoundScore + ' punten';
        
        totalScore += currentRoundScore;
        document.getElementById('totalScore').innerHTML = 'Totale score: ' + totalScore + ' punten';
        
        if (locatieNummer < maxLocaties) {
            document.getElementById('nextButton').style.display = 'block';
        }
    });

	
    document.getElementById('nextButton').addEventListener('click', function () {
        this.style.display = 'none';
//      hieronder voor rode lijn te verwijderen wanneer je op volgende ronde button klikt
	if (polyline) {
		map2.removeLayer(polyline);
		polyline = null;
	}
	if (currentMarker) {
		map2.removeLayer(currentMarker);
		currentMarker = null;
	}
        locatieNummer++; // Update de teller voor bezochte locaties
        
        //vorige locatie in box
//        console.log('test: ', nieuweLocatie)
        document.getElementById('vorigelocatie').innerHTML = 'Vorige locatie was: ' + nieuweLocatie.name
        
        document.getElementById('aantalLocaties').innerHTML = 'Ronde: ' + locatieNummer + '/' + maxLocaties; // Toon het aantal bezochte locaties

        if (locatieNummer >= maxLocaties) {
            document.getElementById('nextButton').style.display = 'none'; // Verberg de knop als het maximaal aantal locaties is bereikt
            document.getElementById('endGameBox').style.display = 'block'; // Toon de endGameBox
            document.getElementById('finalScore').innerHTML = totalScore;
            slaNaamOp(maxLocaties, playerName , totalScore);
        }
        else {
            nieuweLocatie = getRandomLocation(steden);
            while (nieuweLocatie.name === vorigeLocatie) {
                nieuweLocatie = getRandomLocation();
            }
            console.log("Nieuwe locatie: ", nieuweLocatie)

            vorigeLocatie = nieuweLocatie.name;
            map1.setView([nieuweLocatie.latitude, nieuweLocatie.longitude], 13);
        }
        
    });	
	  })
	  .catch(function (error) {
	    // handle error
	    console.log(error);
	  })
	  .then(function () {
	    // always executed
	  });
	

function slaNaamOp(rondealsparameter ,naamalsparameter, scorealsparameter){
	axios.get('http://localhost:8080/addscore?ronde=' + rondealsparameter + '&naam='+ naamalsparameter + '&score=' + scorealsparameter)
  	.then(function (response) {
		  console.log('naam gestuurd')
		  })
		.catch(function (error) {
	    // handle error
	    console.log(error);
	  })
	  .then(function () {
	    // always executed
	  }); 
}
    
}

function getRandomLocation() {
    var randomIndex = Math.floor(Math.random() * steden.length);
    return steden[randomIndex];
}

function calculateDistance(latlng1, latlng2) {
    var distance = latlng1.distanceTo(latlng2);
    var distanceInKm = distance / 1000;
    return distanceInKm.toFixed(2);
}

function calculateScore(distance) {
    var maxScore = 100;
    var maxDistanceForPoints = 1000;

    if (distance <= maxDistanceForPoints) {
        var score = maxScore * (1 - distance / maxDistanceForPoints);
        return Math.round(score);
    } else {
        return 0;
    }
}

//window.onload = initMap;
window.onload = function() {
    /*fetch('url_naar_je_backend/haal_locaties_op.php') // Vervang 'url_naar_je_backend/haal_locaties_op.php' door de juiste URL
        .then(response => response.json())
        .then(locations => initMap(steden))
        .catch(error => console.error('Error:', error));*/
};
