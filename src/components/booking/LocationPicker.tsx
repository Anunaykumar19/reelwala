"use client";
import "leaflet/dist/leaflet.css";
import { useEffect, useMemo } from "react";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from "react-leaflet";

const pin = L.divIcon({ className: "", html: `<div style="width:22px;height:22px;border-radius:50%;background:linear-gradient(100deg,#7C3AED,#EC4899,#F97316);box-shadow:0 0 0 6px rgba(236,72,153,.25),0 0 24px rgba(236,72,153,.8);border:2px solid #fff"></div>`, iconSize: [22, 22], iconAnchor: [11, 11] });

function Events({ onPick }: { onPick: (lat: number, lng: number) => void }) {
  useMapEvents({ click: (e) => onPick(e.latlng.lat, e.latlng.lng) });
  return null;
}
function Recenter({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => { map.flyTo([lat, lng], Math.max(map.getZoom(), 13), { duration: 0.8 }); }, [lat, lng, map]);
  return null;
}

export default function LocationPicker({ lat, lng, center, onPick, className }: { lat: number | null; lng: number | null; center: [number, number]; onPick: (lat: number, lng: number) => void; className?: string }) {
  const c = useMemo<[number, number]>(() => (lat != null && lng != null ? [lat, lng] : center), [lat, lng, center]);
  return (
    <div className={className}>
      <MapContainer center={c} zoom={12} scrollWheelZoom={false} className="h-full w-full rounded-2xl z-0" attributionControl={false}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" className="map-tiles" />
        <Events onPick={onPick} />
        <Recenter lat={c[0]} lng={c[1]} />
        {lat != null && lng != null && <Marker position={[lat, lng]} icon={pin} draggable eventHandlers={{ dragend: (e) => { const p = (e.target as L.Marker).getLatLng(); onPick(p.lat, p.lng); } }} />}
      </MapContainer>
    </div>
  );
}
