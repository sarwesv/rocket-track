import type { Launch } from '../types';
import { formatDate, formatTime, formatCountdown, formatDistance, mapsDirectionsUrl } from '../utils/formatters';

interface Props {
  launch: Launch;
  onClick: () => void;
}

const statusColors: Record<string, string> = {
  Go: 'bg-green-100 text-green-700',
  TBD: 'bg-yellow-100 text-yellow-700',
  TBC: 'bg-yellow-100 text-yellow-700',
  Hold: 'bg-orange-100 text-orange-700',
  Failure: 'bg-red-100 text-red-700',
  Success: 'bg-blue-100 text-blue-700',
};

export function LaunchCard({ launch, onClick }: Props) {
  const statusClass = statusColors[launch.status.abbrev] ?? 'bg-gray-100 text-gray-600';

  return (
    <div
      className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer overflow-hidden"
      onClick={onClick}
    >
      {launch.image && (
        <img
          src={launch.image.image_url}
          alt={launch.name}
          className="w-full h-36 object-cover"
        />
      )}
      {!launch.image && (
        <div className="w-full h-36 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
          <span className="text-4xl">🚀</span>
        </div>
      )}

      <div className="p-4 flex flex-col gap-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-slate-800 text-sm leading-snug line-clamp-2">
            {launch.name}
          </h3>
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full shrink-0 ${statusClass}`}>
            {launch.status.abbrev}
          </span>
        </div>

        <div className="flex flex-col gap-1 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <span>📅</span>
            <span>{formatDate(launch.net)} · {formatTime(launch.net)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span>⏱</span>
            <span className="font-medium text-slate-700">{formatCountdown(launch.net)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span>📍</span>
            <span className="truncate">{launch.pad.location.name}</span>
          </div>
          {launch.distance != null && (
            <div className="flex items-center gap-1.5">
              <span>📏</span>
              <span>{formatDistance(launch.distance)} away</span>
            </div>
          )}
        </div>

        {launch.mission && (
          <div className="bg-slate-50 rounded-lg px-3 py-2 text-xs text-slate-600">
            <span className="font-medium">{launch.mission.type}</span>
            {launch.mission.orbit && <span> · {launch.mission.orbit.name}</span>}
          </div>
        )}

        <a
          href={mapsDirectionsUrl(launch.pad.latitude, launch.pad.longitude)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="mt-1 w-full text-center text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-2 transition-colors"
        >
          Get Directions
        </a>
      </div>
    </div>
  );
}
