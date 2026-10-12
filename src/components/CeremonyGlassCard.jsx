import React, { useState, useRef } from 'react';

// Tasteful, sacred minimal Lord Ganesha icon in antique gold
function MinimalGaneshaIcon({ className = "w-8 h-9 text-[#c5a059]" }) {
  return (
    <svg
      viewBox="0 0 40 45"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {/* Auspicious Tilak / Trishul mark */}
      <path d="M20 3v8" />
      <path d="M17 6c0 3 3 5 3 5s3-2 3-5" />
      <circle cx="20" cy="11.5" r="0.9" fill="currentColor" />
      {/* Graceful Ears */}
      <path d="M13 16c-4-2-7 1-7 6s5 7 8 6" />
      <path d="M27 16c4-2 7 1 7 6s-5 7-8 6" />
      {/* Crown / Head curve */}
      <path d="M13 16c3-1 11-1 14 0" />
      {/* Trunk curve flowing gracefully */}
      <path d="M17 19c2 4 4 9 1 14-2 3-4 4-5 6 0 2 2 3 4 3 4 0 6-3 7-5" />
      {/* Sacred Modak */}
      <circle cx="27" cy="34" r="1.4" fill="currentColor" />
      {/* Single auspicious tusk */}
      <path d="M14 24l-3 1.5" />
    </svg>
  );
}

// Delicate antique-gold floral hairline divider underneath heading
function FloralFlourishDivider({ className = "w-44 sm:w-56 text-[#c5a059]" }) {
  return (
    <svg viewBox="0 0 240 24" fill="currentColor" className={className} aria-hidden="true">
      {/* Center diamond & blossom */}
      <circle cx="120" cy="12" r="2.2" />
      <path d="M120 7c-1.5 2.5-1.5 3.5 0 5 1.5-1.5 1.5-2.5 0-5z" />
      <path d="M120 17c-1.5-2.5-1.5-3.5 0-5 1.5 1.5 1.5 2.5 0 5z" />
      {/* Left wing hairlines & petals */}
      <path d="M112 12H30" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" />
      <path d="M95 12c-3-2.5-8-4-12-3 4.5 1.5 8 2.5 12 3z" />
      <path d="M95 12c-3 2.5-8 4-12 3 4.5-1.5 8-2.5 12-3z" />
      <path d="M68 12c-2.5-2-6-3-9-2.5 3.5 1 6 2 9 2.5z" />
      <path d="M68 12c-2.5 2-6 3-9 2.5 3.5-1 6-2 9-2.5z" />
      <circle cx="28" cy="12" r="1.2" />
      {/* Right wing hairlines & petals */}
      <path d="M128 12h82" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" />
      <path d="M145 12c3-2.5 8-4 12-3-4.5 1.5-8 2.5-12 3z" />
      <path d="M145 12c3 2.5 8 4 12 3-4.5-1.5-8-2.5-12-3z" />
      <path d="M172 12c2.5-2 6-3 9-2.5-3.5 1-6 2-9 2.5z" />
      <path d="M172 12c2.5 2 6 3 9 2.5-3.5-1-6-2-9-2.5z" />
      <circle cx="212" cy="12" r="1.2" />
    </svg>
  );
}

