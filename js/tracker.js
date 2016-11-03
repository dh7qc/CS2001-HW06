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
  var positionURL = trackerURL + '/position.json';
  var targetURL = trackerURL + '/target.json';

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

  // Necessary Variables.
  var meowth;
  var pBar;
  var target;

  // Function for updating pin locations, etc.
  function updaterFunc() {
    // Get current position.
    $.getJSON(positionURL, function(data) {
      // Initialize meowth's marker & target, else update meowth's current position.
      if (!meowth) {
        meowth = L.marker([data.Lat, data.Long], {icon: myIcon}).addTo(mymap);
        document.getElementById('transportName').innerHTML = data.Transport;
      } else {
        // Update meowth's position.
        meowth.setLatLng([data.Lat, data.Long]).update();
      }

      // Update the progress bar's percentage and width.
      if (!pBar) {
        pBar = document.getElementById('pBar');
      } else {
        pBar.innerHTML = (data.Progress * 100).toFixed(2) + '%';
        pBar.style.width = data.Progress * 100 + '%';

        // Update the transport name too.
        document.getElementById('transportName').innerHTML = data.Transport;
      }
    });

    // Place the target.
    $.getJSON(targetURL, function(data) {
      if (!target) {
        target = L.marker([data.Lat, data.Long]).addTo(mymap);
      } else {
        target.setLatLng([data.Lat, data.Long]).update();
      }
    });

    // Continue to follow meowth if box is checked.
    if (follow != undefined && follow.checked) {
      mymap.panTo(meowth.getLatLng());
    }

    // Call this function again in 500 ms.
    setTimeout(updaterFunc, 500);
  };

  updaterFunc();

  // "Follow Meowth"
  var follow = document.getElementById('follow');

  follow.addEventListener('change', function(event) {
    // Prevents the page from reloading upon click.
    event.preventDefault();
  });

  // "Zoom to Meowth"
  var zoomMeowth = document.getElementById('zoomMeowth');

  zoomMeowth.addEventListener('click', function(event) {
    // Prevents the page from reloading upon click.
    event.preventDefault();
    // Uncheck Follow Meowth if needed.
    if (follow.checked) {
      follow.click();
    }
    // Fly to meowth's position.
    mymap.flyTo(meowth.getLatLng(), 16);
  });

  // "Zoom to Target"
  var zoomTarget = document.getElementById('zoomTarget');

  zoomTarget.addEventListener('click', function(event) {
    // Prevents the page from reloading upon click.
    event.preventDefault();
    // Uncheck Follow Meowth if needed.
    if (follow.checked) {
      follow.click();
    }
    // Fly to target's position.
    mymap.flyTo(target.getLatLng(), 16);
  });

  // "Zoom Out"
  var zoomOut = document.getElementById('zoomOut');

  zoomOut.addEventListener('click', function(event) {
    // Prevents the page from reloading upon click.
    event.preventDefault();
    // Uncheck Follow Meowth if needed.
    if (follow.checked) {
      follow.click();
    }
    // Fly to target's position.
    mymap.flyTo(rollaCenter, 10);
  });

})();
