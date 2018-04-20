// Locations data
var locations = [
    {
        title: 'Georgia Aquarium',
        position: {lat: 33.763333 ,lng: -84.395268 },
        venueId: '44dbbfa8f964a520a0361fe3',
        id: 0
    },
    {
        title: 'CNN Center',
        position: {lat: 33.758028 ,lng: -84.395084 },
        venueId: '43680180f964a52082291fe3',
        id: 1
    },
    {
        title: 'Zoo Atlanta',
        position: {lat: 33.734193 ,lng: -84.372253 },
        venueId: '55545128498e64955f7eff2f',
        id: 2
    },
    {
        title: 'Philips Arena',
        position: {lat: 33.757181267669 ,lng: -84.39642028265698 },
        venueId: '4362bb80f964a5204c291fe3',
        id: 3
    },
    {
        title: 'World of Coca-Cola',
        position: {lat: 33.76288 ,lng: -84.392681 },
        venueId: '4a49624ff964a5203fab1fe3',
        id: 4
    },
    {
        title: 'Centenial Olympic Park',
        position: {lat: 33.760383 ,lng: -84.393539 },
        venueId: '4a05d34ef964a52083721fe3',
        id: 5
    },
    {
        title: 'Georgia Institute of Technology',
        position: {lat: 33.775652 ,lng: -84.396286 },
        venueId: '4ab2b4c3f964a520f26b20e3',
        id: 6
    },
    {
        title: 'Martin Luther King Jr. Historical Park',
        position: {lat: 33.756351 ,lng: -84.373455 },
        venueId: '4bba235f3db7b7137ff2229a',
        id: 7
    }
]

// Foursquare api data
forsquareUrl = 'https://api.foursquare.com/v2/venues/';
clientId ='AU1HKMEIUF0ORWNCGQ0B4BPAG5ZYTGNC3RCC1KRI3Q51ULL4';
clientSecret ='GUAWICBPSYJK5UAEI1X3BA1W24ZAV2QKIWBVMX0EWNG1GCJT';
version ='20171013';

// global variables
var map;
var markers =[];
var marker;


// Function to initialize a map and markers
var initMap = function(){
    map = new google.maps.Map(document.getElementById('map'), {
           center: {lat: 33.753746, lng: -84.386330},
           zoom: 14,
           mapTypeControl: false
    });
    // bounds
    var bounds = new google.maps.LatLngBounds();
    for(var i=0; i< markers.length; i++){
        marker = markers[i];
        marker.setMap(map);
        bounds.extend(marker.position);
    }
    map.fitBounds(bounds);
};


// location model
var Location = function(locationData){
    this.title = ko.observable(locationData.title);
    this.position = ko.observable(locationData.position);
    this.venueId = ko.observable(locationData.venueId);
    this.id = ko.observable(locationData.id);
}


// ViewModel
var ViewModel = function(){
    var self = this;

    // Creating locationList to hold list of locations
    self.locationList = ko.observableArray([]);
    // Pushing each location element into locationList
    locations.forEach(function(locationItem){
        var locationItem = new Location(locationItem);
        self.locationList.push(locationItem);
        // Creating marker for each location and pushing it into markers array
        marker = new google.maps.Marker({
                      title: locationItem.title(),
                      position: locationItem.position(),
                      animation: google.maps.Animation.DROP
        });
        markers.push(marker);
    });

    // Creating infowindow object
    var infowindowForMarker = new google.maps.InfoWindow();

    // Creating selectedLocation observable
    self.selectedLocation = ko.observable();
    // Function to open infowindow on a marker of selected list item
    self.openMarkerForLocation = function(locationItem){
        self.selectedLocation(locationItem);
        var markerId = self.selectedLocation().id();
        var selectedMarker = markers[markerId];
        openInfoWindow(map, selectedMarker, infowindowForMarker);
    };

    // Creating filterText observable
    self.filterText = ko.observable("");
    // Function to filter list and markers
    self.showFilteredLocations = function(){
        var filterText= self.filterText();
        self.locationList.removeAll();
        locations.forEach(function(locationItem){
            var locationItem = new Location(locationItem);
            var locationTitle = locationItem.title();
            var locationTitleLower = locationTitle.toLowerCase();
            if(locationTitle.includes(filterText) ||
                locationTitleLower.includes(filterText)){
                self.locationList.push(locationItem);
            }
            else{
                showFilteredMarker(locationItem.id());
            }
        });
    };

    // Function to reset list and markers
    self.resetLocations = function(){
        self.filterText("");
        self.locationList.removeAll();
        locations.forEach(function(locationItem){
            var locationItem = new Location(locationItem);
            self.locationList.push(locationItem);
            resetMarker(locationItem.id());
        });
        resetInfoWindows(infowindowForMarker);
    };

    // Setting markers data
    for(var i=0; i< markers.length; i++){
        marker = markers[i];
        marker.set("markerId",i);
        marker.addListener('click', function(){
            openInfoWindow(map, this, infowindowForMarker);
        });
    }
}


