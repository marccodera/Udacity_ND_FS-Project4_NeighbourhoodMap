/** Model **/
var initialLocations = [
    {title: "Minyons de Terrassa", category: "Local Culture", location: {lat : 41.564611,lng : 2.012825}, address: "Carrer del Teatre, 4-6, 08221 Terrassa, Barcelona", IgLocationId: 7857882},
    {title: "Biblioteca Central", category: "Library", location: {lat: 41.569068, lng: 2.009941}, address: "Passeig de les Lletres, 1, 08221 Terrassa, Barcelona", IgLocationId: 279763804},
    {title: "Hospital Mutua de Terrassa", category: "Hospital", location: {lat: 41.564225, lng: 2.0143027}, address: "Plaça del Doctor Robert, 5, 08221 Terrassa, Barcelona", IgLocationId: 1692770984311166},
    {title: "MNACTec", category: "Museum", location: {lat: 41.565395, lng: 2.007131}, address: "Rambla d'Ègara, 270, 08221 Terrassa, Barcelona", IgLocationId: 769808843179516},
    {title: "RENFE Estació del Nord", category: "Transport", location: {lat: 41.569748, lng: 2.014265}, address: "Plaça Estació del Nord, 08221 Terrassa, Barcelona", IgLocationId: 239465053074271},
    {title: "Anytime Fitness", category: "Gym", location: {lat: 41.570042, lng: 2.004469}, address: "Avinguda de Josep Tarradellas, 2, 08225 Terrassa, Barcelona", IgLocationId: 1024420731},
    {title: "Qsport", category: "Gym", location: {lat: 41.5688617, lng: 2.0067464}, address: "Carrer de Sant Gaietà, 107, 08221 Terrassa, Barcelona", IgLocationId: 468202}
]

var initialCategories = [
    {id: 1, title: "Local Culture"},
    {id: 2, title: "Library"},
    {id: 3, title: "Hospital"},
    {id: 4, title: "Museum"},
    {id: 5, title: "Transport"},
    {id: 6, title: "Gym"},
]


var Location = function(data) {
    this.title = data.title;
    this.category = data.category;
    this.lat = data.location.lat;
    this.lng = data.location.lng;
    this.address = data.address;
    this.marker = data.location.marker;
    this.IgLocationId = data.IgLocationId;
}


var Category = function(data) {
    this.id = data.id;
    this.title = data.title;
}


/** ViewModel **/
var ViewModel = function() {
    var self = this;

    // initialize location listing
    this.locationList = ko.observableArray([]);

    // populating location listing with data from the model
    initialLocations.forEach(function(locationItem) {
        self.locationList.push( new Location(locationItem) );
    });

    // initialize categories listing
    this.categoriesList = ko.observableArray([]);

    // populating categories listing with data from the model
    initialCategories.forEach(function(categoryItem) {
        self.categoriesList.push( new Category(categoryItem) );
    });

    // Setting a location List based on the category clicked on the DOM
    this.setLocationList = function(clickedLocation) {
        // Removing all the markers from the map
        hideListings();
        
        // Removing all the elements from the location List so it can be populated again by the ones that have the same category as clicked
        self.locationList.removeAll();

        // Creating a marker array to show the markers again calling the show listings function
        markerList = [];
        
        // Populating again the locationList
        initialLocations.forEach(function(locationItem) {
            if (locationItem.category == clickedLocation.title) {
                self.locationList.push( new Location(locationItem) );
                markerList.push(locationItem);
            }
        });

        // Showing Markers again
        showListings(markerList);

    }

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
        // Instagram API Key: 9e7d6563f18a495ab49a6b8b5d255069
        // instagram GET URL: https://api.instagram.com/v1/locations/7857882?access_token=9e7d6563f18a495ab49a6b8b5d255069

        // Creating marker with information from the model and from the instagram API
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
        infowindow.setContent('<h3>' + marker.title + '</h3>'+ '<div>' + marker.category + '</div>' + '<div>' + marker.address + '</div>');
        infowindow.open(map, marker);
        // Make sure the marker property is cleared if the infowindow is closed.
        infowindow.addListener('closeclick', function() {
            infowindow.marker = null;
        });
    }
}

// This function will loop through the markers array and display them all.
function showListings(markerList) {
    // Showing again all the markers provided
    for (var i = 0; i < markerList.length; i++) {
        // The index of the markerList is the index on the markers array, and it can be showed again by setting the map
        markers[markerList[i].index].setMap(map);
    }
}

// This function will loop through the listings and hide them all.
function hideListings() {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
}

/** View **/
ko.applyBindings(new ViewModel());