import { useState, useEffect } from 'react';
import type { Launch, LaunchResponse } from '../types';

const CACHE_KEY = 'rocket_track_launches';
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function useLaunches() {
  const [launches, setLaunches] = useState<Launch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      (pos) => setUserCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => setUserCoords(null)
    );
  }, []);

  useEffect(() => {
    async function fetchLaunches() {
      try {
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          const { data, ts } = JSON.parse(cached);
          if (Date.now() - ts < CACHE_TTL) {
            setLaunches(attachDistances(data, userCoords));
            setLoading(false);
            return;
          }
        }

        const res = await fetch(
          'https://ll2.thespacedevs.com/2.3.0/launches/upcoming/?limit=50&mode=detailed'
        );
        if (!res.ok) throw new Error(`API error: ${res.status}`);
        const json: LaunchResponse = await res.json();
        localStorage.setItem(CACHE_KEY, JSON.stringify({ data: json.results, ts: Date.now() }));
        setLaunches(attachDistances(json.results, userCoords));
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load launches');
      } finally {
        setLoading(false);
      }
    }

    fetchLaunches();
  }, [userCoords]);

  return { launches, loading, error, userCoords };
}

function attachDistances(
  launches: Launch[],
  coords: { lat: number; lng: number } | null
): Launch[] {
  if (!coords) return launches;
  return launches
    .map((l) => ({
      ...l,
      distance: haversineKm(
        coords.lat,
        coords.lng,
        parseFloat(l.pad.latitude),
        parseFloat(l.pad.longitude)
      ),
    }))
    .sort((a, b) => (a.distance ?? Infinity) - (b.distance ?? Infinity));
}
