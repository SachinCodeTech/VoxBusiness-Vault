import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Vendor } from '../types';
import { useApp } from '../context/AppContext';
import { Phone, MessageCircle, Navigation, Star, CheckCircle2, X, ExternalLink } from 'lucide-react';

interface InteractiveMapProps {
  vendors: (Vendor & { distanceKm?: number })[];
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({ vendors }) => {
  const {
    selectedCity,
    cities,
    userCoords,
    setSelectedVendorForProfile,
    trackVendorMetric
  } = useApp();

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const [activeVendor, setActiveVendor] = useState<(Vendor & { distanceKm?: number }) | null>(
    vendors[0] || null
  );

  // Determine current center coordinates
  const currentCityObj = cities.find(
    (c) => c.name.toLowerCase() === selectedCity.toLowerCase()
  ) || cities[0];

  const defaultLat = currentCityObj?.lat || 23.0225;
  const defaultLng = currentCityObj?.lng || 72.5714;

  // Close active card with Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && activeVendor) {
        setActiveVendor(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeVendor]);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Initialize Leaflet map
      const map = L.map(mapContainerRef.current, {
        center: [defaultLat, defaultLng],
        zoom: 13,
        zoomControl: false,
        scrollWheelZoom: false
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);

      L.control.zoom({ position: 'topright' }).addTo(map);
      mapInstanceRef.current = map;
    } else {
      mapInstanceRef.current.setView([defaultLat, defaultLng], 12);
    }

    return () => {
      // cleanup on unmount
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update map center when city changes
  useEffect(() => {
    if (mapInstanceRef.current && currentCityObj) {
      mapInstanceRef.current.setView([currentCityObj.lat, currentCityObj.lng], 12);
    }
  }, [selectedCity]);

  // Update markers when vendors or user coords change
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear old markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    // Add user location pin if available
    if (userCoords) {
      const userIcon = L.divIcon({
        className: 'user-location-pin',
        html: `<div style="background-color: #0284c7; width: 18px; height: 18px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(2,132,199,0.5);"></div>`,
        iconSize: [18, 18],
        iconAnchor: [9, 9]
      });
      const userMarker = L.marker([userCoords.lat, userCoords.lng], { icon: userIcon })
        .addTo(map)
        .bindTooltip('Your Location');
      markersRef.current.push(userMarker);
    }

    // Add vendor pins
    vendors.forEach((vendor) => {
      const isSelected = activeVendor?.id === vendor.id;
      const isVerified = vendor.verificationStatus === 'verified';

      const customIcon = L.divIcon({
        className: 'custom-vendor-pin',
        html: `
          <div style="
            background-color: ${isSelected ? '#0284c7' : isVerified ? '#0f172a' : '#475569'};
            color: white;
            font-size: 11px;
            font-weight: bold;
            padding: 4px 8px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            gap: 4px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.25);
            border: 2px solid white;
            transform: ${isSelected ? 'scale(1.15)' : 'scale(1)'};
            transition: transform 0.15s ease;
            white-space: nowrap;
          ">
            <span>${isVerified ? '✓ ' : ''}${vendor.businessName.split(' ')[0]}</span>
            <span style="opacity: 0.8; font-size: 9px;">⭐${vendor.rating}</span>
          </div>
        `,
        iconSize: [120, 32],
        iconAnchor: [60, 32]
      });

      const marker = L.marker([vendor.lat, vendor.lng], { icon: customIcon }).addTo(map);

      marker.on('click', () => {
        setActiveVendor(vendor);
        map.panTo([vendor.lat, vendor.lng], { animate: true });
      });

      markersRef.current.push(marker);
    });
  }, [vendors, activeVendor, userCoords]);

  return (
    <div className="relative w-full h-[520px] sm:h-[620px] rounded-3xl overflow-hidden border border-slate-200/90 dark:border-slate-800 shadow-md">
      {/* Map DOM Element */}
      <div ref={mapContainerRef} className="w-full h-full z-10" />

      {/* Map Header Overlay */}
      <div className="absolute top-4 left-4 z-20 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-slate-200/80 dark:border-slate-700 shadow-sm flex items-center gap-2 text-xs">
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
        <span className="font-semibold text-slate-800 dark:text-slate-200">
          Showing {vendors.length} vendors in {selectedCity}
        </span>
      </div>

      {/* Active Vendor Floating Preview Bottom Card */}
      {activeVendor && (
        <div className="absolute bottom-4 left-4 right-4 sm:left-6 sm:max-w-md z-20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xl p-4 animate-fade-in">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 flex-1 min-w-0">
              <img
                src={activeVendor.logoUrl}
                alt={activeVendor.businessName}
                className="w-12 h-12 rounded-xl object-cover shrink-0 border border-slate-200"
              />
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                    {activeVendor.businessName}
                  </h4>
                  {activeVendor.verificationStatus === 'verified' && (
                    <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" />
                  )}
                </div>
                <div className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                  <span>{activeVendor.area}</span>
                  <span>·</span>
                  <span className="flex items-center text-amber-500 font-bold">
                    <Star className="w-3 h-3 fill-current mr-0.5" />
                    {activeVendor.rating}
                  </span>
                  {activeVendor.distanceKm !== undefined && (
                    <>
                      <span>·</span>
                      <span className="text-sky-600 font-medium">
                        {activeVendor.distanceKm} km
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={() => setActiveVendor(null)}
              className="min-w-[40px] min-h-[40px] p-2 bg-slate-100 hover:bg-rose-50 dark:bg-slate-800 dark:hover:bg-rose-950/60 text-slate-500 hover:text-rose-600 rounded-xl shrink-0 flex items-center justify-center transition-colors border border-slate-200 dark:border-slate-700"
              aria-label="Close preview card"
              title="Close card"
            >
              <X className="w-5 h-5 stroke-[2.5]" />
            </button>
          </div>

          <p className="mt-2 text-xs text-slate-600 dark:text-slate-300 line-clamp-1">
            {activeVendor.address}
          </p>

          <div className="mt-3 grid grid-cols-4 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => {
                trackVendorMetric(activeVendor.id, 'calls');
                window.location.href = `tel:${activeVendor.phone.replace(/\s+/g, '')}`;
              }}
              className="py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1"
            >
              <Phone className="w-3.5 h-3.5 fill-current" />
              <span>Call</span>
            </button>

            <button
              onClick={() => {
                trackVendorMetric(activeVendor.id, 'whatsapp');
                const msg = encodeURIComponent(
                  `Hello ${activeVendor.ownerName}, I found "${activeVendor.businessName}" on the Vox Business Vault Gujarat Map.`
                );
                window.open(`https://wa.me/${activeVendor.whatsapp}?text=${msg}`, '_blank');
              }}
              className="py-2 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs font-semibold flex items-center justify-center gap-1"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WA</span>
            </button>

            <button
              onClick={() => {
                trackVendorMetric(activeVendor.id, 'directions');
                const dest = encodeURIComponent(
                  `${activeVendor.businessName}, ${activeVendor.address}, ${activeVendor.city}`
                );
                window.open(`https://www.google.com/maps/dir/?api=1&destination=${dest}`, '_blank');
              }}
              className="py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold flex items-center justify-center gap-1"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Route</span>
            </button>

            <button
              onClick={() => setSelectedVendorForProfile(activeVendor)}
              className="py-2 bg-slate-900 dark:bg-sky-600 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1"
            >
              <span>Profile</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
