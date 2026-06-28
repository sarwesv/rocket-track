import type { Launch } from '../types';
import { formatDate, formatTime, formatCountdown, formatDistance, mapsDirectionsUrl } from '../utils/formatters';

interface Props {
  launch: Launch;
  onClose: () => void;
}

export function LaunchDetail({ launch, onClose }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {launch.image ? (
          <img
            src={launch.image.image_url}
            alt={launch.name}
            className="w-full h-48 object-cover rounded-t-2xl"
          />
        ) : (
          <div className="w-full h-48 bg-gradient-to-br from-blue-50 to-slate-100 rounded-t-2xl flex items-center justify-center">
            <span className="text-6xl">🚀</span>
          </div>
        )}

        <div className="p-5 flex flex-col gap-4">
          <div className="flex items-start justify-between gap-3">
            <h2 className="text-lg font-bold text-slate-800 leading-snug">{launch.name}</h2>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 text-xl leading-none shrink-0"
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <InfoBlock icon="📅" label="Date" value={formatDate(launch.net)} />
            <InfoBlock icon="🕐" label="Time" value={formatTime(launch.net)} />
            <InfoBlock icon="⏱" label="Countdown" value={formatCountdown(launch.net)} />
            <InfoBlock icon="🔴" label="Status" value={launch.status.name} />
          </div>

          <Divider />

          <Section title="Launch Site">
            <p className="text-sm text-slate-700 font-medium">{launch.pad.name}</p>
            <p className="text-xs text-slate-500">{launch.pad.location.name}</p>
            {launch.distance != null && (
              <p className="text-xs text-slate-500 mt-1">{formatDistance(launch.distance)} from your location</p>
            )}
          </Section>

          <Section title="Rocket">
            <p className="text-sm text-slate-700">
              <span className="font-medium">{launch.rocket.configuration.name}</span>
              <span className="text-slate-400"> · {launch.rocket.configuration.family}</span>
            </p>
            <p className="text-xs text-slate-500 mt-0.5">{launch.launch_service_provider.name}</p>
          </Section>

          {launch.mission && (
            <>
              <Divider />
              <Section title="Mission">
                <p className="text-sm font-medium text-slate-700">{launch.mission.name}</p>
                <div className="flex gap-2 mt-1 flex-wrap">
                  <Tag>{launch.mission.type}</Tag>
                  {launch.mission.orbit && <Tag>{launch.mission.orbit.name}</Tag>}
                </div>
                {launch.mission.description && (
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    {launch.mission.description}
                  </p>
                )}
              </Section>
            </>
          )}

          <a
            href={mapsDirectionsUrl(launch.pad.latitude, launch.pad.longitude)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 block text-center text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-3 transition-colors"
          >
            Get Directions →
          </a>
        </div>
      </div>
    </div>
  );
}

function InfoBlock({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="bg-slate-50 rounded-xl p-3">
      <div className="text-lg mb-1">{icon}</div>
      <div className="text-xs text-slate-400 uppercase tracking-wide">{label}</div>
      <div className="text-sm font-medium text-slate-700 mt-0.5">{value}</div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">{title}</h3>
      {children}
    </div>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">{children}</span>
  );
}

function Divider() {
  return <hr className="border-slate-100" />;
}
