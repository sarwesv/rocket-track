import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import type { Launch } from '../types';
import { formatCountdown } from '../utils/formatters';
import { mapsDirectionsUrl } from '../utils/formatters';

const rocketIcon = L.divIcon({
  html: '<div style="font-size:24px;line-height:1;">🚀</div>',
  className: '',
  iconSize: [28, 28],
  iconAnchor: [14, 28],
});

const userIcon = L.divIcon({
  html: '<div style="font-size:20px;line-height:1;">📍</div>',
  className: '',
  iconSize: [24, 24],
  iconAnchor: [12, 24],
});

interface Props {
  launches: Launch[];
  userCoords: { lat: number; lng: number } | null;
  onSelect: (launch: Launch) => void;
}

function FitBounds({ launches }: { launches: Launch[] }) {
  const map = useMap();
  if (launches.length === 0) return null;
  const bounds = L.latLngBounds(
    launches.map((l) => [parseFloat(l.pad.latitude), parseFloat(l.pad.longitude)])
  );
  map.fitBounds(bounds, { padding: [40, 40], maxZoom: 6 });
  return null;
}

export function LaunchMap({ launches, userCoords, onSelect }: Props) {
  return (
    <MapContainer
      center={[20, 0]}
      zoom={2}
      className="w-full h-full rounded-2xl z-0"
      style={{ minHeight: 400 }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />

      <FitBounds launches={launches} />

      {userCoords && (
        <Marker position={[userCoords.lat, userCoords.lng]} icon={userIcon}>
          <Popup>You are here</Popup>
        </Marker>
      )}

      {launches.map((launch) => (
        <Marker
          key={launch.id}
          position={[parseFloat(launch.pad.latitude), parseFloat(launch.pad.longitude)]}
          icon={rocketIcon}
        >
          <Popup>
            <div className="text-sm min-w-[180px]">
              <p className="font-semibold text-slate-800 leading-snug mb-1">{launch.name}</p>
              <p className="text-xs text-slate-500 mb-0.5">{launch.pad.location.name}</p>
              <p className="text-xs text-blue-600 font-medium mb-2">{formatCountdown(launch.net)}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => onSelect(launch)}
                  className="text-xs bg-slate-800 text-white rounded-lg px-2 py-1 hover:bg-slate-700"
                >
                  Details
                </button>
                <a
                  href={mapsDirectionsUrl(launch.pad.latitude, launch.pad.longitude)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs bg-blue-600 text-white rounded-lg px-2 py-1 hover:bg-blue-700"
                >
                  Directions
                </a>
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
