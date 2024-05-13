var totalScore = 0;
var vorigeLocatie = null;
var maxLocaties = 5; // Maximaal aantal te bezoeken locaties
var locatieNummer = 0; // Houdt het aantal bezochte locaties bij

function initMap() {
    var locations = [
        { name: 'London', coords: [51.509865, -0.118092] },
        { name: 'Paris', coords: [48.8566, 2.3522] },
        { name: 'Brussels', coords: [50.8503, 4.3517] },
        { name: 'Berlin', coords: [52.492245, 13.372162] },
        { name: 'Amsterdam', coords: [52.330383, 4.9034409] },
        { name: 'Rome', coords: [41.870727, 12.49619] }
    ];

    // Eerste kaart   
    var map1 = L.map('map1', {
        maxZoom: 13,
        minZoom: 13,
        dragging: false,
        zoomControl: false // Verwijder de zoombediening
    });

    var nieuweLocatie = getRandomLocation(locations);
    map1.setView(nieuweLocatie.coords, 13);

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

        locatieNummer++; // Update de teller voor bezochte locaties
        document.getElementById('aantalLocaties').innerHTML = 'Locatie: ' + locatieNummer + '/' + maxLocaties; // Toon het aantal bezochte locaties

        if (locatieNummer >= maxLocaties) {
            document.getElementById('nextButton').style.display = 'none'; // Verberg de knop als het maximaal aantal locaties is bereikt
            document.getElementById('endGameBox').style.display = 'block'; // Toon de endGameBox
            document.getElementById('finalScore').innerHTML = totalScore;
        }
        else {
            var nieuweLocatie = getRandomLocation(locations);
            while (nieuweLocatie.name === vorigeLocatie) {
                nieuweLocatie = getRandomLocation(locations);
            }

            vorigeLocatie = nieuweLocatie.name;
            map1.setView(nieuweLocatie.coords, 13);
        }
        
    });
}

function getRandomLocation(locations) {
    var randomIndex = Math.floor(Math.random() * locations.length);
    return locations[randomIndex];
}

function calculateDistance(latlng1, latlng2) {
    var distance = latlng1.distanceTo(latlng2);
    var distanceInKm = distance / 1000;
    return distanceInKm.toFixed(2);
}

function calculateScore(distance) {
    var maxScore = 100;
    var maxDistanceForPoints = 300;

    if (distance <= maxDistanceForPoints) {
        var score = maxScore * (1 - distance / maxDistanceForPoints);
        return Math.round(score);
    } else {
        return 0;
    }
}

window.onload = initMap;
