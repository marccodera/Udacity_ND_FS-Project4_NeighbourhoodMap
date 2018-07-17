/* Model */
var model = {
    locations: [
        {title: "Minyons de Terrassa",category : "Local Culture",location : {lat : 41.564611,lng : 2.012825}, address: "carrer del teatre, 4-6, 08221 Terrassa, Barcelona"},
        {title: "FGC Estació del Nord", category : "Transport", location: {lat: 41.570202, lng: 2.015314}, address: "Passeig del Vint-i-dos de Juliol, 08226 Terrassa, Barcelona"},
        {title: "FGC Universitat", category : "Transport", location: {lat: 41.563361, lng: 2.018970}, address: "Avinguda de Jacquard, 40, 08222 Terrassa, Barcelona"},
        {title: "FGC Rambla", category : "Transport", location: {lat: 41.560281, lng: 2.007793}, address: "Rambla d'Ègara, 128, 08221 Terrassa, Barcelona"},
        {title: "RENFE Estació del Nord", category : "Transport", location: {lat: 41.569748, lng: 2.014265}, address: "Plaça Estació del Nord, 16/8/2017, 08221 Terrassa, Barcelona"},
        {title: "Esclat Supermarket", category : "Supermarket", location: {lat: 41.570042, lng: 2.004469}, address: "Avinguda de Josep Tarradellas, 2, 08225 Terrassa, Barcelona"}
    ]
};

/* Initialize the viewModel for the Knockoutjs library */
var ViewModel = function() {
    var self = this;

}

/* Initialize the map parameters */
var map;
function initMap() {
    // Constructor creates a new map - only center and zoom are required.
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 41.5621635, lng: 2.0127137},
        zoom: 15,
        mapTypeControl: false
    });
    var terrassa = {lat: 41.564432, lng: 2.010869};

    for(var i = 0; i < model.locations.length; i++) {
        var marker = new google.maps.Marker({
            id: i,
            address: model.locations[i].address,
            position: model.locations[i].location,
            category: model.locations[i].category,
            title: model.locations[i].title,
            map: map,
            animation: google.maps.Animation.DROP
        });
    }
}

ko.applyBindings(new ViewModel());