import React from 'react';

const birds = [
  { id: 1, type: 'lr', top: '12%', duration: '8s', delay: '0s', scale: 0.85, flapDuration: '0.25s', yStart: '0px', yEnd: '-60px' },
  { id: 2, type: 'rl', top: '25%', duration: '10s', delay: '1.5s', scale: 0.75, flapDuration: '0.32s', yStart: '20px', yEnd: '-30px' },
  { id: 3, type: 'lr', top: '42%', duration: '9s', delay: '3.5s', scale: 0.95, flapDuration: '0.22s', yStart: '-40px', yEnd: '50px' },
  { id: 4, type: 'rl', top: '60%', duration: '11s', delay: '5.5s', scale: 0.7, flapDuration: '0.37s', yStart: '50px', yEnd: '-20px' },
  { id: 5, type: 'lr', top: '78%', duration: '12s', delay: '7.5s', scale: 0.8, flapDuration: '0.27s', yStart: '-10px', yEnd: '40px' }
];

const particles = [
  { id: 1, type: 'petal', left: '3%', duration: '14s', delay: '-2s', scale: 0.65, opacity: 0.55, drift: '60px' },
  { id: 2, type: 'leaf', left: '8%', duration: '19s', delay: '-10s', scale: 0.55, opacity: 0.45, drift: '100px' },
  { id: 3, type: 'petal', left: '15%', duration: '12s', delay: '-5s', scale: 0.75, opacity: 0.6, drift: '50px' },
  { id: 4, type: 'leaf', left: '20%', duration: '22s', delay: '-14s', scale: 0.5, opacity: 0.5, drift: '130px' },
  { id: 5, type: 'petal', left: '26%', duration: '16s', delay: '-8s', scale: 0.7, opacity: 0.55, drift: '80px' },
  { id: 6, type: 'leaf', left: '32%', duration: '20s', delay: '-1s', scale: 0.6, opacity: 0.45, drift: '90px' },
  { id: 7, type: 'petal', left: '38%', duration: '15s', delay: '-11s', scale: 0.65, opacity: 0.5, drift: '110px' },
  { id: 8, type: 'leaf', left: '44%', duration: '24s', delay: '-7s', scale: 0.45, opacity: 0.4, drift: '150px' },
  { id: 9, type: 'petal', left: '50%', duration: '13s', delay: '-4s', scale: 0.8, opacity: 0.6, drift: '70px' },
  { id: 10, type: 'leaf', left: '56%', duration: '21s', delay: '-16s', scale: 0.55, opacity: 0.45, drift: '120px' },
  { id: 11, type: 'petal', left: '62%', duration: '17s', delay: '-3s', scale: 0.7, opacity: 0.55, drift: '90px' },
  { id: 12, type: 'leaf', left: '68%', duration: '23s', delay: '-9s', scale: 0.5, opacity: 0.45, drift: '140px' },
  { id: 13, type: 'petal', left: '74%', duration: '15s', delay: '-13s', scale: 0.65, opacity: 0.5, drift: '100px' },
  { id: 14, type: 'leaf', left: '80%', duration: '18s', delay: '-6s', scale: 0.6, opacity: 0.4, drift: '80px' },
  { id: 15, type: 'petal', left: '85%', duration: '14s', delay: '-2s', scale: 0.75, opacity: 0.55, drift: '70px' },
  { id: 16, type: 'leaf', left: '91%', duration: '20s', delay: '-11s', scale: 0.5, opacity: 0.45, drift: '110px' },
  { id: 17, type: 'petal', left: '96%', duration: '16s', delay: '-5s', scale: 0.7, opacity: 0.5, drift: '90px' },
  { id: 18, type: 'leaf', left: '6%', duration: '25s', delay: '-3s', scale: 0.4, opacity: 0.4, drift: '160px' },
  { id: 19, type: 'petal', left: '18%', duration: '17s', delay: '-9s', scale: 0.65, opacity: 0.5, drift: '100px' },
  { id: 20, type: 'leaf', left: '29%', duration: '21s', delay: '-12s', scale: 0.55, opacity: 0.45, drift: '120px' },
  { id: 21, type: 'petal', left: '45%', duration: '14s', delay: '-4s', scale: 0.75, opacity: 0.55, drift: '75px' },
  { id: 22, type: 'leaf', left: '60%', duration: '22s', delay: '-8s', scale: 0.45, opacity: 0.4, drift: '135px' },
  { id: 23, type: 'petal', left: '78%', duration: '16s', delay: '-10s', scale: 0.7, opacity: 0.5, drift: '95px' },
  { id: 24, type: 'leaf', left: '93%', duration: '20s', delay: '-15s', scale: 0.5, opacity: 0.45, drift: '115px' }
];

function BirdSvg({ flapDuration }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="currentColor"
      className="w-10 h-10 select-none text-[var(--gold)]/60 drop-shadow-[0_2px_4px_rgba(0,0,0,0.08)]"
      style={{ '--flap-duration': flapDuration }}
    >
      <path d="M 30 28 C 23 15, 16 5, 9 1 C 15 7, 23 19, 30 28 Z" className="animate-flap-back opacity-70" />
      <path d="M 6 32 C 14 32, 28 33, 38 31 C 46 29.5, 54 26, 58 27 C 52 30, 44 36, 38 36 C 26 36, 14 34, 6 32 Z" className="opacity-95" />
      <path d="M 32 30 C 24 16, 16 6, 8 2 C 15 8, 24 20, 32 30 Z" className="animate-flap-front" />
    </svg>
  );
}

export default function AmbientEffects() {
  return (
    <>
      {/* Flying Birds */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-10 select-none" style={{ contain: 'strict' }}>
        {birds.map((b) => (
          <div
            key={b.id}
            className={b.type === 'lr' ? 'animate-fly-lr' : 'animate-fly-rl'}
            style={{
              '--fly-duration': b.duration,
              '--fly-delay': b.delay,
              '--bird-scale': b.scale,
              '--fly-y-start': b.yStart,
              '--fly-y-end': b.yEnd,
              top: b.top,
              left: b.type === 'lr' ? '-64px' : 'auto',
              right: b.type === 'rl' ? '-64px' : 'auto',
              position: 'absolute'
            }}
          >
            <BirdSvg flapDuration={b.flapDuration} />
          </div>
        ))}
      </div>

      {/* Falling Petals & Leaves (lightweight on mobile) */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-10 select-none" style={{ contain: 'strict' }}>
        {particles.map((p) => (
          <div
            key={p.id}
            className={`animate-petal ${p.id > 8 ? 'hidden md:block' : ''}`}
            style={{
              '--petal-duration': p.duration,
              '--petal-delay': p.delay,
              '--petal-scale': p.scale,
              '--petal-opacity': p.opacity,
              '--petal-drift': p.drift,
              left: p.left,
              top: '-50px',
              position: 'absolute'
            }}
          >
            {p.type === 'leaf' ? (
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-[var(--secondary)]">
                <path d="M12,2 C17,6 19,13 12,22 C5,13 7,6 12,2 Z" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-primary">
                <path d="M12,2 C18,4 20,10 16,16 C12,21 7,20 6,14 C5,8 8,4 12,2 Z" />
              </svg>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
