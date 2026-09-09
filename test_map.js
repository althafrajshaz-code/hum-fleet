
    function applyAutoTheme() {
      const hour = new Date().getHours();
      const isDaytime = hour >= 6 && hour < 18;
      if (isDaytime) {
        document.body.classList.remove('dark-theme');
        document.body.classList.add('light-theme');
      } else {
        document.body.classList.remove('light-theme');
        document.body.classList.add('dark-theme');
      }
    }
    applyAutoTheme();

    // Check periodically just like Navbar
    setInterval(applyAutoTheme, 60000);

    let map;
    let pickupMarker;
    let dropoffMarker;
    let carMarker;
    let routeLayer;
    let nearbyDriverMarkers = [];

    // Custom Icons
    const greenIcon = L.icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });

    const redIcon = L.icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });

    const carIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><text y="24" font-size="24">🚗</text></svg>`;
    const carIcon = L.icon({
      iconUrl: 'data:image/svg+xml;utf-8,' + encodeURIComponent(carIconSvg),
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });

    const driverIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><text y="16" font-size="16">🚕</text></svg>`;
    const driverIcon = L.icon({
      iconUrl: 'data:image/svg+xml;utf-8,' + encodeURIComponent(driverIconSvg),
      iconSize: [20, 20],
      iconAnchor: [10, 10]
    });

    function initMap() {
      const defaultLoc = [9.9777, 76.2758]; // Kochi
      
      map = L.map('map', {
        zoomControl: false,
        attributionControl: false
      }).setView(defaultLoc, 13);
      
      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // Add OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
      }).addTo(map);

      // Initialize Pickup Marker
      pickupMarker = L.marker(defaultLoc, { icon: greenIcon, draggable: true }).addTo(map);

      // Handle map clicks
      map.on('click', (e) => {
        if (carMarker) return; // Ride in progress
        pickupMarker.setLatLng(e.latlng);
        map.panTo(e.latlng);
        reverseGeocode(e.latlng);
      });

      // Handle marker drag
      pickupMarker.on('dragend', (e) => {
        reverseGeocode(pickupMarker.getLatLng());
      });

      locateUser(true);
    }

    async function reverseGeocode(latlng) {
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latlng.lat}&lon=${latlng.lng}&format=json`);
        if (res.ok) {
          const data = await res.json();
          let address = data.display_name;
          if (address) address = address.replace(/, India$/i, '');
          window.parent.postMessage({ type: 'MAP_LOCATION_SELECTED', address: address || `${latlng.lat.toFixed(5)}, ${latlng.lng.toFixed(5)}`, lat: latlng.lat, lng: latlng.lng }, '*');
        } else {
          fallbackGeocode(latlng);
        }
      } catch (err) {
        fallbackGeocode(latlng);
      }
    }

    function fallbackGeocode(latlng) {
      window.parent.postMessage({ type: 'MAP_LOCATION_SELECTED', address: latlng.lat.toFixed(5) + ", " + latlng.lng.toFixed(5), lat: latlng.lat, lng: latlng.lng }, '*');
    }

    function locateUser(isSilent) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
            pickupMarker.setLatLng(pos);
            map.setView(pos, 16);
            reverseGeocode(pos);
          },
          () => {
            if (!isSilent) alert("Location permission denied. Defaulting to Kochi.");
          }
        );
      } else {
        if (!isSilent) alert("Geolocation is not supported by this browser.");
      }
    }

    window.addEventListener('message', async function(event) {
      if (!event.data) return;

      if (event.data.type === 'DRAW_ROUTE') {
        const pk = event.data.pickup;
        const dp = event.data.dropoff;
        const stops = event.data.stops || [];

        if (dropoffMarker) map.removeLayer(dropoffMarker);
        if (carMarker) map.removeLayer(carMarker);
        if (routeLayer) map.removeLayer(routeLayer);
        if (window.stopMarkers) {
          window.stopMarkers.forEach(m => map.removeLayer(m));
        }
        window.stopMarkers = [];
        
        pickupMarker.setLatLng([pk.lat, pk.lng]);
        dropoffMarker = L.marker([dp.lat, dp.lng], { icon: redIcon }).addTo(map);

        stops.forEach((stop, i) => {
          const stopMarker = L.marker([stop.lat, stop.lng], { 
            icon: L.divIcon({ className: 'custom-div-icon', html: "<div style='background-color:#f59e0b; width:12px; height:12px; border-radius:50%; border:2px solid white;'></div>" })
          }).addTo(map);
          window.stopMarkers.push(stopMarker);
        });

        // Fetch route from OSRM
        try {
          const coordsArray = [pk, ...stops, dp];
          const coordsString = coordsArray.map(c => `${c.lng},${c.lat}`).join(';');
          const res = await fetch(`https://router.project-osrm.org/route/v1/driving/${coordsString}?overview=full&geometries=geojson`);
          if (res.ok) {
            const data = await res.json();
            if (data.routes && data.routes[0]) {
              const geojson = data.routes[0].geometry;
              routeLayer = L.geoJSON(geojson, {
                style: {
                  color: '#10b981',
                  weight: 5,
                  opacity: 0.8
                }
              }).addTo(map);
              map.fitBounds(routeLayer.getBounds(), { padding: [50, 50] });
            }
          } else {
            // Fallback straight line
            routeLayer = L.polyline(coordsArray.map(c => [c.lat, c.lng]), { color: '#10b981', weight: 5, dashArray: '10, 10' }).addTo(map);
            map.fitBounds(routeLayer.getBounds(), { padding: [50, 50] });
          }
        } catch (e) {
          const coordsArray = [pk, ...stops, dp];
          routeLayer = L.polyline(coordsArray.map(c => [c.lat, c.lng]), { color: '#10b981', weight: 5, dashArray: '10, 10' }).addTo(map);
          map.fitBounds(routeLayer.getBounds(), { padding: [50, 50] });
        }
      }

      if (event.data.type === 'ANIMATE_CAR') {
        const pk = event.data.pickup;
        const dp = event.data.dropoff;

        if (carMarker) map.removeLayer(carMarker);

        carMarker = L.marker([pk.lat, pk.lng], { icon: carIcon }).addTo(map);

        let startTime = null;
        const duration = 9000;

        function animate(timestamp) {
          if (!startTime) startTime = timestamp;
          const progress = Math.min((timestamp - startTime) / duration, 1);

          const curLat = pk.lat + (dp.lat - pk.lat) * progress;
          const curLng = pk.lng + (dp.lng - pk.lng) * progress;
          
          carMarker.setLatLng([curLat, curLng]);

          if (progress < 1) {
            requestAnimationFrame(animate);
          } else {
            carMarker.bindPopup("<b>Arrived!</b>").openPopup();
          }
        }
        requestAnimationFrame(animate);
      }

      if (event.data.type === 'UPDATE_CAR_LOCATION') {
        const { lat, lng } = event.data;
        if (!carMarker) {
          carMarker = L.marker([lat, lng], { icon: carIcon }).addTo(map);
        } else {
          carMarker.setLatLng([lat, lng]);
        }
      }

      if (event.data.type === 'RESET_MAP') {
        if (dropoffMarker) map.removeLayer(dropoffMarker);
        if (carMarker) map.removeLayer(carMarker);
        if (routeLayer) map.removeLayer(routeLayer);
        nearbyDriverMarkers.forEach(m => map.removeLayer(m));
        nearbyDriverMarkers = [];
        
        const center = [28.6304, 77.2177];
        pickupMarker.setLatLng(center);
        map.setView(center, 13);
      }

      if (event.data.type === 'SHOW_NEARBY_DRIVERS') {
        const drivers = event.data.drivers || [];
        nearbyDriverMarkers.forEach(m => map.removeLayer(m));
        nearbyDriverMarkers = [];
        
        drivers.forEach(driver => {
          const marker = L.marker([parseFloat(driver.lat), parseFloat(driver.lng)], { icon: driverIcon }).addTo(map);
          nearbyDriverMarkers.push(marker);
        });
      }
    });

    window.onload = initMap;
  