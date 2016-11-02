(function() {
  'use strict';

  const trackerURL = 'http://meowthtracker.mwisely.xyz';
  const meowthImageURL = 'images/meowth.png';
  const rollaCenter = [37.948889, -91.763056];
  const osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  const osmAttrib = [
    'Map data ©',
    '<a bhref="http://openstreetmap.org">OpenStreetMap</a>',
    'contributors'
  ].join(' ');

  // URLs for the position and target.
  let positionURL = trackerURL + '/position.json';
  let targetURL = trackerURL + '/target.json';

  // Initialize the map at rollaCenter, w/ default zoom of 10.
  var mymap = L.map('map').setView(rollaCenter, 10);

  // Initialize tileLayer.
  L.tileLayer(osmUrl, {
    attribution: osmAttrib,
    maxZoom: 20
  }).addTo(mymap);

  // Meowth icon.
  var myIcon = L.icon({
    iconUrl: meowthImageURL,
    iconSize: [50, 50],
    iconAnchor: [25, 50]
  });

  // Do stuff with the current location.
  var meowth, pBar, target;

  // Function for updating pin locations, etc.
  function updaterFunc() {
    $.getJSON(positionURL, function(data) {

      // Initialize meowth's marker & target, else update meowth's current position.
      if (!meowth) {
        meowth = L.marker([data['Lat'], data['Long']], {icon: myIcon}).addTo(mymap);
	document.getElementById('transportName').innerHTML = data['Transport'];
      } else {
        // Update meowth's position.
        meowth.setLatLng([data['Lat'], data['Long']]).update();
      }

      // Update the progress bar's percentage and width.
      if (!pBar) {
        pBar = document.getElementById('pBar');
      } else {
        pBar.innerHTML = (data['Progress'] * 100).toFixed(2) + '%';  	 
        pBar.style.width = data['Progress'] * 100 + '%';

	  //document.getElementById('transportName').innerHTML = data['Transport'];  
      }

      setTimeout(updaterFunc, 500);
    });

    // Place the target.
    $.getJSON(targetURL, function(data) {
      if (!target) {
        target = L.marker([data['Lat'], data['Long']]).addTo(mymap);
      } else {
        target.setLatLng([data['Lat'], data['Long']]).update();
      }
    });

  };

  updaterFunc();

  // "Zoom to Meowth"
  var zoomMeowth = document.getElementById("zoomMeowth");

  zoomMeowth.addEventListener("click", function(event) {
    // Prevents the page from reloading upon click.
    event.preventDefault();
    // Fly to meowth's position. 
    mymap.flyTo(meowth.getLatLng(), 15);
  });

  // "Zoom to Target"
  var zoomTarget = document.getElementById("zoomTarget");

  zoomTarget.addEventListener("click", function(event) {
    // Prevents the page from reloading upon click.
    event.preventDefault();
    // Fly to target's position. 
    mymap.flyTo(target.getLatLng(), 15);
  });

  // "Zoom Out"
  var zoomOut = document.getElementById("zoomOut");

  zoomOut.addEventListener("click", function(event) {
    // Prevents the page from reloading upon click.
    event.preventDefault();
    // Fly to target's position. 
    mymap.flyTo(rollaCenter, 10);
  });

  // "Follow Meowth"
  // ... doesn't work.. need to finish.
  var follow = document.getElementById("zoomOut");

  zoomOut.addEventListener("click", function(event) {
    // Prevents the page from reloading upon click.
    event.preventDefault();
    // Fly to target's position. 
    mymap.flyTo(meowth.getLatLng(), mymap.getZoom());
  });





})();
