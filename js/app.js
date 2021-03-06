"use strict";
/*** Model ***/
/* Locations variable storing all the data from the locations to be shown */
var initialLocations = [
    {title: "Minyons de Terrassa", category: "Local Culture", location: {lat : 41.564611,lng : 2.012825}, address: "Carrer del Teatre, 4-6, 08221 Terrassa, Barcelona", FSVenueId: "4ce5a6f6595cb1f7f593b714"},
    {title: "Biblioteca Central", category: "Library", location: {lat: 41.569068, lng: 2.009941}, address: "Passeig de les Lletres, 1, 08221 Terrassa, Barcelona", FSVenueId: "4bbf634b98f49521cc90d263"},
    {title: "FGC Rambla", category: "Transport", location: {lat: 41.560306, lng: 2.007727}, address: "Plaça de Parc dels Catalans, 98, 08221 Terrassa, Barcelona", FSVenueId: "4be8f711ee96c9283db9febf"},
    {title: "MNACTec", category: "Museum", location: {lat: 41.565395, lng: 2.007131}, address: "Rambla d'Ègara, 270, 08221 Terrassa, Barcelona", FSVenueId: "50c32304e4b0309a63ec38e5"},
    {title: "RENFE Estació del Nord", category: "Transport", location: {lat: 41.569748, lng: 2.014265}, address: "Plaça Estació del Nord, 08221 Terrassa, Barcelona", FSVenueId: "4b6bcd3cf964a520fc182ce3"},
    {title: "Anytime Fitness", category: "Gym", location: {lat: 41.570042, lng: 2.004469}, address: "Avinguda de Josep Tarradellas, 2, 08225 Terrassa, Barcelona", FSVenueId: "568edd57498ee9de014b6a1b"},
    {title: "Qsport", category: "Gym", location: {lat: 41.5688617, lng: 2.0067464}, address: "Carrer de Sant Gaietà, 107, 08221 Terrassa, Barcelona", FSVenueId: "4bb2357a715eef3bf0e984bb"}
];

/* Categories related to locations so they can be filtered */
var initialCategories = [
    {id: 0, title: "All"},
    {id: 1, title: "Local Culture"},
    {id: 2, title: "Library"},
    {id: 3, title: "Museum"},
    {id: 4, title: "Transport"},
    {id: 5, title: "Gym"}
];

/* Creating a location that it's used in the ViewModel to build locations array */
var Location = function(data) {
    this.title = data.title;
    this.category = data.category;
    this.lat = data.location.lat;
    this.lng = data.location.lng;
    this.address = data.address;
    this.marker = data.location.marker;
    this.FSVenueId = data.FSVenueId;
};

/* Creating a category that can be used in the ViewModel to build categories array */
var Category = function(data) {
    this.id = data.id;
    this.title = data.title;
};


/*** ViewModel ***/
var ViewModel = function() {
    var self = this;

    // initialize location listing as an observable Array
    this.locationList = ko.observableArray([]);

    /* Populating location listing with data from the model */
    initialLocations.forEach(function(locationItem) {
        self.locationList.push( new Location(locationItem) );
    });

    // initialize categories listing as an observable array
    this.categoriesList = ko.observableArray([]);

    /* Populating categories listing with data from the model */
    initialCategories.forEach(function(categoryItem) {
        self.categoriesList.push( new Category(categoryItem) );
    });

    /* Setting a location List based on the category clicked on the DOM
       It hides all the markers, builds a new marker list depending on the 
       category clicked and uses the view to show them again */
    this.setLocationList = function(clickedLocation) {
        // Removing all the markers from the map
        hideListings();
        
        // Removing all the elements from the location List so it can be populated again by the ones that have the same category as clicked
        self.locationList.removeAll();

        // Creating a marker array to show the markers again calling the show listings function
        var markerList = [];
        
        // Populating again the locationList
        initialLocations.forEach(function(locationItem) {
            if (clickedLocation.title == "All"){
                self.locationList.push( new Location(locationItem) );
                markerList.push(locationItem);
            }else if (locationItem.category == clickedLocation.title) {
                self.locationList.push( new Location(locationItem) );
                markerList.push(locationItem);
            }
        });

        // Showing Markers again
        showListings(markerList);
    };

    /* Calls the open Infowindow function from the view and passes the name of the clicked location */
    this.openSelectedInfoWindow = function(clickedLocation) {
        openInfoWindow(clickedLocation.title);
        
        //markers[markerList[i].index].infowindow.open();
        //console.log(markers[markerList[i].index].infowindow);
    }
};


