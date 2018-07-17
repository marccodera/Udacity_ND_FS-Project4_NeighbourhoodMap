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
        center: {lat: 41.5621635, lng: 2.0127137},
        zoom: 13
    });
    var terrassa = {lat: 41.564432, lng: 2.010869};
    var marker = new google.maps.Marker({
        position: terrassa,
        map: map,
        title: 'First Marker!'
    });
}

ko.applyBindings(new ViewModel(map));