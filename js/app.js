var locations = [
    { title: 'Georgia Aquarium',
      position: {lat: 33.763333 ,lng: -84.395268 },
      venueId: '44dbbfa8f964a520a0361fe3',
      id: 0
    },
    { title: 'CNN Center',
      position: {lat: 33.758028 ,lng: -84.395084 },
      venueId: '43680180f964a52082291fe3',
      id: 1
    },
    { title: 'Zoo Atlanta',
      position: {lat: 33.734193 ,lng: -84.372253 },
      venueId: '55545128498e64955f7eff2f',
      id: 2
    },
    { title: 'Philips Arena',
      position: {lat: 33.757181267669 ,lng: -84.39642028265698 },
      venueId: '4362bb80f964a5204c291fe3',
      id: 3
    },
    { title: 'World of Coca-Cola',
      position: {lat: 33.76288 ,lng: -84.392681 },
      venueId: '4a49624ff964a5203fab1fe3',
      id: 4
    },
    { title: 'Centenial Olympic Park',
      position: {lat: 33.760383 ,lng: -84.393539 },
      venueId: '4a05d34ef964a52083721fe3',
      id: 5
    },
    { title: 'Georgia Institute of Technology',
      position: {lat: 33.775652 ,lng: -84.396286 },
      venueId: '4ab2b4c3f964a520f26b20e3',
      id: 6
    },
    { title: 'Martin Luther King Jr. Historical Park',
      position: {lat: 33.756351 ,lng: -84.373455 },
      venueId: '4bba235f3db7b7137ff2229a',
      id: 7
    }
]

// foursquare data
forsquareUrl = 'https://api.foursquare.com/v2/venues/';
clientId ='AU1HKMEIUF0ORWNCGQ0B4BPAG5ZYTGNC3RCC1KRI3Q51ULL4';
clientSecret ='GUAWICBPSYJK5UAEI1X3BA1W24ZAV2QKIWBVMX0EWNG1GCJT';
version ='20171013';

var map;
var markers =[];
var marker;

var initMap = function(){
    map = new google.maps.Map(document.getElementById('map'), {
           center: {lat: 33.753746, lng: -84.386330},
           zoom: 13,
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

// location
var Location = function(locationData){
    this.title = ko.observable(locationData.title);
    this.position = ko.observable(locationData.position);
    this.venueId = ko.observable(locationData.venueId);
    this.id = ko.observable(locationData.id);
}

var ViewModel = function(){
    var self = this;
    //self.markers = markers;
    self.locationList = ko.observableArray([]);

    locations.forEach(function(locationItem){
        var locationItem = new Location(locationItem);
        self.locationList.push(locationItem);

        marker = new google.maps.Marker({
                      title: locationItem.title(),
                      position: locationItem.position(),
                      animation: google.maps.Animation.DROP
        });
        markers.push(marker);
    });

    self.selectedLocation = ko.observable();
    var infowindowForMarker = new google.maps.InfoWindow();

    self.openMarkerForLocation = function(locationItem){
        self.selectedLocation(locationItem);
        var markerId = self.selectedLocation().id();
        var selectedMarker = markers[markerId];
        openInfoWindow(map, selectedMarker, infowindowForMarker);
    };

    self.filterText = ko.observable("");
    self.filteredList = ko.observableArray([]);

    self.showFilteredLocations = function(){
      var filterText= self.filterText();
      self.locationList.removeAll();
      //markers = [];
      //alert("markers size="+markers.length);
      locations.forEach(function(locationItem){
          var locationItem = new Location(locationItem);
          var locationTitle = locationItem.title();
          if(locationTitle.includes(filterText)){
            self.locationList.push(locationItem);
          }
          else{
            showFilteredMarker(locationItem.id());
          }
          //alert("markers size then="+markers.length);
      });
    };

    self.resetLocations = function(){
        self.filterText("");
        self.locationList.removeAll();
        //markers = [];
        locations.forEach(function(locationItem){
            var locationItem = new Location(locationItem);
            self.locationList.push(locationItem);
            resetMarker(locationItem.id());
          });
    };

    /*for(var a=0; a<locations.length; a++){
        alert("loc ="+locations[a].venueId);
    }*/

    for(var i=0; i< markers.length; i++){
        marker = markers[i];
        marker.set("markerId",i);
        marker.addListener('click', function(){
            openInfoWindow(map, this, infowindowForMarker);
        });
    }

}

var openInfoWindow = function(map, marker, infowindowForMarker){
    changeMarkerAnimation(marker, true);
    var newId = marker.get("markerId");
    var venueId = locations[newId].venueId;
    var url = forsquareUrl+venueId+'?client_id='+clientId+'&client_secret='+clientSecret+'&v='+version;
    //console.log("url="+url);

    infowindowForMarker.marker = marker;
    var results ="";
    infowindowForMarker.setContent(results);

    var infoTimeOut = setTimeout(function(){
      results="Time Out!!";
      infowindowForMarker.setContent('<b><i>'+results+'</i></b>');
    },8000);

    $.ajax({
        url : url,
        dataType : "jsonp",
        success : function(data) {
         //clearTimeout(wikiTimeOutRequest);
           if(data.response){
             name = data.response.venue.name;
             contact = data.response.venue.contact.formattedPhone
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

    infowindowForMarker.open(map, marker);
    infowindowForMarker.addListener('closeclick',function(){
        infowindowForMarker.setMarker = null;
        changeMarkerAnimation(marker, false);
    });
};

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

var mapError = function(){
    alert("Map can not be displayed");
};

var showFilteredMarker = function(id){
    markers[id].setMap(null);
};

var resetMarker = function(id){
    markers[id].setMap(map);
};

var start = function(){
  ko.applyBindings(new ViewModel());
  initMap();
};
