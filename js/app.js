/** Model **/
var initialLocations = [
        {title: "Minyons de Terrassa",category : "Local Culture",location : {lat : 41.564611,lng : 2.012825}, address: "Carrer del Teatre, 4-6, 08221 Terrassa, Barcelona"},
        {title: "FGC Estació del Nord", category : "Transport", location: {lat: 41.570202, lng: 2.015314}, address: "Passeig del Vint-i-dos de Juliol, 08226 Terrassa, Barcelona"},
        {title: "FGC Universitat", category : "Transport", location: {lat: 41.563361, lng: 2.018970}, address: "Avinguda de Jacquard, 40, 08222 Terrassa, Barcelona"},
        {title: "FGC Rambla", category : "Transport", location: {lat: 41.560281, lng: 2.007793}, address: "Rambla d'Ègara, 128, 08221 Terrassa, Barcelona"},
        {title: "RENFE Estació del Nord", category : "Transport", location: {lat: 41.569748, lng: 2.014265}, address: "Plaça Estació del Nord, 08221 Terrassa, Barcelona"},
        {title: "Esclat Supermarket", category : "Supermarket", location: {lat: 41.570042, lng: 2.004469}, address: "Avinguda de Josep Tarradellas, 2, 08225 Terrassa, Barcelona"}
]

var Location = function(data) {
    this.title = data.title;
    this.lat = data.location.lat;
    this.lng = data.location.lng;
    this.address = data.address;
    this.marker = data.location.marker;
}

/** ViewModel **/
var ViewModel = function() {
    var self = this;

    this.locationList = ko.observableArray([]);

    initialLocations.forEach(function(locationItem) {
        self.locationList.push( new Location(locationItem) );
    });
}

/** API interaction **/
/* Initialize the map variables */
var map;
var markers = [];
var infoWindow;

/* Building the Map and it's properties */
function initMap() {
    // variable declarating where the center of the map will be and for use with markers
    var terrassa = {lat: 41.564432, lng: 2.010869};

    // Constructor creates a new map - only center and zoom are required.
    map = new google.maps.Map(document.getElementById('map'), {
        center: terrassa,
        zoom: 15,
        mapTypeControl: false
    });

    // Declaring google infoWindow
    infoWindow = new google.maps.InfoWindow();

    // Creating a Marker for each location in the model
    for(var i = 0; i < initialLocations.length; i++) {
        var marker = new google.maps.Marker({
            id: i,
            address: initialLocations[i].address,
            position: initialLocations[i].location,
            category: initialLocations[i].category,
            title: initialLocations[i].title,
            map: map,
            animation: google.maps.Animation.DROP
        });

        // Push the created marker to the markers array
        markers.push(marker);

        // Adding marker as a property inside each location in the model
        initialLocations[i].index = i;

        // Create an onClick event for each marker
        marker.addListener('click', function() {
            populateInfoWindow(this, infoWindow);
        });
    }
}

// This function populates the infowindow when the marker is clicked. We'll only allow
// one infowindow which will open at the marker that is clicked, and populate based
// on that markers position.
function populateInfoWindow(marker, infowindow) {
    // Check to make sure the infowindow is not already opened on this marker.
    if (infowindow.marker != marker) {
        infowindow.marker = marker;
        infowindow.setContent('<h3>' + marker.title + '</h3>' + '<div>' + marker.address + '</div>');
        infowindow.open(map, marker);
        // Make sure the marker property is cleared if the infowindow is closed.
        infowindow.addListener('closeclick', function() {
            infowindow.marker = null;
        });
    }
}

// This function will loop through the markers array and display them all.
function showListings() {
    var bounds = new google.maps.LatLngBounds();
    // Extend the boundaries of the map for each marker and display the marker
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
        bounds.extend(markers[i].position);
    }
    map.fitBounds(bounds);
}

// This function will loop through the listings and hide them all.
function hideListings() {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
}

/** View **/
ko.applyBindings(new ViewModel());