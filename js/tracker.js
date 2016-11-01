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

  /*
   * Your implementation goes here!
   */

  // URLs for the position and target.
  let positionURL = trackerURL + '/position.json';
  let targetURL = trackerURL + '/target.json';

  // Get the destination info from website.
  $.getJSON(targetURL, function(data) {
    console.log(data);
  });

  // Initialize the map.
  var mymap = L.map('map').setView(rollaCenter, 13);
  L.tileLayer(osmUrl, osmAttrib).addTo(mymap);

  // Get the position info from website.

  // Add location icon.
  var myIcon = L.icon({
    iconUrl: meowthImageURL
  });

  // Do stuff with the current location.
  $.getJSON(positionURL, function(data) {
    let marker = L.marker([data['Lat'], data['Long']], {icon: myIcon}).addTo(mymap);
    let pBar = document.getElementById('pBar');

    document.getElementById('transportName').innerHTML = data['Transport'];
    pBar.innerHTML = String(Number(data['Progress'] * 100).toPrecision(4)) + '%';  	 
    pBar.style.width = data['Progress'] * 100 + '%';
  });


})();
