/* STUDENTS IGNORE THIS FUNCTION
 * All this does is create an initial
 * attendance record if one is not found
 * within localStorage.
 */


/* Initialize the viewModel for the Knockoutjs library */
var ViewModel = function(a) {
}

/* Initialize the map parameters */
var map;
function initMap() {
    // Constructor creates a new map - only center and zoom are required.
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 40.7413549, lng: -73.9980244},
        zoom: 13
    });
}

ko.applyBindings(new ViewModel(map));