'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface ISSPosition {
  latitude: number;
  longitude: number;
  altitude: number;
  velocity: number;
  timestamp: number;
  visibility: string;
}

interface ISSMapProps {
  issData: ISSPosition | null;
}

// Fix for default markers in Leaflet with Next.js
const createISSIcon = () => {
  return L.divIcon({
    className: 'iss-marker',
    html: `
      <div style="
        width: 20px;
        height: 20px;
        background: #3b82f6;
        border: 3px solid #ffffff;
        border-radius: 50%;
        box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
        animation: pulse 2s infinite;
      ">
      </div>
      <style>
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.2); opacity: 0.7; }
          100% { transform: scale(1); opacity: 1; }
        }
      </style>
    `,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
};

export default function ISSMap({ issData }: ISSMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Initialize map
    const map = L.map(mapRef.current, {
      center: [0, 0],
      zoom: 2,
      zoomControl: true,
      attributionControl: true,
    });

    // Add tile layer (OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 18,
    }).addTo(map);

    // Add dark theme styling
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '© OpenStreetMap contributors, © CARTO',
      maxZoom: 18,
    }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapInstanceRef.current || !issData) return;

    const map = mapInstanceRef.current;
    const { latitude, longitude } = issData;

    // Remove existing marker
    if (markerRef.current) {
      map.removeLayer(markerRef.current);
    }

    // Create new marker
    const issIcon = createISSIcon();
    const marker = L.marker([latitude, longitude], { icon: issIcon }).addTo(map);

    // Add popup with ISS info
    const popupContent = `
      <div style="text-align: center; min-width: 200px;">
        <h3 style="margin: 0 0 10px 0; color: #3b82f6;">🛰️ ISS Position</h3>
        <p style="margin: 5px 0; font-size: 14px;">
          <strong>Latitude:</strong> ${latitude.toFixed(4)}°
        </p>
        <p style="margin: 5px 0; font-size: 14px;">
          <strong>Longitude:</strong> ${longitude.toFixed(4)}°
        </p>
        <p style="margin: 5px 0; font-size: 14px;">
          <strong>Altitude:</strong> ${issData.altitude} km
        </p>
        <p style="margin: 5px 0; font-size: 14px;">
          <strong>Velocity:</strong> ${issData.velocity} km/s
        </p>
        <p style="margin: 10px 0 0 0; font-size: 12px; color: #666;">
          Updated: ${new Date(issData.timestamp * 1000).toLocaleTimeString()}
        </p>
      </div>
    `;

    marker.bindPopup(popupContent);
    markerRef.current = marker;

    // Center map on ISS position with smooth animation
    map.setView([latitude, longitude], map.getZoom(), {
      animate: true,
      duration: 1,
    });

  }, [issData]);

  return (
    <div className="relative">
      <div
        ref={mapRef}
        className="w-full h-120 rounded-lg overflow-hidden"
        style={{ zIndex: 1 }}
      />
      <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded z-10">
        🛰️ ISS Position
      </div>
    </div>
  );
} 