/*** View ***/
/** API interaction **/
/* Initialize the map variables */
var map;
var markers = [];
var infoWindow;
var index;

/* Building the Google Maps Map and it's properties with cusom styles, markers and infowindow.
   Using Foursquare API to show a picture of the location. There's an error handling for this
   API because it has a limit of 50 requests per day, so it shows a text in the Infowindow when
   the treshold is passed or if there's any other error in the call. */
function initMap() {
    // variable declarating where the center of the map will be and for use with markers
    var terrassa = {lat: 41.564432, lng: 2.010869};

    // variable declaring map styles
    var styles = [
        {
           "featureType": "landscape.natural",
            "elementType": "geometry.fill",
            "stylers": [
                {
                    "visibility": "on"
                },
                {
                    "color": "#e0efef"
                }
            ]
        },
        {
            "featureType": "poi",
            "elementType": "geometry.fill",
            "stylers": [
                {
                    "visibility": "on"
                },
                {
                    "hue": "#1900ff"
                },
                {
                    "color": "#c0e8e8"
                }
            ]
        },
        {
            "featureType": "road",
            "elementType": "geometry",
            "stylers": [
                {
                    "lightness": 100
                },
                {
                    "visibility": "simplified"
                }
            ]
        },
        {
            "featureType": "road",
            "elementType": "labels",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "transit.line",
            "elementType": "geometry",
            "stylers": [
                {
                    "visibility": "on"
                },
                {
                    "lightness": 700
                }
            ]
        },
        {
            "featureType": "water",
            "elementType": "all",
            "stylers": [
                {

                    "color": "#7dcdcd"
                }
            ]
        }
    ];

    /* Constructor creates a new map - only center and zoom are required. */
    map = new google.maps.Map(document.getElementById('map'), {
        center: terrassa,
        zoom: 15,
        styles: styles,
        mapTypeControl: false
    });

    // Declaring google infoWindow
    infoWindow = new google.maps.InfoWindow();

    /* Creating a Marker for each location in the model with Infowindow,
       calling callFoursquare Function to be able to use i variable inside for */
    for(var i = 0; i < initialLocations.length; i++) {
        /* Calling callFoursquareAPI function passing i variable to edit description 
           and create each marker properties on load */
        callFoursquareAPI(i);
    }
}

function callFoursquareAPI(i) {
    /* Calling jQUery ajax to get API GET result to json object so it can use the result to
       populate description in each one of initialLocations */
    $.ajax({
        url: "https://api.foursquare.com/v2/venues/" + initialLocations[i].FSVenueId + "/?client_id=F0MVBVM3VWYUUU1E2I1NHV2C4JXPSD5Y3ALTR2FFVTK04O2B&client_secret=VGBYLZYS12FN5UQ0JGIJKFDYSI14QDZ3I5B5F2CTHCYDAA2O&v=20180724",

        type: "GET",

        dataType: "json",

        /* If an error occurs while doing API request this is the part that will execute */
        error: (function(jqXHR, textStatus, errorThrown) {
            // If the error result is 4 it means that API quota has been exceeded, inform to the user using the marker
            if (jqXHR.readyState == 4) {
                initialLocations[i].description = "<div class='alert alert-danger'>Error: Foursquare API requests quota exceeded.</div>";
                // Calling initialize Marker so it can be fullfilled with this description
                initializeMarker(i);
            // Otherwise, inform with an connection error to the Foursquare API
            } else {
                initialLocations[i].description = "<div class='alert alert-danger'>Error: Foursquare API not reached. <p> Please check connection with: <p> https://api.foursquare.com</div>";
                // Calling initialize Marker so it can be fullfilled with this description
                initializeMarker(i);
            };
        }),

        /* If the GET request is success this part will be executed */
        success: (function(i, data) {
            // Populate the initialLocations description with picture URL at Foursquare
            initialLocations[i].description = "<img src=" + data.response.venue.bestPhoto.prefix + "200x200" + data.response.venue.bestPhoto.suffix + ">";
            // Calling initialize Marker so it can be fullfilled with this description
            initializeMarker(i);
            
        }).bind(null, i)
    });
}

