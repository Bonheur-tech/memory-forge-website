import { useState, useEffect, useRef } from "react";

const TARGET = new Date("2026-04-07T09:00:00+02:00");

function getTimeLeft() {
  const diff = TARGET.getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days:    Math.floor(diff / 86_400_000),
    hours:   Math.floor(diff / 3_600_000) % 24,
    minutes: Math.floor(diff / 60_000) % 60,
    seconds: Math.floor(diff / 1_000) % 60,
  };
}

/**
 * Animated digit pair — re-mounts inner span on value change to trigger the
 * CSS `digit-in` keyframe, giving a smooth roll-down effect.
 */
const AnimatedDigit = ({ value }: { value: number }) => {
  const str = String(value).padStart(2, "0");
  const key = useRef(0);
  const prev = useRef(str);

  if (prev.current !== str) {
    key.current += 1;
    prev.current = str;
  }

  return (
    <span
      key={key.current}
      className="digit-in tabular-nums block"
      style={{ lineHeight: 1 }}
    >
      {str}
    </span>
  );
};

interface Unit { label: string; value: number; glow?: boolean }

const CountdownTimer = () => {
  const [time, setTime] = useState(getTimeLeft);

  useEffect(() => {
    const id = setInterval(() => setTime(getTimeLeft()), 1_000);
    return () => clearInterval(id);
  }, []);

  const units: Unit[] = [
    { label: "Days",    value: time.days    },
    { label: "Hours",   value: time.hours   },
    { label: "Minutes", value: time.minutes },
    { label: "Seconds", value: time.seconds, glow: true },
  ];

  return (
    <div className="flex flex-col items-center gap-3">
      <p className="text-xs uppercase tracking-[0.25em] text-white/40 font-body">
        Countdown to Hackathon
      </p>

      <div className="flex items-stretch gap-2 sm:gap-3">
        {units.map((unit, i) => (
          <div key={unit.label} className="flex items-center gap-2 sm:gap-3">
            {/* Card */}
            <div
              className={`relative flex flex-col items-center justify-center glass rounded-xl
                px-3 sm:px-5 py-3 sm:py-4 min-w-[64px] sm:min-w-[82px]
                ${unit.glow ? "animate-pulse-ring" : ""}`}
              style={unit.glow ? {
                boxShadow: "0 0 24px rgba(139,92,246,0.25), inset 0 0 12px rgba(139,92,246,0.08)",
              } : undefined}
            >
              {/* Top shine */}
              <div className="absolute inset-x-2 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

              {/* Number */}
              <span className="text-2xl sm:text-4xl font-bold text-white overflow-hidden h-8 sm:h-11 flex items-center">
                <AnimatedDigit value={unit.value} />
              </span>

              {/* Label */}
              <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-white/45 mt-1.5 font-body">
                {unit.label}
              </span>
            </div>

            {/* Separator colon (not after last unit) */}
            {i < units.length - 1 && (
              <span className="text-white/25 text-lg sm:text-2xl font-light pb-1 select-none">:</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CountdownTimer;
