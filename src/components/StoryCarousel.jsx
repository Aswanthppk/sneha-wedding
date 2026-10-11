import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const storyPhotos = [
  { src: '/assets/Storyboard-1-ROZeRR6g.webp', caption: 'Every journey led us here' },
  { src: '/assets/Storyboard-2-vMt0D-Xn.webp', caption: 'From adventures to forever' },
  { src: '/assets/Storyboard-3-CU__j4NP.webp', caption: 'We wrote our story. Now comes forever' },
  { src: '/assets/Storyboard-4-C9jvakjK.webp', caption: 'From miles apart to forever close' },
  { src: '/assets/Storyboard-5-CozcjNj1.webp', caption: 'Our best adventure begins now' },
  { src: '/assets/Storyboard-6-Dn8BwMkO.webp', caption: 'Our best adventure begins now' },
  { src: '/assets/Storyboard-7-BlXAwcZq.webp', caption: 'Our best adventure begins now' }
];

export default function StoryCarousel() {
  const [index, setIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(null);

  const prev = () => setIndex((i) => (i - 1 + storyPhotos.length) % storyPhotos.length);
  const next = () => setIndex((i) => (i + 1) % storyPhotos.length);

  useEffect(() => {
    storyPhotos.forEach((p) => {
      const img = new Image();
      img.src = p.src;
    });
  }, []);

  const handleTouchStart = (e) => setTouchStart(e.touches[0].clientX);
  const handleTouchEnd = (e) => {
    if (touchStart === null) return;
    const diff = touchStart - e.changedTouches[0].clientX;
    if (diff > 50) next();
    else if (diff < -50) prev();
    setTouchStart(null);
  };

  return (
    <div className="mt-8 flex items-center justify-center gap-2 md:gap-6">
      <button
        type="button"
        onClick={prev}
        aria-label="Previous photo"
        className="shrink-0 grid place-items-center h-9 w-9 rounded-full bg-white/80 backdrop-blur-sm border border-[var(--gold-soft)] text-primary shadow-sm hover:bg-white transition cursor-pointer"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      <div
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="relative w-[85%] max-w-xs sm:max-w-sm animate-float-slow select-none cursor-grab active:cursor-grabbing"
      >
        <div
          className={`relative transition duration-500 hover:rotate-0 drop-shadow-xl ${
            index % 2 === 0 ? 'rotate-[-1.5deg]' : 'rotate-[1.5deg]'
          }`}
        >
          {storyPhotos.map((p, i) => (
            <img
              key={i}
              src={p.src}
              alt={p.caption}
              loading="eager"
              decoding="async"
              className={`${
                i === 0 ? 'relative' : 'absolute inset-0'
              } w-full h-auto object-contain select-none pointer-events-none transition-opacity duration-300 rounded-lg ${
                i === index ? 'opacity-100' : 'opacity-0'
              }`}
            />
          ))}
        </div>

        <div className="mt-4 flex justify-center gap-1.5">
          {storyPhotos.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 w-1.5 rounded-full transition ${
                i === index ? 'bg-primary scale-125' : 'bg-[var(--gold-soft)]'
              }`}
            />
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={next}
        aria-label="Next photo"
        className="shrink-0 grid place-items-center h-9 w-9 rounded-full bg-white/80 backdrop-blur-sm border border-[var(--gold-soft)] text-primary shadow-sm hover:bg-white transition cursor-pointer"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
