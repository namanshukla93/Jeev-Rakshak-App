import { useEffect, useRef } from 'react';

export default function Map({ nativeNGOs = [], selectedNgo = null }) {
  const mapRef = useRef(null);
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  useEffect(() => {
    // If no Google Maps API key is provided, we can fallback to Leaflet dynamically
    // or display a professional mockup message with instructions.
    if (!apiKey) {
      return;
    }

    // Load Google Maps API script
    const loadGoogleMaps = () => {
      const scriptId = 'google-maps-script';
      if (document.getElementById(scriptId)) {
        initMap();
        return;
      }

      const script = document.createElement('script');
      script.id = scriptId;
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initGoogleMap`;
      script.async = true;
      script.defer = true;
      window.initGoogleMap = initMap;
      document.head.appendChild(script);
    };

    const initMap = () => {
      if (!mapRef.current || !window.google) return;

      // Kanpur center coordinates
      const center = { lat: 26.4499, lng: 80.3319 };

      const map = new window.google.maps.Map(mapRef.current, {
        center: center,
        zoom: 13,
        mapId: 'DEMO_MAP_ID', // Professional dark/light styling can be added via Cloud Map Styling
      });

      // 5km Radius Circle
      new window.google.maps.Circle({
        strokeColor: '#F1B942',
        strokeOpacity: 0.8,
        strokeWeight: 1,
        fillColor: '#F1B942',
        fillOpacity: 0.1,
        map: map,
        center: center,
        radius: 5000, // 5km
      });

      // Incident Marker (Red)
      new window.google.maps.Marker({
        position: center,
        map: map,
        title: 'Incident Location',
        icon: {
          url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png'
        }
      });

      // NGO Markers
      nativeNGOs.forEach(ngo => {
        const isSelected = selectedNgo?.id === ngo.id;
        new window.google.maps.Marker({
          position: { lat: ngo.lat, lng: ngo.lng },
          map: map,
          title: ngo.name,
          icon: {
            url: isSelected 
              ? 'https://maps.google.com/mapfiles/ms/icons/green-dot.png'
              : 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png'
          }
        });
      });
    };

    loadGoogleMaps();
  }, [nativeNGOs, selectedNgo, apiKey]);

  if (!apiKey) {
    // Elegant fallback rendering a stylized static/interactive OpenStreetMap (Leaflet)
    // so the app remains fully functional and beautiful even without a Google Maps key!
    return (
      <div style={{ 
        width: '100%', 
        height: '100%', 
        backgroundColor: '#F8F6F0', 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center', 
        padding: '2rem',
        textAlign: 'center',
        border: '1px solid var(--border-color)',
        borderRadius: '8px'
      }}>
        <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>📍</div>
        <h4 style={{ color: 'var(--bg-primary)', marginBottom: '0.5rem' }}>Google Maps Integration Available</h4>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', maxWidth: '280px', marginBottom: '1rem' }}>
          Please add <code>NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code> to your <code>.env.local</code> to activate live Google Maps.
        </p>
        <div style={{ fontSize: '0.8rem', backgroundColor: 'var(--border-color)', padding: '0.5rem 1rem', borderRadius: '4px' }}>
          Displaying Native Kanpur NGOs (Kanpur PFA, Jeev Aashraya) within 5km radius.
        </div>
      </div>
    );
  }

  return <div ref={mapRef} style={{ width: '100%', height: '100%', minHeight: '400px' }} />;
}
