import React, { useState, useEffect } from 'react';

const TARGET_DATE = new Date('2026-12-27T11:00:00+05:30');

function useCountdown(targetDate) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const diff = Math.max(0, targetDate.getTime() - now.getTime());
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  return { days, hours, minutes, seconds };
}

function OrnateColumn() {
  return (
    <svg className="w-8 h-20 text-[var(--gold)]/60 select-none" viewBox="0 0 24 80" fill="currentColor">
      <line x1="12" y1="5" x2="12" y2="75" stroke="currentColor" strokeWidth="1" strokeDasharray="2,2" />
      <path d="M 12 10 C 6 10, 4 6, 12 2 C 20 6, 18 10, 12 10" />
      <path d="M 12 25 C 6 23, 5 18, 9 16 C 13 14, 12 25, 12 25" />
      <path d="M 12 25 C 18 23, 19 18, 15 16 C 11 14, 12 25, 12 25" />
      <path d="M 12 40 C 6 38, 5 33, 9 31 C 13 29, 12 40, 12 40" />
      <path d="M 12 40 C 18 38, 19 33, 15 31 C 11 29, 12 40, 12 40" />
      <path d="M 12 55 C 6 53, 5 48, 9 46 C 13 44, 12 55, 12 55" />
      <path d="M 12 55 C 18 53, 19 48, 15 46 C 11 44, 12 55, 12 55" />
      <path d="M 12 70 C 8 70, 7 66, 12 62 C 17 66, 16 70, 12 70" />
    </svg>
  );
}

export default function Countdown({ isVisible }) {
  const { days, hours, minutes, seconds } = useCountdown(TARGET_DATE);

  return (
    <div
      className={`w-full transition-all duration-1000 transform ${
        isVisible
          ? 'opacity-100 translate-y-0 max-h-[350px] mt-2 md:mt-6'
          : 'opacity-0 -translate-y-2 max-h-0 overflow-hidden pointer-events-none mt-0'
      }`}
    >
      <div className="flex items-center justify-center gap-3 text-[var(--gold)] text-[0.65rem] sm:text-xs md:text-sm font-caps tracking-[0.25em] mb-2 md:mb-4 select-none">
        <span className="text-[var(--gold)] text-sm md:text-base opacity-80">⤙</span>
        <span>THE COUNTDOWN BEGINS</span>
        <span className="text-[var(--gold)] text-sm md:text-base opacity-80">⤚</span>
      </div>

      <div className="relative w-full max-w-[280px] sm:max-w-[310px] md:max-w-[520px] mx-auto my-1 flex items-center justify-center gap-4">
        <div className="hidden md:block select-none transform -translate-y-1">
          <OrnateColumn />
        </div>

        <div className="flex-1 w-full flex items-center justify-center py-3 px-1 md:py-5 md:px-6 border border-[var(--gold)]/30 bg-white/20 backdrop-blur-md rounded-xl md:rounded-2xl select-none shadow-sm">
          <div className="flex-1 flex flex-col items-center">
            <span className="font-display text-2xl sm:text-3xl md:text-5xl font-semibold leading-none tabular-nums text-[var(--foreground)]">
              {String(days).padStart(2, '0')}
            </span>
            <span className="font-caps text-[0.45rem] sm:text-[0.5rem] md:text-[0.65rem] tracking-widest text-[var(--gold)] mt-2">
              DAYS
            </span>
          </div>
          <span className="h-8 md:h-12 w-[0.5px] bg-[var(--gold)]/30" />

          <div className="flex-1 flex flex-col items-center">
            <span className="font-display text-2xl sm:text-3xl md:text-5xl font-semibold leading-none tabular-nums text-[var(--foreground)]">
              {String(hours).padStart(2, '0')}
            </span>
            <span className="font-caps text-[0.45rem] sm:text-[0.5rem] md:text-[0.65rem] tracking-widest text-[var(--gold)] mt-2">
              HRS
            </span>
          </div>
          <span className="h-8 md:h-12 w-[0.5px] bg-[var(--gold)]/30" />

          <div className="flex-1 flex flex-col items-center">
            <span className="font-display text-2xl sm:text-3xl md:text-5xl font-semibold leading-none tabular-nums text-[var(--foreground)]">
              {String(minutes).padStart(2, '0')}
            </span>
            <span className="font-caps text-[0.45rem] sm:text-[0.5rem] md:text-[0.65rem] tracking-widest text-[var(--gold)] mt-2">
              MINS
            </span>
          </div>
          <span className="h-8 md:h-12 w-[0.5px] bg-[var(--gold)]/30" />

          <div className="flex-1 flex flex-col items-center">
            <span className="font-display text-2xl sm:text-3xl md:text-5xl font-semibold leading-none tabular-nums text-[var(--foreground)]">
              {String(seconds).padStart(2, '0')}
            </span>
            <span className="font-caps text-[0.45rem] sm:text-[0.5rem] md:text-[0.65rem] tracking-widest text-[var(--gold)] mt-2">
              SECS
            </span>
          </div>
        </div>

        <div className="hidden md:block select-none transform -translate-y-1 scale-x-[-1]">
          <OrnateColumn />
        </div>
      </div>

      <p className="font-script text-[var(--foreground)] text-xl sm:text-2xl md:text-3xl mt-3 md:mt-4 select-none flex items-center justify-center gap-2">
        <span className="text-xs md:text-sm">❦</span>
        <span>Until our forever begins</span>
        <span className="text-xs md:text-sm">❦</span>
      </p>
    </div>
  );
}
