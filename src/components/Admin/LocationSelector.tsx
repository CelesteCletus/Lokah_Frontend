import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Search, MapPin, ExternalLink, CheckCircle2, AlertTriangle } from 'lucide-react';

interface LocationSelectorProps {
  coordinates: {
    lat: number;
    lng: number;
    formatted_address?: string;
    place_id?: string;
    latitude?: number;
    longitude?: number;
  } | null;
  onChange: (coords: {
    lat: number;
    lng: number;
    formatted_address: string;
    place_id: string;
    latitude: number;
    longitude: number;
  } | null) => void;
  validationError?: string | null;
}

// Fallback local suggestions for Kakkanad / Kochi area (Luxury properties focus)
const localSuggestions = [
  {
    name: 'Kakkanad',
    formatted_address: 'Kakkanad, Ernakulam District, Kerala, India',
    lat: 10.0121,
    lng: 76.3532,
    place_id: 'local-kakkanad'
  },
  {
    name: 'Marine Drive Kochi',
    formatted_address: 'Marine Drive, Kochi, Ernakulam, Kerala, India',
    lat: 9.9806,
    lng: 76.2750,
    place_id: 'local-marinedrive'
  },
  {
    name: 'Edappally',
    formatted_address: 'Edappally, Kochi, Ernakulam, Kerala, India',
    lat: 10.0261,
    lng: 76.3084,
    place_id: 'local-edappally'
  },
  {
    name: 'Infopark Phase 2',
    formatted_address: 'Infopark Phase 2, Kakkanad, Ernakulam, Kerala, India',
    lat: 10.0104,
    lng: 76.3653,
    place_id: 'local-infopark'
  },
  {
    name: 'MG Road Kochi',
    formatted_address: 'MG Road, Kochi, Ernakulam, Kerala, India',
    lat: 9.9702,
    lng: 76.2826,
    place_id: 'local-mgroad'
  }
];

