// Real-time clinic search using:
// 1. OpenStreetMap Nominatim for geocoding (free, always works)  
// 2. Google Places API (New) - "Nearby Search (New)" endpoint
// 3. Overpass fallback with correct endpoint

const MAPS_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

function getDistanceKm(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return (R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))).toFixed(1);
}

// Nominatim geocoding (free, always works server-side)
async function geocodeWithNominatim(locationQuery) {
  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(locationQuery)}&format=json&limit=1`;
    const res = await fetch(url, {
      headers: { 'User-Agent': 'JeevRakshakAnimalRescue/1.0 (namanshukla9889@gmail.com)' },
    });
    const data = await res.json();
    if (!data?.length) return null;
    return {
      lat: parseFloat(data[0].lat),
      lng: parseFloat(data[0].lon),
      displayName: data[0].display_name,
    };
  } catch (err) {
    console.error('[Nominatim Error]', err.message);
    return null;
  }
}

// Google Places API (New) - Nearby Search - requires Places API (New) to be enabled
async function findClinicsViaPlacesNew(lat, lng) {
  if (!MAPS_KEY) return null;
  try {
    const body = {
      includedTypes: ['veterinary_care', 'animal_shelter'],
      maxResultCount: 10,
      locationRestriction: {
        circle: {
          center: { latitude: lat, longitude: lng },
          radius: 15000.0,
        },
      },
    };
    const res = await fetch('https://places.googleapis.com/v1/places:searchNearby', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': MAPS_KEY,
        'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.location,places.rating,places.nationalPhoneNumber,places.internationalPhoneNumber,places.regularOpeningHours,places.websiteUri',
      },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    console.log('[Places API New] Status:', res.status, data.error?.message || '');
    if (!res.ok || !data.places?.length) return null;
    return data.places;
  } catch (err) {
    console.error('[Places API New Error]', err.message);
    return null;
  }
}

// Google Places API (New) - Text Search (Google-Search style)
async function findClinicsViaTextSearchNew(lat, lng, locationQuery) {
  if (!MAPS_KEY) return null;
  try {
    const body = {
      textQuery: `animal hospital veterinary NGO animal rescue near ${locationQuery}`,
      maxResultCount: 10,
      locationBias: {
        circle: {
          center: { latitude: lat, longitude: lng },
          radius: 15000.0,
        },
      },
    };
    const res = await fetch('https://places.googleapis.com/v1/places:searchText', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': MAPS_KEY,
        'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.location,places.rating,places.nationalPhoneNumber,places.internationalPhoneNumber,places.regularOpeningHours,places.websiteUri',
      },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    console.log('[Places Text Search New] Status:', res.status, data.error?.message || '');
    if (!res.ok || !data.places?.length) return null;
    return data.places;
  } catch (err) {
    console.error('[Places Text Search New Error]', err.message);
    return null;
  }
}

// Format a Place from Places API (New) to our standard format
function formatNewApiPlace(place, originLat, originLng) {
  const lat = place.location?.latitude;
  const lng = place.location?.longitude;
  const distance = (lat && lng) ? getDistanceKm(originLat, originLng, lat, lng) : '?';
  return {
    id: place.id || place.name,
    name: place.displayName?.text || 'Unknown Clinic',
    phone: place.internationalPhoneNumber || place.nationalPhoneNumber || null,
    distance: `${distance} km`,
    lat,
    lng,
    address: place.formattedAddress || '',
    rating: place.rating || null,
    isOpen: place.regularOpeningHours?.openNow ?? null,
    website: place.websiteUri || null,
    source: 'google_new',
  };
}

// Overpass API fallback (OpenStreetMap data for veterinary places)
async function findClinicsViaOverpass(lat, lng) {
  try {
    const radius = 15000;
    const query = `[out:json][timeout:20];(node["amenity"="veterinary"](around:${radius},${lat},${lng});node["amenity"="animal_shelter"](around:${radius},${lat},${lng});way["amenity"="veterinary"](around:${radius},${lat},${lng}););out center;`;
    
    // Try multiple Overpass instances
    const endpoints = [
      'https://overpass-api.de/api/interpreter',
      'https://overpass.kumi.systems/api/interpreter',
    ];
    
    for (const endpoint of endpoints) {
      try {
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: `data=${encodeURIComponent(query)}`,
          signal: AbortSignal.timeout(10000),
        });
        const text = await res.text();
        if (!text.startsWith('{') && !text.startsWith('[')) continue; // HTML error page
        const data = JSON.parse(text);
        if (data.elements?.length > 0) {
          return (data.elements || []).slice(0, 8);
        }
      } catch {
        continue;
      }
    }
    return [];
  } catch (err) {
    console.error('[Overpass Error]', err.message);
    return [];
  }
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const locationQuery = searchParams.get('location');
  const latParam = searchParams.get('lat');
  const lngParam = searchParams.get('lng');

  // If direct coordinates provided (from browser geolocation), skip geocoding
  if (latParam && lngParam) {
    const lat = parseFloat(latParam);
    const lng = parseFloat(lngParam);
    const displayName = locationQuery || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    console.log(`[Clinics] Using live coordinates → lat:${lat} lng:${lng}`);
    return await searchClinicsAtLocation(lat, lng, displayName, locationQuery || displayName);
  }

  if (!locationQuery?.trim()) {
    return Response.json({ error: 'Location is required' }, { status: 400 });
  }

  try {
    const geo = await geocodeWithNominatim(locationQuery);
    if (!geo) {
      return Response.json({
        clinics: [],
        message: `Could not find "${locationQuery}". Try being more specific, e.g. "Gomtinagar, Lucknow, India".`,
      });
    }
    const { lat, lng, displayName } = geo;
    console.log(`[Clinics] "${locationQuery}" → lat:${lat} lng:${lng}`);
    return await searchClinicsAtLocation(lat, lng, displayName, locationQuery);
  } catch (err) {
    console.error('[Clinics API Error]', err.message);
    return Response.json({ error: 'Search failed. Please try again.' }, { status: 500 });
  }
}

// Core search function shared by both coordinate and text search paths
async function searchClinicsAtLocation(lat, lng, displayName, locationQuery) {
  try {
    // Try Google Places API (New) - Nearby Search
    let places = await findClinicsViaPlacesNew(lat, lng);
    // If nearby returns nothing, try text search
    if (!places || places.length === 0) {
      places = await findClinicsViaTextSearchNew(lat, lng, locationQuery);
    }
    if (places && places.length > 0) {
      let clinics = places
        .map(p => formatNewApiPlace(p, lat, lng))
        .sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
        
      // Inject test clinic
      clinics.unshift({
        id: 'test-clinic-1',
        name: 'Jeev Rakshak Test Clinic (For Testing)',
        phone: '+919369617224',
        distance: '0.1 km',
        lat: lat,
        lng: lng,
        address: displayName,
        rating: 5.0,
        isOpen: true,
        website: null,
        source: 'test',
      });

      return Response.json({ clinics, searchCenter: { lat, lng, address: displayName } });
    }
    // Overpass fallback
    console.log('[Clinics] Google Places failed, trying Overpass...');
    const overpassResults = await findClinicsViaOverpass(lat, lng);
    if (overpassResults.length > 0) {
      let clinics = overpassResults
        .filter(el => el.tags?.name)
        .map(el => {
          const elLat = el.lat || el.center?.lat;
          const elLng = el.lon || el.center?.lon;
          const tags = el.tags || {};
          return {
            id: String(el.id),
            name: tags.name,
            phone: tags['contact:phone'] || tags.phone || tags['phone:mobile'] || null,
            distance: `${getDistanceKm(lat, lng, elLat, elLng)} km`,
            lat: elLat,
            lng: elLng,
            address: [tags['addr:street'], tags['addr:city']].filter(Boolean).join(', ') || displayName,
            rating: null,
            isOpen: null,
            website: tags.website || null,
            source: 'openstreetmap',
          };
        })
        .sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
        
      // Inject test clinic
      clinics.unshift({
        id: 'test-clinic-1',
        name: 'Jeev Rakshak Test Clinic (For Testing)',
        phone: '+919369617224',
        distance: '0.1 km',
        lat: lat,
        lng: lng,
        address: displayName,
        rating: 5.0,
        isOpen: true,
        website: null,
        source: 'test',
      });

      return Response.json({ clinics, searchCenter: { lat, lng, address: displayName } });
    }
    // Even if no clinics found, return the test clinic
    return Response.json({
      clinics: [{
        id: 'test-clinic-1',
        name: 'Jeev Rakshak Test Clinic (For Testing)',
        phone: '+919369617224',
        distance: '0.1 km',
        lat: lat,
        lng: lng,
        address: displayName,
        rating: 5.0,
        isOpen: true,
        website: null,
        source: 'test',
      }],
      searchCenter: { lat, lng, address: displayName },
      message: 'No real clinics found nearby. Enable "Places API (New)" in Google Cloud Console for better results. Test clinic injected.',
    });
  } catch (err) {
    console.error('[searchClinicsAtLocation Error]', err.message);
    return Response.json({ error: 'Search failed. Please try again.' }, { status: 500 });
  }
}
