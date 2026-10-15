"use client";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import Link from "next/link";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useEffect } from "react";
import type { ReelerDTO } from "@/lib/reelers-query";
import { inr } from "@/lib/utils";

const pin = (price: number) => L.divIcon({ className: "", html: `<div style="transform:translate(-50%,-100%);display:flex;flex-direction:column;align-items:center"><div style="padding:4px 10px;border-radius:999px;background:linear-gradient(100deg,#7C3AED,#EC4899,#F97316);color:#fff;font:600 12px Inter,system-ui;box-shadow:0 0 24px rgba(236,72,153,.8);white-space:nowrap">₹${price}</div><div style="width:10px;height:10px;border-radius:50%;background:#EC4899;box-shadow:0 0 0 6px rgba(236,72,153,.25);margin-top:4px"></div></div>`, iconSize: [0, 0], iconAnchor: [0, 0] });

function Fit({ pts }: { pts: [number, number][] }) {
  const map = useMap();
  useEffect(() => { if (pts.length) map.fitBounds(L.latLngBounds(pts).pad(0.3), { animate: true }); }, [pts, map]);
  return null;
}

export default function ReelerMap({ reelers, center }: { reelers: ReelerDTO[]; center: [number, number] }) {
  const pts = reelers.filter((r) => r.lat && r.lng).map((r) => [r.lat!, r.lng!] as [number, number]);
  return (
    <MapContainer center={center} zoom={11} className="h-full w-full z-0" attributionControl={false} scrollWheelZoom>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" className="map-tiles" />
      <Fit pts={pts} />
      {reelers.filter((r) => r.lat && r.lng).map((r) => (
        <Marker key={r.slug} position={[r.lat!, r.lng!]} icon={pin(r.startingPrice)}>
          <Popup closeButton={false} className="rw-popup">
            <Link href={`/reelers/${r.slug}`} className="flex items-center gap-3 p-1 text-fg">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={r.avatar} alt="" className="h-10 w-10 rounded-full object-cover" />
              <div><p className="font-semibold text-sm">{r.name}</p><p className="text-xs text-muted">{r.area} · ★ {r.rating} · from {inr(r.startingPrice)}</p></div>
            </Link>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
