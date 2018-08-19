
var clientId = "UIKQDYA313IBF0K5RSHHIOVRFA03Z2VWM5VPRKGCEU2T35AN";
var clientSecret = "3YWSVZR3RMEU5CFTCYYS3G1TD5N4YY1I2RLBVQFOJLUPCZXR";

var dblocations = [{
    title: 'Park Ave Penthouse',
    location: {
        lat: 40.7713024,
        lng: -73.9632393
    }
}, {
    title: 'Chelsea Loft',
    location: {
        lat: 40.7444883,
        lng: -73.9949465
    }
}, {
    title: 'Union Square Open Floor Plan',
    location: {
        lat: 40.7347062,
        lng: -73.9895759
    }
}, {
    title: 'East Village Hip Studio',
    location: {
        lat: 40.7281777,
        lng: -73.984377
    }
}, {
    title: 'TriBeCa Artsy Bachelor Pad',
    location: {
        lat: 40.7195264,
        lng: -74.0089934
    }
}, {
    title: 'Chinatown Homey Space',
    location: {
        lat: 40.7180628,
        lng: -73.9961237
    }
}];



var markers = [];
var map;
function showMarker(locations) {
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 12,
        center: {
            lat: 40.7413549,
            lng: -73.9980244
        }
    });
    for (var i = 0; i < locations.length; i++) {
        show_location(map, locations[i]);
    }
}
function show_location(map, location) {
    var position = location.location;
    var title = location.title;

    var marker = new google.maps.Marker({
        position: position,
        map: map,
        title: title,
        animation: google.maps.Animation.DROP,
    });
    var content = "";
    // foursquare api and call it
    var placesAPI = "https://api.foursquare.com/v2/venues/search?" +
        "client_id=" + clientId + "&client_secret=" + clientSecret +
        "&v=20180323" + "&limit=1&ll=" + position.lat + "," + position.lng + "&query=" + title;
    var request = $.ajax({
        url: placesAPI,
        method: "GET",
        dataType: "json",
        async: false
    });
    request.done(function (data) {
        var obj = data.response.venues[0];
        if (obj) {
            content += '<p>information about' + title + '</p>' +
                '</br> <p>location :' + obj.location.lat + " , " + obj.location.lat + '</p></br> ' +
                '</br> <p>Adress :' + obj.location.address + '</p></br> ' +
                '</br> <p>country :' + obj.location.country + '</p></br> ';
        }
        else {
            content += '<p>information about' + title + '</p>' +
                '</br> <p>No Informantion about this location yet.</p></br> ';
        }
    });
    request.fail(function () {
        content = 'Fail To Load Data please check palce or this palce not found';
    });
    show_infowindow(marker, content);
    var toggleBounce = new google.maps.Marker();
    google.maps.event.addListener(marker, 'click', (function (marker, toggleBounce) {
        return function () {
            if (marker.getAnimation() !== null) {
                marker.setAnimation(null);
            } else {
                marker.setAnimation(google.maps.Animation.BOUNCE);
            }
        };
    })(marker, toggleBounce));
    // Setting trigger Bounce event marker to call it from the view
}
var ViewModel = function () {
    var self = this;
    self.txt_search = ko.observable("");
    self.locations = ko.observableArray();
    self.location_search = ko.computed(function () {
        var search = self.txt_search().toLowerCase();
        self.locations.removeAll();
        if (!search) {
            dblocations.forEach(function (element) {
                self.locations.push(element);
            });
            showMarker(self.locations());
            return self.locations();
        } else {
            dblocations.forEach(function (element) {
                var titleorg = element.title.toLowerCase();
                if (titleorg.search(search) >= 0) {
                    self.locations.push(element);
                }
            });
            showMarker(self.locations());
            return self.locations();
        }
    });
};
function selectitem(obj) {
    console.log(obj);
    var content = "";
    content += '<p>information about' + obj.title + '</p>' +
        '</br> <p>location :' + obj.location.lat + " , " + obj.location.lat + '</p></br> ' ;

    var marker = new google.maps.Marker({
        position: obj.location,
        map: map,
        title: obj.title,
        animation: google.maps.Animation.DROP,
    });
    var infowindow = new google.maps.InfoWindow();
    infowindow.setContent(content);
    infowindow.open(map, marker);
}
function show_infowindow(marker, content) {
    var infowindow = new google.maps.InfoWindow();
    google.maps.event.addListener(marker, 'click', (function (marker, content, infowindow) {
        return function () {
            infowindow.setContent(content);
            infowindow.open(map, marker);
        };
    })(marker, content, infowindow));
}

function initMap() {
    ko.applyBindings(new ViewModel());
}

myerrorhandler = function () {
    alert("This page cannot be loaded sucessfully.");
};