// Function to open InfoWindow for given map and marker
var openInfoWindow = function(map, marker, infowindowForMarker){
    changeMarkerAnimation(marker, true);
    var newId = marker.get("markerId");
    var venueId = locations[newId].venueId;
    // url
    var url = forsquareUrl+venueId+'?client_id='+clientId+'&client_secret='+clientSecret+'&v='+version;
    infowindowForMarker.marker = marker;
    var results ="";
    infowindowForMarker.setContent(results);
    // Timeout function
    var infoTimeOut = setTimeout(function(){
      results="Time Out!!";
      infowindowForMarker.setContent('<b><i>'+results+'</i></b>');
    },8000);
    // Calling ajax to get the response
    $.ajax({
        url : url,
        dataType : "jsonp",
        success : function(data){
           if(data.response){
               name = data.response.venue.name;
               contact = data.response.venue.contact.formattedPhone;
               address = data.response.venue.location.formattedAddress;
               weburl = data.response.venue.url;
               var line1="";
               var line2="";
               var line3="";
               var line4="";

               if(name){
                 line1 ="<span><b>Name :</b>"+name+"</span><br>";
               }
               if(contact){
                 line2 ="<span><b>Contact :</b>"+contact+"</span><br>";
               }
               if(address){
                 line3 ="<span><b>Address :</b>"+address+"</span><br>";
               }
               if(weburl){
                 line4 ="<span><b>For more info visit at :</b><a href='"+weburl+"' target='_blank'>"+weburl+"</a></span>";
               }
               results = line1 + line2 + line3 + line4;
             }
           infowindowForMarker.setContent(results);
           clearTimeout(infoTimeOut);
        },
        error : function(){
            results ='Unable to load data!!';
            infowindowForMarker.setContent('<b><i>'+results+'</i></b>');
        }
     });
     // Opening info window on given maker and map
     infowindowForMarker.open(map, marker);
     // Function to close info window for marker
     infowindowForMarker.addListener('closeclick',function(){
        infowindowForMarker.setMarker = null;
        changeMarkerAnimation(marker, false);
    });
};


// Function to change marker's animation
var changeMarkerAnimation = function(selectedMarker, booleanVar){
    for(var i=0; i<markers.length; i++){
        if(markers[i]==selectedMarker){
            if(booleanVar == true){
                markers[i].setAnimation(google.maps.Animation.BOUNCE);
            }
            else{
                markers[i].setAnimation(null);
            }
        }
        else{
            markers[i].setAnimation(null);
        }
    }
};


// Function to show an alert message if map fails to load
var mapError = function(){
    alert("Map can not be displayed");
};


// Function to hide marker on a map
var showFilteredMarker = function(id){
    markers[id].setMap(null);
};


// Function to show marker on a map
var resetMarker = function(id){
    markers[id].setMap(map);
};


// Function to close infowindows after resetting markers
var resetInfoWindows = function(infowindowForMarker){
    for(var i=0; i<markers.length; i++){
        var marker = markers[i];
        if(infowindowForMarker.marker == marker){
          infowindowForMarker.close();
        }
    }
};


// Function to start loading the data
var start = function(){
    ko.applyBindings(new ViewModel());
    initMap();
};