export default function CeremonyGlassCard() {
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ rotateX: 1, rotateY: -0.5, glareX: 50, glareY: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    // Only perform 3D tilt tracking on devices with a mouse/precision pointer, not on touch screens during scrolling
    if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(pointer: coarse)').matches) {
      return;
    }
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Subtle, gentle 3D tilt (limited between -4 and +4 degrees for sophisticated elegance)
    const rotateX = -((y - centerY) / centerY) * 4;
    const rotateY = ((x - centerX) / centerX) * 4;

    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;

    setTilt({ rotateX, rotateY, glareX, glareY });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    // Return smoothly to serene resting 3D angle
    setTilt({ rotateX: 1, rotateY: -0.5, glareX: 50, glareY: 50 });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  return (
    <div
      className="w-full max-w-[880px] relative z-10 flex flex-col items-center my-4 px-4 sm:px-6"
      style={{ perspective: '1200px' }}
    >
      {/* 
        Redesigned Wedding Ceremony Card:
        - Large, softly rounded card with border radius 28–36px
        - Translucent ivory pearl-white surface
        - Extremely subtle warm-gold border (no black border!)
        - Soft ambient shadow with visible rounded corners
        - Generous spacing & modern Hindu wedding aesthetic
      */}
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`,
          transformStyle: 'preserve-3d',
          transition: isHovered ? 'transform 0.15s ease-out' : 'transform 0.7s cubic-bezier(0.2, 0.8, 0.2, 1)',
        }}
        className="w-full relative group rounded-[28px] sm:rounded-[36px] bg-[#fefdfb]/96 md:backdrop-blur-xl border border-[#c5a059]/25 ring-1 ring-white/80 shadow-[0_25px_65px_-15px_rgba(21,42,74,0.12),0_10px_30px_-5px_rgba(197,160,89,0.08)] py-12 px-6 sm:py-16 sm:px-12 md:px-20 text-center select-none overflow-hidden transition-shadow duration-500 hover:shadow-[0_30px_80px_-15px_rgba(21,42,74,0.18),0_12px_35px_-5px_rgba(197,160,89,0.14)]"
      >
        {/* Subtle Pearl Shimmer that gently follows the cursor */}
        <div
          className="pointer-events-none absolute inset-0 opacity-40 transition-opacity duration-500"
          style={{
            background: `radial-gradient(circle 500px at ${tilt.glareX}% ${tilt.glareY}%, rgba(255, 255, 255, 0.8), transparent 70%)`,
          }}
        />

        {/* Delicate Corner Vignette Accents */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/70 via-transparent to-[#fbf8f0]/40" />

        {/* ==============================================================
            3. HEADER AND DATE
            Auspicious Hindu Symbol + 27TH DECEMBER, 2026 + Sunday
           ============================================================== */}
        <div className="relative flex flex-col items-center" style={{ transform: 'translateZ(25px)' }}>
          {/* Tasteful Minimal Gold Ganesha Motif */}
          <div className="mb-3 flex items-center justify-center">
            <MinimalGaneshaIcon className="w-8 h-9 text-[#c5a059] opacity-90 drop-shadow-sm transition-transform duration-300 group-hover:scale-105" />
          </div>

          {/* Date in Refined Serif */}
          <h2 className="font-serif-display text-lg sm:text-xl md:text-2xl text-[#152a4a] font-medium tracking-[0.22em] uppercase">
            27TH DECEMBER, 2026
          </h2>

          {/* Weekday in Elegant Italic Serif */}
          <p className="font-cormorant italic text-[#152a4a]/80 text-base sm:text-lg mt-1 font-medium">
            Sunday
          </p>

          {/* Tiny Gold Ornamental Divider */}
          <div className="mt-3 flex items-center justify-center gap-2.5">
            <span className="h-[1px] w-12 bg-gradient-to-r from-transparent to-[#c5a059]/60" />
            <span className="text-[#c5a059] text-[8px] select-none">♦</span>
            <span className="h-[1px] w-12 bg-gradient-to-l from-transparent to-[#c5a059]/60" />
          </div>
        </div>

        {/* ==============================================================
            4. MAIN WEDDING HEADING
            Calligraphic Wedding Ceremony in Deep Navy Blue
           ============================================================== */}
        <div className="relative mt-8 sm:mt-11" style={{ transform: 'translateZ(35px)' }}>
          <h1 className="font-script text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-[#152a4a] font-normal leading-[1.15] tracking-wide select-none drop-shadow-[0_2px_4px_rgba(21,42,74,0.06)]">
            Wedding Ceremony
          </h1>

          {/* Delicate Antique-Gold Floral Divider */}
          <div className="mt-3 sm:mt-4 flex items-center justify-center opacity-85">
            <FloralFlourishDivider />
          </div>
        </div>

        {/* ==============================================================
            5. CEREMONY TIME
            11:00 AM — 11:30 AM in Prominent Bold Navy
           ============================================================== */}
        <div className="relative mt-7 sm:mt-9" style={{ transform: 'translateZ(30px)' }}>
          <div className="inline-flex items-center justify-center gap-3 sm:gap-4 text-[#152a4a] font-serif-display font-semibold text-xl sm:text-2xl md:text-3xl tracking-[0.16em]">
            <span className="h-[1.5px] w-6 sm:w-10 bg-[#c5a059]/70" />
            <span>11:00 AM — 11:30 AM</span>
            <span className="h-[1.5px] w-6 sm:w-10 bg-[#c5a059]/70" />
          </div>
          <p className="font-montserrat text-[11px] sm:text-xs text-[#5a6e85] tracking-wider mt-1.5 font-medium">
            (Between 11:00 AM and 11:30 AM)
          </p>
        </div>

        {/* ==============================================================
            6. VENUE SECTION
            Gold Italic Heading + Sree Gokulam Convention Centre +
            High-Visibility Google Maps Pill Button
           ============================================================== */}
        <div className="relative mt-8 sm:mt-11 flex flex-col items-center" style={{ transform: 'translateZ(35px)' }}>
          <p className="font-cormorant italic text-2xl sm:text-3xl text-[#c5a059] font-normal">
            Venue
          </p>

          <div className="mt-2.5 font-montserrat uppercase font-semibold text-xs sm:text-sm md:text-base tracking-[0.18em] text-[#152a4a] leading-relaxed max-w-md">
            SREE GOKULAM CONVENTION CENTRE
            <br />
            BALUSSERY, KOZHIKODE
          </div>

          {/* High-Visibility Discreet Pill-Shaped Google Maps Button */}
          <div className="mt-6 flex justify-center">
            <a
              href="https://www.google.com/maps/search/?api=1&query=Sree+Gokulam+Convention+Centre+Balussery+Kozhikode"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open Sree Gokulam Convention Centre in Google Maps"
              className="group inline-flex items-center gap-2.5 px-8 py-3 rounded-full bg-[#152a4a] hover:bg-[#1f3a63] text-[#fdfbf7] font-montserrat text-xs tracking-[0.18em] uppercase font-semibold shadow-[0_6px_18px_rgba(21,42,74,0.22)] hover:shadow-[0_8px_24px_rgba(21,42,74,0.32)] hover:scale-105 active:scale-95 transition-all duration-300 border border-[#c5a059]/45"
            >
              <span className="text-sm filter drop-shadow">📍</span>
              <span className="tracking-[0.18em]">OPEN GOOGLE MAPS</span>
              <span className="text-[#c5a059] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform text-xs">↗</span>
            </a>
          </div>
        </div>

        {/* ==============================================================
            7. LOWER INVITATION MESSAGE
            Subtle Low-Contrast Divider + Sacred Invitation Quotes +
            1202 DHANU 27 · KOZHIKODE
           ============================================================== */}
        <div
          className="relative mt-10 sm:mt-12 pt-8 sm:pt-10 border-t border-[#c5a059]/20 flex flex-col items-center text-center max-w-xl mx-auto"
          style={{ transform: 'translateZ(25px)' }}
        >
          {/* Subtle Decorative Quotation Accent */}
          <div className="flex items-center justify-center gap-3 mb-3 text-[#c5a059]/70">
            <span className="h-[1px] w-8 bg-gradient-to-r from-transparent to-[#c5a059]/50" />
            <span className="font-cormorant italic text-xl select-none">“</span>
            <span className="h-[1px] w-8 bg-gradient-to-l from-transparent to-[#c5a059]/50" />
          </div>

          {/* Graceful Italic Quotations */}
          <p className="font-cormorant italic text-base sm:text-lg text-[#152a4a] font-medium leading-snug">
            “Salutations to Lord Ganesha”
          </p>
          <p className="font-cormorant italic text-sm sm:text-base text-[#152a4a]/85 leading-relaxed mt-2 font-normal max-w-lg">
            “We cordially invite you and your family to grace this auspicious occasion with your presence and blessings.”
          </p>

          {/* Location Caption & Malayalam Calendar Date */}
          <p className="font-montserrat uppercase text-[11px] sm:text-xs tracking-[0.22em] font-semibold text-[#152a4a]/80 mt-6">
            1202 DHANU 27 · KOZHIKODE
          </p>

          {/* Delicate Antique Gold Heart Accent */}
          <div className="mt-3 text-[#c5a059] text-xs opacity-75 select-none">♥</div>
        </div>
      </div>

    </div>
  );
}
