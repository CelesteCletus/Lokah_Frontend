import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { MapPin, Search, Navigation, CheckCircle2, ChevronDown, ChevronUp, Info } from 'lucide-react';

interface MapLocationPickerProps {
  coordinates: { lat: number; lng: number };
  onChange: (coords: { lat: number; lng: number }) => void;
}

export default function MapLocationPicker({ coordinates, onChange }: MapLocationPickerProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [noticeMessage, setNoticeMessage] = useState('');
  const [showManualCoords, setShowManualCoords] = useState(false);

  const [latInput, setLatInput] = useState(coordinates.lat.toString());
  const [lngInput, setLngInput] = useState(coordinates.lng.toString());

  // Sync inputs when coordinates change externally
  useEffect(() => {
    setLatInput(coordinates.lat.toFixed(6));
    setLngInput(coordinates.lng.toFixed(6));
  }, [coordinates.lat, coordinates.lng]);

  // Initialize Leaflet map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const goldIcon = L.divIcon({
      className: 'custom-gold-marker',
      html: `
        <div style="
          width: 36px;
          height: 36px;
          background: linear-gradient(135deg, #d4af37 0%, #aa7c11 100%);
          border: 2px solid #fff;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          box-shadow: 0 0 15px rgba(212, 175, 55, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: grab;
        ">
          <div style="
            width: 10px;
            height: 10px;
            background: #0d0d0d;
            border-radius: 50%;
            transform: rotate(45deg);
          "></div>
        </div>
      `,
      iconSize: [36, 36],
      iconAnchor: [18, 36],
      popupAnchor: [0, -36]
    });

    const initialLat = coordinates.lat || 10.0121;
    const initialLng = coordinates.lng || 76.3532;

    const map = L.map(mapContainerRef.current, {
      center: [initialLat, initialLng],
      zoom: 14,
      zoomControl: true
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19
    }).addTo(map);

    const marker = L.marker([initialLat, initialLng], {
      icon: goldIcon,
      draggable: true
    }).addTo(map);

    marker.bindPopup('<strong style="color:#d4af37;">Property Location</strong><br/>Drag to reposition').openPopup();

    marker.on('dragend', () => {
      const pos = marker.getLatLng();
      onChange({ lat: Number(pos.lat.toFixed(6)), lng: Number(pos.lng.toFixed(6)) });
    });

    map.on('click', (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      marker.setLatLng([lat, lng]);
      onChange({ lat: Number(lat.toFixed(6)), lng: Number(lng.toFixed(6)) });
    });

    mapInstanceRef.current = map;
    markerRef.current = marker;

    setTimeout(() => { map.invalidateSize(); }, 250);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
      markerRef.current = null;
    };
  }, []);

  // Sync map view when coordinates change
  useEffect(() => {
    if (mapInstanceRef.current && markerRef.current) {
      const { lat, lng } = coordinates;
      const currentPos = markerRef.current.getLatLng();
      if (currentPos.lat !== lat || currentPos.lng !== lng) {
        markerRef.current.setLatLng([lat, lng]);
        mapInstanceRef.current.setView([lat, lng], mapInstanceRef.current.getZoom(), { animate: true });
      }
    }
  }, [coordinates.lat, coordinates.lng]);

  // Address search via Nominatim
  const handleAddressSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    setNoticeMessage('');
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`
      );
      const results = await response.json();
      if (results && results.length > 0) {
        const top = results[0];
        const newCoords = { lat: Number(parseFloat(top.lat).toFixed(6)), lng: Number(parseFloat(top.lon).toFixed(6)) };
        onChange(newCoords);
        if (mapInstanceRef.current && markerRef.current) {
          markerRef.current.setLatLng([newCoords.lat, newCoords.lng]);
          mapInstanceRef.current.setView([newCoords.lat, newCoords.lng], 15, { animate: true });
        }
      } else {
        setNoticeMessage("No results found. Try a different address or use the map to pin the location manually.");
      }
    } catch {
      setNoticeMessage("Search unavailable. Please pin the location on the map directly.");
    } finally {
      setIsSearching(false);
    }
  };

  // Manual lat/lng entry
  const handleManualCoordSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    const parsedLat = parseFloat(latInput);
    const parsedLng = parseFloat(lngInput);
    if (!isNaN(parsedLat) && !isNaN(parsedLng) &&
        parsedLat >= -90 && parsedLat <= 90 &&
        parsedLng >= -180 && parsedLng <= 180) {
      onChange({ lat: Number(parsedLat.toFixed(6)), lng: Number(parsedLng.toFixed(6)) });
      setNoticeMessage('');
    } else {
      setNoticeMessage("Enter valid coordinates: latitude between -90 and 90, longitude between -180 and 180.");
    }
  };

  // GPS auto-detect
  const handleGPSLocate = () => {
    if (!navigator.geolocation) {
      setNoticeMessage("Your browser doesn't support GPS location. Search by address instead.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const newCoords = {
          lat: Number(pos.coords.latitude.toFixed(6)),
          lng: Number(pos.coords.longitude.toFixed(6))
        };
        onChange(newCoords);
        if (mapInstanceRef.current && markerRef.current) {
          markerRef.current.setLatLng([newCoords.lat, newCoords.lng]);
          mapInstanceRef.current.setView([newCoords.lat, newCoords.lng], 16, { animate: true });
        }
      },
      () => setNoticeMessage("GPS access was denied. Search by address or pin the location on the map.")
    );
  };

  return (
    <div className="space-y-4 text-left font-body py-2">

      {/* Address Search */}
      <div className="space-y-2">
        <label className="text-ivory-400 text-xs font-medium block">Search by address</label>
        <form onSubmit={handleAddressSearch} className="flex gap-2">
          <div className="relative flex-grow">
            <Search className="w-3.5 h-3.5 text-gold-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="e.g. Kakkanad, Kochi or a landmark name..."
              className="input-luxury py-2.5 pl-10 pr-4 w-full block text-xs"
            />
          </div>
          <button
            type="submit"
            disabled={isSearching}
            className="px-5 py-2.5 bg-gold-500 hover:bg-gold-600 text-matte-black font-semibold rounded-xl text-xs uppercase tracking-wider transition-all disabled:opacity-50 cursor-pointer shrink-0"
          >
            {isSearching ? 'Searching...' : 'Search'}
          </button>
        </form>
      </div>

      {/* Notice / Error */}
      {noticeMessage && (
        <div className="p-3 rounded-xl bg-matte-900 border border-ivory-400/10 text-ivory-300 text-xs flex items-start gap-2.5 leading-relaxed">
          <Info className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
          <span>{noticeMessage}</span>
        </div>
      )}

      {/* Map */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-ivory-400 text-xs font-medium flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-gold-400" />
            Pin on map
          </span>
          <span className="text-[10px] text-ivory-500 font-light">
            Click anywhere or drag the pin to reposition
          </span>
        </div>

        <div className="relative rounded-2xl overflow-hidden border border-gold-500/25 bg-matte-900 shadow-elegant">
          <div ref={mapContainerRef} className="h-64 w-full z-0 dark-leaflet-map" />

          {/* GPS button */}
          <button
            type="button"
            onClick={handleGPSLocate}
            title="Use my current location"
            className="absolute bottom-3 right-3 z-[400] px-3 py-2 rounded-xl bg-matte-950/90 border border-gold-500/30 text-gold-400 hover:bg-gold-500 hover:text-matte-black transition-all shadow-glass cursor-pointer flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider"
          >
            <Navigation className="w-3.5 h-3.5" />
            Use my location
          </button>
        </div>
      </div>

      {/* Confirmation + optional manual coords */}
      <div className="p-4 rounded-2xl bg-charcoal-900/50 border border-white/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-xs font-medium text-ivory-100">
              Location set
            </span>
            <span className="text-[10px] text-ivory-450 font-mono">
              ({coordinates.lat.toFixed(4)}, {coordinates.lng.toFixed(4)})
            </span>
          </div>

          <button
            type="button"
            onClick={() => setShowManualCoords(!showManualCoords)}
            className="text-[10px] text-ivory-400 hover:text-gold-400 flex items-center gap-1 transition-all cursor-pointer"
          >
            <span>Enter coordinates manually</span>
            {showManualCoords ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>

        {showManualCoords && (
          <form
            onSubmit={handleManualCoordSubmit}
            className="grid grid-cols-2 gap-3 pt-3 mt-3 border-t border-white/5"
          >
            <div>
              <label className="text-ivory-400 text-[11px] block mb-1">Latitude</label>
              <input
                type="number"
                step="any"
                value={latInput}
                onChange={(e) => setLatInput(e.target.value)}
                onBlur={() => handleManualCoordSubmit()}
                className="input-luxury py-2 px-3 block w-full text-xs font-mono"
              />
            </div>
            <div>
              <label className="text-ivory-400 text-[11px] block mb-1">Longitude</label>
              <input
                type="number"
                step="any"
                value={lngInput}
                onChange={(e) => setLngInput(e.target.value)}
                onBlur={() => handleManualCoordSubmit()}
                className="input-luxury py-2 px-3 block w-full text-xs font-mono"
              />
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