/* This function initializes each marker so it can contain all the information necessary to handle them */
function initializeMarker(i) {

    var marker = new google.maps.Marker({
        id: i,
        address: initialLocations[i].address,
        position: initialLocations[i].location,
        category: initialLocations[i].category,
        title: initialLocations[i].title,
        description: initialLocations[i].description,
        map: map,
        infowindow: infoWindow,
        animation: google.maps.Animation.DROP
    });

    // Push the created marker to the markers array and add marker's index as a property inside each location in the model
    initialLocations[i].index = markers.push(marker) - 1;


    // Create an onClick event for each marker
    marker.addListener('click', function() {
        populateInfoWindow(this, infoWindow);
        if (marker.getAnimation() !== null) {
            marker.setAnimation(null);
        } else {
            marker.setAnimation(google.maps.Animation.BOUNCE);
            setTimeout(function(){ marker.setAnimation(null); }, 750);
        }
    });
}

/* This function populates the infowindow when the marker is clicked. We'll only allow
   one infowindow which will open at the marker that is clicked, and populate based
   on that markers position. */
function populateInfoWindow(marker, infowindow) {
    // Check to make sure the infowindow is not already opened on this marker.
    if (infowindow.marker != marker) {
        infowindow.marker = marker;
        infowindow.setContent('<h3>' + marker.title + '</h3>'+ '<div>' + marker.category + '</div>' + '<div>' + marker.address + '</div>' + marker.description);
        infowindow.open(map, marker);
       
        // Make sure the marker property is cleared if the infowindow is closed.
        infowindow.addListener('closeclick', function() {
            infowindow.marker = null;
        });
    } else {
        infowindow.open(map, marker);
    }
}

/* This function is showing the infowindow related to the selected marker provided by the ViewModel*/
function openInfoWindow(markerName) {
    for (var i =0; i < markers.length; i++) {
        if (markers[i].title == markerName){
            var selectedMarker = markers[i];
            populateInfoWindow(selectedMarker, selectedMarker.infowindow);
            if (selectedMarker.getAnimation() !== null) {
                selectedMarker.setAnimation(null);
            } else {
                selectedMarker.setAnimation(google.maps.Animation.BOUNCE);
                setTimeout(function(){ selectedMarker.setAnimation(null); }, 750);
            }
        }
    }
}

/* This function will loop through the markers array and display them all. */
function showListings(markerList) {
    // Showing again all the markers provided
    for (var i = 0; i < markerList.length; i++) {
        // The index of the markerList is the index on the markers array, and it can be showed again by setting the property setVisible to true
        markers[markerList[i].index].setVisible(true);
    }
}

/* This function loops through the listings and hide them all. */
function hideListings() {
    for (var i = 0; i < markers.length; i++) {
        // Setting the marker visibility to false
        markers[i].setVisible(false);
        markers[i].infowindow.close();
    }
}

/* Don't know how to habdle the toggle menu, I did it on the classical way outside of Knockout */
$("#menu-toggle").click(function(e) {
    e.preventDefault();
    $("#wrapper").toggleClass("toggled");
});

/* Google Maps error handling, showing error message */
function onMapError() {
    $(".onMapError").show();
}

/* Initializes the ViewModel  */
ko.applyBindings(new ViewModel());