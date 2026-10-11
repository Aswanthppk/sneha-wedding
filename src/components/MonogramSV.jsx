import React from 'react';

// Bespoke Luxury Royal Hindu Wedding Monogram: "S & V" (Sneha & Vaishnav)
export default function MonogramSV({ className = "w-28 h-28 md:w-32 md:h-32", glow = true }) {
  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      {/* Outer Golden Laurel & Beaded Royal Wreath SVG */}
      <svg
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full text-[#c5a059]"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#dfc282" />
            <stop offset="50%" stopColor="#c5a059" />
            <stop offset="100%" stopColor="#9a7632" />
          </linearGradient>
        </defs>

        {/* Outer Delicate Filigree Ring */}
        <circle cx="100" cy="100" r="88" stroke="url(#goldGrad)" strokeWidth="1" strokeDasharray="2 3" opacity="0.6" />
        <circle cx="100" cy="100" r="82" stroke="url(#goldGrad)" strokeWidth="1.2" opacity="0.8" />
        <circle cx="100" cy="100" r="76" stroke="url(#goldGrad)" strokeWidth="0.6" opacity="0.5" />

        {/* Top Auspicious Crown / Floral Crest Motif */}
        <path d="M100 6 C97 12 91 16 85 16 C92 18 97 22 100 28 C103 22 108 18 115 16 C109 16 103 12 100 6 Z" fill="url(#goldGrad)" />
        <circle cx="100" cy="14" r="1.8" fill="url(#goldGrad)" />

        {/* Bottom Lotus / Ribbon Flourish */}
        <path d="M100 194 C97 188 91 184 85 184 C92 182 97 178 100 172 C103 178 108 182 115 184 C109 184 103 188 100 194 Z" fill="url(#goldGrad)" />
        <circle cx="100" cy="186" r="1.8" fill="url(#goldGrad)" />

        {/* Left Laurel Foliage */}
        <path d="M36 70 C30 78 28 88 28 100 C28 112 30 122 36 130" stroke="url(#goldGrad)" strokeWidth="1" strokeLinecap="round" />
        <path d="M26 80 C20 83 17 89 20 93 C23 92 26 87 26 80 Z" fill="url(#goldGrad)" opacity="0.75" />
        <path d="M24 100 C17 101 15 106 18 110 C21 109 24 105 24 100 Z" fill="url(#goldGrad)" opacity="0.75" />
        <path d="M26 120 C20 117 17 111 20 107 C23 108 26 113 26 120 Z" fill="url(#goldGrad)" opacity="0.75" />

        {/* Right Laurel Foliage */}
        <path d="M164 70 C170 78 172 88 172 100 C172 112 170 122 164 130" stroke="url(#goldGrad)" strokeWidth="1" strokeLinecap="round" />
        <path d="M174 80 C180 83 183 89 180 93 C177 92 174 87 174 80 Z" fill="url(#goldGrad)" opacity="0.75" />
        <path d="M176 100 C183 101 185 106 182 110 C179 109 176 105 176 100 Z" fill="url(#goldGrad)" opacity="0.75" />
        <path d="M174 120 C180 117 183 111 180 107 C177 108 174 113 174 120 Z" fill="url(#goldGrad)" opacity="0.75" />

        {/* Four cardinal accent dots */}
        <circle cx="100" cy="24" r="2.2" fill="url(#goldGrad)" />
        <circle cx="100" cy="176" r="2.2" fill="url(#goldGrad)" />
        <circle cx="24" cy="100" r="2.2" fill="url(#goldGrad)" />
        <circle cx="176" cy="100" r="2.2" fill="url(#goldGrad)" />
      </svg>

      {/* Central Regal Calligraphy Typography: "S & V" */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="flex items-center justify-center transform -translate-y-0.5">
          {/* Capital S (Sneha) */}
          <span
            className="font-script text-3xl sm:text-4xl md:text-5xl text-[#c5a059] font-normal tracking-tight select-none drop-shadow-[0_1px_2px_rgba(20,30,50,0.15)]"
            style={{ textShadow: glow ? '0 0 12px rgba(197, 160, 89, 0.35)' : 'none' }}
          >
            S
          </span>

          {/* Delicate Ampersand */}
          <span className="font-cormorant italic text-xs sm:text-sm md:text-base text-[#c5a059]/80 mx-1 sm:mx-1.5 transform translate-y-1 font-medium select-none">
            &amp;
          </span>

          {/* Capital V (Vaishnav) */}
          <span
            className="font-script text-3xl sm:text-4xl md:text-5xl text-[#c5a059] font-normal tracking-tight select-none drop-shadow-[0_1px_2px_rgba(20,30,50,0.15)]"
            style={{ textShadow: glow ? '0 0 12px rgba(197, 160, 89, 0.35)' : 'none' }}
          >
            V
          </span>
        </div>
      </div>
    </div>
  );
}
