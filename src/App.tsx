import { useState } from 'react';
import { useLaunches } from './hooks/useLaunches';
import { LaunchCard } from './components/LaunchCard';
import { LaunchDetail } from './components/LaunchDetail';
import { LaunchMap } from './components/LaunchMap';
import type { Launch } from './types';

type View = 'list' | 'map';

export default function App() {
  const { launches, loading, error, userCoords } = useLaunches();
  const [view, setView] = useState<View>('list');
  const [selected, setSelected] = useState<Launch | null>(null);
  const [search, setSearch] = useState('');

  const filtered = launches.filter((l) => {
    const q = search.toLowerCase();
    return (
      l.name.toLowerCase().includes(q) ||
      l.pad.location.name.toLowerCase().includes(q) ||
      (l.mission?.type ?? '').toLowerCase().includes(q) ||
      l.launch_service_provider.name.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🚀</span>
            <span className="font-bold text-slate-800 text-lg">RocketTrack</span>
          </div>

          <input
            type="search"
            placeholder="Search launches, agencies, locations…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 max-w-xs text-sm bg-slate-100 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-blue-300 text-slate-700 placeholder:text-slate-400"
          />

          <div className="flex bg-slate-100 rounded-xl p-1 gap-1">
            <button
              onClick={() => setView('list')}
              className={`px-3 py-1.5 text-sm rounded-lg font-medium transition-colors ${
                view === 'list'
                  ? 'bg-white text-slate-800 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              List
            </button>
            <button
              onClick={() => setView('map')}
              className={`px-3 py-1.5 text-sm rounded-lg font-medium transition-colors ${
                view === 'map'
                  ? 'bg-white text-slate-800 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Map
            </button>
          </div>
        </div>
      </header>

      {/* Location notice */}
      {!userCoords && !loading && (
        <div className="max-w-5xl mx-auto px-4 pt-4">
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-2 text-sm text-amber-700">
            Enable location access to see launches sorted by distance from you.
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="max-w-5xl mx-auto px-4 py-6">
        {loading && (
          <div className="flex flex-col items-center justify-center py-24 gap-3 text-slate-400">
            <div className="text-5xl animate-bounce">🚀</div>
            <p className="text-sm">Loading upcoming launches…</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center text-red-600 text-sm">
            {error}
          </div>
        )}

        {!loading && !error && view === 'list' && (
          <>
            <p className="text-xs text-slate-400 mb-4">
              {filtered.length} upcoming launch{filtered.length !== 1 ? 'es' : ''}
              {userCoords ? ' · sorted by distance' : ''}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((launch) => (
                <LaunchCard key={launch.id} launch={launch} onClick={() => setSelected(launch)} />
              ))}
            </div>
            {filtered.length === 0 && (
              <div className="text-center py-16 text-slate-400 text-sm">No launches match your search.</div>
            )}
          </>
        )}

        {!loading && !error && view === 'map' && (
          <div className="h-[calc(100vh-160px)] rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
            <LaunchMap
              launches={filtered}
              userCoords={userCoords}
              onSelect={(l) => setSelected(l)}
            />
          </div>
        )}
      </main>

      {/* Detail modal */}
      {selected && <LaunchDetail launch={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
