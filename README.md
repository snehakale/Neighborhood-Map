## Project Title
### Neighborhood Map
This project contains a webpage showing a list of locations and a google map showing these locations in the given neighborhood (here it is set as Atlanta,GA). This map also shows markers and additional information for these locations.
This project uses *javascript, ajax, knockout.js, html and css*. Also implements third party apis such as *Google Maps API* and *Foursquare API*.

## Pre-Requisites and Installation
1. Download the given project folder.
2. Unzip the folder and place the files according to the given hierarchy.
3. To run this project you have to make sure for Google api browser key and referrer values.
4. Run **index.html**.

## Code Examples 
1) **app.js** 
    This implements knocout.js mvvm pattern.
    eg. (1). `var Location = function(locationData){
    this.title = ko.observable(locationData.title);
    this.position = ko.observable(locationData.position)......;`
        (2). `var ViewModel = function(){
    var self = this;
    // Creating locationList to hold list of locations
    self.locationList = ko.observableArray([]);......`
    
    Also calls functions to implement Google maps API 
    eg. `var initMap = function(){
    map = new google.maps.Map(document.getElementById('map'), {
           center: {lat: 33.753746, lng: -84.386330},
           zoom: 14,....`
    and makes ajax call to fetch data using Forsquare API 
    eg. `$.ajax({
        url : url,
        dataType : "jsonp",
        success : function(data){
           if(data.response){
               name = data.response.venue.name;
               contact = data.response.venue.contact.formattedPhone....`
            
2. **index.html**
    This file contains html data . It implements knockout.js data bindings with html selectors. 
    eg. `<ul data-bind="foreach: locationList">`
    Also holds script tags to link with other js , css files and also to make an asynchronous call to Google maps api service.
    eg. `<script async defer src="https://maps.googleapis.com/maps/api/....`

3. **style.css**
    This file holds rules to apply style on the given selectors and make the view more presentable.
    eg. `.list-item-style {
    background-color: #d6d6c2;
    margin: 5px;
    border-radius: 10px;
    cursor: pointer;.....`

## References 
1. [Knockout.js](http://knockoutjs.com/) and [Knockout.js data bindings](http://knockoutjs.com/documentation/introduction.html)
2. [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference)
3. [JQuery AJAX](http://api.jquery.com/jquery.ajax/)
4. [Google Maps API](https://developers.google.com/maps/documentation/javascript/)  and [Google Maps Javascript API](https://developers.google.com/maps/documentation/javascript/markers)
5. [Forsquare API](https://developer.foursquare.com/docs)
6. [HTML5](https://www.w3schools.com/html/html5_intro.asp)
7. [CSS](https://www.w3schools.com/css/)