export default function LocationSelector({ coordinates, onChange, validationError }: LocationSelectorProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [reverseGeocoding, setReverseGeocoding] = useState(false);

  // Parse address parts for formatting on the card
  const formattedAddress = coordinates?.formatted_address || '';
  const addressParts = formattedAddress
    ? formattedAddress.split(',').map(p => p.trim()).filter(Boolean)
    : [];

  // Handle marker drag (updates coordinates and reverse geocodes)
  const handleMarkerDrag = async (lat: number, lng: number) => {
    setReverseGeocoding(true);
    let resolvedAddress = coordinates?.formatted_address || 'Custom Site Position';
    let placeId = coordinates?.place_id || `drag-${lat}-${lng}`;

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`
      );
      const data = await response.json();
      if (data && data.display_name) {
        resolvedAddress = data.display_name;
        placeId = String(data.place_id || data.osm_id || placeId);
      }
    } catch (err) {
      console.warn('Reverse geocoding error:', err);
    } finally {
      setReverseGeocoding(false);
      onChange({
        lat,
        lng,
        formatted_address: resolvedAddress,
        place_id: placeId,
        latitude: lat,
        longitude: lng
      });
    }
  };

  // Ref to prevent stale closures inside Leaflet event handlers
  const handleMarkerDragRef = useRef<((lat: number, lng: number) => Promise<void>) | null>(null);
  handleMarkerDragRef.current = handleMarkerDrag;

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapRef.current) return;

    // Premium luxury gold icon style
    const goldIcon = L.divIcon({
      className: 'custom-gold-marker',
      html: `
        <div style="
          width: 32px;
          height: 32px;
          background: linear-gradient(135deg, #d4af37 0%, #aa7c11 100%);
          border: 2px solid #fff;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          box-shadow: 0 0 12px rgba(212, 175, 55, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: grab;
        ">
          <div style="
            width: 8px;
            height: 8px;
            background: #0d0d0d;
            border-radius: 50%;
            transform: rotate(45deg);
          "></div>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 32]
    });

    const initialLat = coordinates?.lat || 10.0121;
    const initialLng = coordinates?.lng || 76.3532;

    // Create Map
    const map = L.map(mapRef.current, {
      center: [initialLat, initialLng],
      zoom: coordinates?.lat ? 15 : 12,
      zoomControl: true,
      scrollWheelZoom: true
    });

    // Dark tiles (CartoDB Dark Matter)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 20
    }).addTo(map);

    // Place marker helper
    const placeMarker = (lat: number, lng: number) => {
      if (markerRef.current) {
        markerRef.current.setLatLng([lat, lng]);
      } else {
        const marker = L.marker([lat, lng], {
          icon: goldIcon,
          draggable: true
        }).addTo(map);

        marker.on('dragend', async () => {
          const position = marker.getLatLng();
          if (handleMarkerDragRef.current) {
            await handleMarkerDragRef.current(position.lat, position.lng);
          }
        });

        markerRef.current = marker;
      }
    };

    // Create marker initially if coordinates are set
    if (coordinates?.lat) {
      placeMarker(coordinates.lat, coordinates.lng);
    }

    // Map click event listener (Drop/move pin on click)
    map.on('click', async (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      placeMarker(lat, lng);
      if (handleMarkerDragRef.current) {
        await handleMarkerDragRef.current(lat, lng);
      }
    });

    mapInstanceRef.current = map;

    // Resize recalculation
    setTimeout(() => {
      map.invalidateSize();
    }, 200);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
      markerRef.current = null;
    };
  }, []);

  // Update Map marker and zoom if coordinates are updated externally
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    if (coordinates?.lat) {
      const position: [number, number] = [coordinates.lat, coordinates.lng];
      // Keep zoom if already high
      const targetZoom = map.getZoom() < 12 ? 15 : map.getZoom();
      map.setView(position, targetZoom, { animate: true });

      if (markerRef.current) {
        markerRef.current.setLatLng(position);
      } else {
        const goldIcon = L.divIcon({
          className: 'custom-gold-marker',
          html: `
            <div style="
              width: 32px;
              height: 32px;
              background: linear-gradient(135deg, #d4af37 0%, #aa7c11 100%);
              border: 2px solid #fff;
              border-radius: 50% 50% 50% 0;
              transform: rotate(-45deg);
              box-shadow: 0 0 12px rgba(212, 175, 55, 0.5);
              display: flex;
              align-items: center;
              justify-content: center;
              cursor: grab;
            ">
              <div style="
                width: 8px;
                height: 8px;
                background: #0d0d0d;
                border-radius: 50%;
                transform: rotate(45deg);
              "></div>
            </div>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 32]
        });

        const marker = L.marker(position, {
          icon: goldIcon,
          draggable: true
        }).addTo(map);

        marker.on('dragend', async () => {
          const pos = marker.getLatLng();
          await handleMarkerDrag(pos.lat, pos.lng);
        });

        markerRef.current = marker;
      }
    } else {
      if (markerRef.current) {
        markerRef.current.remove();
        markerRef.current = null;
      }
    }
  }, [coordinates?.lat, coordinates?.lng]);



  // Autocomplete typing logic
  useEffect(() => {
    if (searchQuery.trim().length < 3) {
      setSuggestions([]);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      setIsSearching(true);
      try {
        // Query OpenStreetMap Nominatim
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&addressdetails=1&limit=5&countrycodes=in`
        );
        const data = await response.json();

        if (data && Array.isArray(data) && data.length > 0) {
          const formatted = data.map((item: any) => ({
            name: item.name || item.display_name.split(',')[0],
            formatted_address: item.display_name,
            lat: parseFloat(item.lat),
            lng: parseFloat(item.lon),
            place_id: String(item.place_id || item.osm_id)
          }));
          setSuggestions(formatted);
        } else {
          // Perform local fallback search
          const localFiltered = localSuggestions.filter(item =>
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.formatted_address.toLowerCase().includes(searchQuery.toLowerCase())
          );
          setSuggestions(localFiltered);
        }
      } catch (err) {
        // Fallback directly to local list on network error
        const localFiltered = localSuggestions.filter(item =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.formatted_address.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setSuggestions(localFiltered);
      } finally {
        setIsSearching(false);
      }
    }, 450);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  const selectSuggestion = (item: any) => {
    onChange({
      lat: item.lat,
      lng: item.lng,
      formatted_address: item.formatted_address,
      place_id: item.place_id,
      latitude: item.lat,
      longitude: item.lng
    });
    setSearchQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
  };

  return (
    <div className="space-y-6 text-left font-body text-xs">
      <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
        <h4 className="font-display text-sm text-gold-450 uppercase tracking-wider font-semibold flex items-center gap-2">
          <MapPin className="w-4 h-4 text-gold-400" />
          <span>📍 Property Location</span>
        </h4>
        <span className="text-[10px] text-ivory-400 font-light tracking-wide uppercase"> Location Tools </span>
      </div>

      {/* Address Search Field */}
      <div className="relative">
        <label className="text-ivory-400 block mb-2 font-medium">Search Address</label>
        <div className="relative">
          <Search className="w-4 h-4 text-gold-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            placeholder="Search for a location..."
            className={`input-luxury py-2.5 pl-10 pr-4 block w-full text-xs rounded-xl transition-all duration-300 ${
              validationError ? 'border-red-500/50 focus:border-red-500 bg-red-950/5' : ''
            }`}
          />
        </div>

        {/* Suggestion Dropdown */}
        {showSuggestions && (searchQuery.trim().length >= 3 || suggestions.length > 0) && (
          <div className="absolute left-0 right-0 z-50 mt-1 bg-matte-950/95 border border-gold-500/20 rounded-xl overflow-hidden shadow-elegant backdrop-blur-md max-h-60 overflow-y-auto">
            {isSearching ? (
              <div className="p-4 text-ivory-400 text-[11px] italic">Locating architectural nodes...</div>
            ) : suggestions.length > 0 ? (
              suggestions.map((item) => (
                <button
                  key={item.place_id}
                  type="button"
                  onClick={() => selectSuggestion(item)}
                  className="w-full text-left px-4 py-3 hover:bg-white/5 border-b border-white/5 last:border-b-0 text-ivory-200 hover:text-gold-450 transition-all text-xs flex flex-col gap-0.5 cursor-pointer"
                >
                  <span className="font-semibold text-ivory-100">{item.name}</span>
                  <span className="text-[10px] text-ivory-400 truncate">{item.formatted_address}</span>
                </button>
              ))
            ) : (
              <div className="p-4 text-ivory-400 text-[11px]">No matching locations found.</div>
            )}
          </div>
        )}
      </div>

      {/* Selected Address Display Card */}
      {coordinates?.formatted_address && (
        <div className="space-y-2">
          <span className="text-ivory-400 block font-medium">Selected Address</span>
          <div className="p-5 rounded-2xl bg-charcoal-900/60 border border-gold-500/10 shadow-glass">
            <div className="space-y-1.5 text-xs text-ivory-100 font-light leading-relaxed font-body">
              {addressParts.map((part, idx) => (
                <div key={idx} className={idx === 0 ? "font-semibold text-gold-400 text-sm tracking-wide mb-1" : ""}>
                  {part}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Map Element */}
      <div className="space-y-2">
        <div className="relative rounded-2xl overflow-hidden border border-gold-500/25 bg-matte-900 shadow-glass">
          <div ref={mapRef} className="h-64 w-full z-0 dark-leaflet-map" />
        </div>
        <p className="text-[10px] text-ivory-400 font-light italic leading-normal text-left pl-1">
          "Drag the marker if your construction site is not exactly on the suggested location."
        </p>
      </div>

      {/* Status bar, Validation, and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-charcoal-950/40 border border-white/5">
        <div className="flex items-center gap-2">
          {coordinates?.lat ? (
            <div className="flex items-center gap-1.5 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
              <span className="font-medium text-[11px]">✓ Exact location selected</span>
              {reverseGeocoding && <span className="text-[9px] text-ivory-400 italic">(updating address...)</span>}
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-gold-450">
              <AlertTriangle className="w-4 h-4" />
              <span className="font-medium text-[11px]">⚠ Please select a location</span>
            </div>
          )}
        </div>

        {coordinates?.lat && (
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${coordinates.lat},${coordinates.lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-[10px] uppercase font-semibold tracking-wider text-gold-400 hover:text-gold-300 transition-all border border-gold-500/20 hover:border-gold-500/40 px-3 py-1.5 rounded-lg bg-gold-500/5 hover:bg-gold-500/10 cursor-pointer"
          >
            <span>View on Google Maps</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>

      {/* Inline Validation Message */}
      {validationError && (
        <div className="p-3.5 rounded-xl bg-red-950/15 border border-red-500/20 text-red-300 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{validationError}</span>
        </div>
      )}
    </div>
  );
}
