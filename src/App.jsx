import React, { useState } from 'react';
import EnvelopeIntro from './components/EnvelopeIntro.jsx';
import AmbientEffects from './components/AmbientEffects.jsx';
import ScratchCard from './components/ScratchCard.jsx';
import Countdown from './components/Countdown.jsx';
import StoryCarousel from './components/StoryCarousel.jsx';
import RsvpForm from './components/RsvpForm.jsx';
import AudioPlayer from './components/AudioPlayer.jsx';
import Reveal from './components/Reveal.jsx';
import CeremonyGlassCard from './components/CeremonyGlassCard.jsx';

// Golden ornament SVG helper
function GoldDivider({ text = '♥', className = 'my-2' }) {
  return (
    <div className={`flex items-center justify-center gap-3 w-36 md:w-56 mx-auto opacity-80 ${className}`}>
      <span className="h-[0.5px] flex-1 bg-gradient-to-r from-transparent to-[var(--gold)]" />
      <span className="text-[var(--gold)] text-[10px] md:text-xs">{text}</span>
      <span className="h-[0.5px] flex-1 bg-gradient-to-l from-transparent to-[var(--gold)]" />
    </div>
  );
}

// Ornate flourish SVG helper
function OrnateFlourish({ className = 'w-32 md:w-40 text-[var(--gold)]' }) {
  return (
    <svg viewBox="0 0 200 32" fill="currentColor" className={className}>
      <path d="M 100,22 C 96,17.5 93.5,14.5 93.5,11.5 C 93.5,8.8 95.8,6.8 98.5,6.8 C 99.8,6.8 100,7.8 100,7.8 C 100,7.8 100.2,6.8 101.5,6.8 C 104.2,6.8 106.5,8.8 106.5,11.5 C 106.5,14.5 104,17.5 100,22 Z" />
      <path d="M 90,16 L 25,16" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
      <path d="M 75,16 C 71.5,12.5 63,9.5 56,11.5 C 62.5,13.5 69,15 75,16 Z" />
      <path d="M 75,16 C 71.5,19.5 63,22.5 56,20.5 C 62.5,18.5 69,17 75,16 Z" />
      <path d="M 50,16 C 46.5,12.5 38,9.5 31,11.5 C 37.5,13.5 44,15 50,16 Z" />
      <path d="M 50,16 C 46.5,19.5 38,22.5 31,20.5 C 37.5,18.5 44,17 50,16 Z" />
      <path d="M 25,16 C 21,14.5 14,14 8,16 C 14,18 21,17.5 25,16 Z" />
      <path d="M 110,16 L 175,16" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
      <path d="M 125,16 C 128.5,12.5 137,9.5 144,11.5 C 137.5,13.5 131,15 125,16 Z" />
      <path d="M 125,16 C 128.5,19.5 137,22.5 144,20.5 C 137.5,18.5 131,17 125,16 Z" />
      <path d="M 150,16 C 153.5,12.5 162,9.5 169,11.5 C 162.5,13.5 156,15 150,16 Z" />
      <path d="M 150,16 C 153.5,19.5 162,22.5 169,20.5 C 162.5,18.5 156,17 150,16 Z" />
      <path d="M 175,16 C 179,14.5 186,14 192,16 C 186,18 179,17.5 175,16 Z" />
    </svg>
  );
}

export default function App() {
  const [isOpened, setIsOpened] = useState(false);
  const [isScratched, setIsScratched] = useState(false);

  return (
    <main className="min-h-screen bg-background text-foreground relative overflow-x-hidden">
      {/* 1. Video Envelope Opening Modal */}
      <EnvelopeIntro onOpen={() => setIsOpened(true)} />

      {/* 2. Ambient Particles & Birds */}
      <AmbientEffects />

      {/* 3. Audio Music Player */}
      <AudioPlayer autoPlayTrigger={isOpened} />

      {/* --------------------------------------------------------------
          SECTION 1: HERO / SAVE THE DATE
          Background: Same as original
         -------------------------------------------------------------- */}
      <section className="relative flex flex-col items-center justify-between min-h-screen py-6 px-4 text-center select-none overflow-hidden isolate">
        {/* Background Images */}
        <img
          src="/assets/hero-bg-BoJZa16A.webp"
          alt=""
          className="absolute inset-0 -z-10 h-full w-full object-cover object-top md:hidden select-none pointer-events-none"
        />
        <img
          src="/assets/hero-bg-desktop-DVXVxfCH.webp"
          alt=""
          className="absolute inset-0 -z-10 h-full w-full object-cover object-center hidden md:block select-none pointer-events-none"
        />

        {/* Monogram Top */}
        <Reveal animation="fade-down" duration={1000} delay={200} className="flex-none pt-4 md:pt-6">
          <div className="scale-100 md:scale-125 transition-transform duration-500 animate-float">
            <img src="/assets/monogram-DluBM9hV.webp" alt="S & V monogram" className="h-28 w-28 object-contain" />
          </div>
        </Reveal>

        {/* Main Names & Save The Date */}
        <div className="flex-1 flex flex-col items-center justify-start md:justify-center py-2 md:py-10 w-full max-w-md md:max-w-2xl">
          <Reveal animation="fade-up" duration={1000} delay={400}>
            <h1 className="font-script leading-[1.2] flex items-center justify-center gap-x-4 gap-y-2 flex-wrap px-4">
              <span className="text-[var(--foreground)] text-4xl sm:text-5xl md:text-7xl tracking-wide font-normal">
                Sneha
              </span>
              <span className="text-[var(--gold)] text-2xl sm:text-3xl md:text-5xl font-light italic lowercase px-1">
                Weds
              </span>
              <span className="text-[var(--foreground)] text-4xl sm:text-5xl md:text-7xl tracking-wide font-normal">
                Vaishnav
              </span>
            </h1>
          </Reveal>

          <Reveal animation="fade-up" duration={1000} delay={600} className="flex flex-col items-center">
            <GoldDivider />
            <p className="font-caps tracking-[0.25em] text-[var(--foreground)] text-xs sm:text-sm md:text-base font-semibold">
              WE ARE GETTING MARRIED
            </p>
            <GoldDivider />
          </Reveal>

          {/* Interactive Scratch Card */}
          <div className="relative w-full max-w-[280px] sm:max-w-[310px] md:max-w-[420px] mx-auto my-2">
            <ScratchCard onRevealed={() => setIsScratched(true)}>
              <div className="flex flex-col items-center justify-center select-none py-1 md:py-3">
                <p className="font-caps text-[0.5rem] md:text-[0.65rem] tracking-[0.25em] text-[var(--gold)] mb-1 font-semibold">
                  SAVE THE DATE
                </p>
                <div className="font-script text-2xl sm:text-3xl md:text-4xl text-[var(--foreground)] leading-none my-1 md:my-2">
                  27th December 2026
                </div>
                <p className="font-caps text-[0.45rem] md:text-[0.55rem] tracking-[0.2em] text-[var(--muted-foreground)] font-semibold">
                  KOZHIKODE, KERALA
                </p>
              </div>
            </ScratchCard>
          </div>

          {/* Live Countdown */}
          <Countdown isVisible={isScratched} />
        </div>

        {/* Section 1 Footer */}
        <Reveal animation="fade-up" duration={1000} delay={1000} className="flex-none flex flex-col items-center w-full max-w-sm md:max-w-md pb-2 md:pb-14">
          <GoldDivider />
          <p className="mt-2 md:my-3 font-display text-[var(--foreground)] text-sm sm:text-base md:text-lg tracking-wide max-w-[280px] md:max-w-[360px] font-normal leading-normal">
            Thank you for being a part of our special day.
          </p>
          <GoldDivider />
        </Reveal>
      </section>

      {/* --------------------------------------------------------------
          SECTION 2: FAMILIES
          Background: Same as original
         -------------------------------------------------------------- */}
      <section className="relative flex flex-col items-center justify-start min-h-screen py-10 px-4 text-center select-none overflow-hidden isolate bg-white">
        <img
          src="/assets/families-bg-Bdmrjm8V.webp"
          alt=""
          loading="lazy"
          decoding="async"
          className="absolute inset-0 -z-10 h-full w-full object-cover object-center md:hidden select-none pointer-events-none"
        />
        <img
          src="/assets/families-bg-desktop-CemX6j0X.webp"
          alt=""
          loading="lazy"
          decoding="async"
          className="absolute inset-0 -z-10 h-full w-full object-cover object-center hidden md:block select-none pointer-events-none"
        />

        <Reveal animation="fade-down" duration={1000} className="flex-none w-full pt-4 md:pt-12">
          <svg className="w-5 h-8 text-[var(--gold)] mx-auto mb-1 select-none" viewBox="0 0 24 32" fill="currentColor">
            <line x1="12" y1="2" x2="12" y2="28" stroke="currentColor" strokeWidth="1" />
            <path d="M 12 5 C 9 5, 8 2, 12 0 C 16 2, 15 5, 12 5" />
            <path d="M 12 12 C 8 10, 7 7, 10 5 C 13 3, 12 12, 12 12" />
            <path d="M 12 12 C 16 10, 17 7, 14 5 C 11 3, 12 12, 12 12" />
            <path d="M 12 20 C 8 18, 7 15, 10 13 C 13 11, 12 20, 12 20" />
            <path d="M 12 20 C 16 18, 17 15, 14 13 C 11 11, 12 20, 12 20" />
          </svg>
          <p className="font-caps text-[0.55rem] md:text-xs tracking-[0.3em] text-primary font-semibold">
            Two families. One promise.
          </p>
          <div className="flex items-center justify-center gap-1.5 w-36 md:w-48 mx-auto my-2 opacity-80">
            <span className="h-[0.5px] flex-1 bg-gradient-to-r from-transparent to-[var(--gold)]" />
            <span className="text-[var(--gold)] text-[8px] md:text-xs">❦</span>
            <span className="text-[var(--gold)] text-[6px] md:text-[8px]">♥</span>
            <span className="text-[var(--gold)] text-[8px] md:text-xs">❦</span>
            <span className="h-[0.5px] flex-1 bg-gradient-to-l from-transparent to-[var(--gold)]" />
          </div>
          <h2 className="mt-1 font-display text-2xl md:text-4xl tracking-wide text-primary leading-tight uppercase font-medium">
            Introducing
            <span className="block font-script text-[var(--gold)] text-3xl md:text-5xl italic capitalize mt-0.5 normal-case font-normal">
              the families
            </span>
          </h2>
          <div className="flex items-center justify-center gap-2 text-[var(--gold)] text-xs md:text-sm mt-1 select-none opacity-80">
            <span>⤙</span><span>❦</span><span>⤚</span>
          </div>
        </Reveal>

        <div className="flex-1 flex flex-col items-center justify-center w-full max-w-[440px] md:max-w-[640px] py-20 pt-4 md:pt-8">
          <div className="grid grid-cols-[1fr_auto_1fr] gap-x-2 md:gap-x-6 gap-y-4 items-center w-full px-1">
            {/* Bride side */}
            <Reveal animation="fade-right" duration={1000} delay={200}>
              <div className="flex flex-col items-center text-center px-1">
                <h3 className="font-script text-3xl sm:text-4xl md:text-5xl text-primary leading-none italic font-normal">
                  Sneha
                </h3>
                <div className="flex items-center justify-center gap-1.5 my-2 opacity-70">
                  <span className="h-[0.5px] w-6 bg-gradient-to-r from-transparent to-[var(--gold)]" />
                  <span className="text-[var(--gold)] text-[6px]">✦</span>
                  <span className="h-[0.5px] w-6 bg-gradient-to-l from-transparent to-[var(--gold)]" />
                </div>
                <p className="font-caps text-[0.4rem] sm:text-[0.45rem] tracking-[0.2em] text-[var(--muted-foreground)] mb-1 uppercase font-semibold">
                  D/o
                </p>
                <p className="font-display text-[0.65rem] sm:text-[0.7rem] md:text-sm text-primary tracking-wide leading-normal uppercase font-semibold">
                  Sudheesan P. T.{' '}
                  <span className="text-[var(--gold)] font-light italic lowercase">&amp;</span>{' '}
                  Jisha K.
                </p>
                <p className="font-caps text-[0.4rem] sm:text-[0.45rem] tracking-[0.2em] text-[var(--muted-foreground)] mt-3 mb-1 uppercase font-semibold">
                  Residence
                </p>
                <p className="font-display text-[0.6rem] sm:text-[0.65rem] md:text-xs text-[var(--muted-foreground)] tracking-wide leading-tight uppercase font-semibold">
                  Pilanthottathil House{' '}
                  <span className="text-[var(--gold)] font-light italic lowercase">&amp;</span>
                  <br />
                  Kokkallur, Balussery, Kozhikode
                </p>
              </div>
            </Reveal>

            {/* Center Monogram Divider */}
            <Reveal animation="zoom-in" duration={1000} delay={400} className="flex flex-col items-center justify-between self-stretch min-h-[160px] md:min-h-[220px] relative select-none px-1">
              <div className="w-[1px] flex-1 bg-gradient-to-b from-transparent to-[var(--gold)]/75" />
              <div className="my-2 scale-90 sm:scale-100 md:scale-125 transition-transform duration-300 animate-float-delayed">
                <img src="/assets/monogram-DluBM9hV.webp" alt="S & V monogram" className="h-20 w-20 object-contain" />
              </div>
              <div className="w-[1px] flex-1 bg-gradient-to-t from-transparent to-[var(--gold)]/75" />
            </Reveal>

            {/* Groom side */}
            <Reveal animation="fade-left" duration={1000} delay={200}>
              <div className="flex flex-col items-center text-center px-1">
                <h3 className="font-script text-3xl sm:text-4xl md:text-5xl text-primary leading-none italic font-normal">
                  Vaishnav
                </h3>
                <div className="flex items-center justify-center gap-1.5 my-2 opacity-70">
                  <span className="h-[0.5px] w-6 bg-gradient-to-r from-transparent to-[var(--gold)]" />
                  <span className="text-[var(--gold)] text-[6px]">✦</span>
                  <span className="h-[0.5px] w-6 bg-gradient-to-l from-transparent to-[var(--gold)]" />
                </div>
                <p className="font-caps text-[0.4rem] sm:text-[0.45rem] tracking-[0.2em] text-[var(--muted-foreground)] mb-1 uppercase font-semibold">
                  S/o
                </p>
                <p className="font-display text-[0.65rem] sm:text-[0.7rem] md:text-sm text-primary tracking-wide leading-normal uppercase font-semibold">
                  Vijayan Kunnummal{' '}
                  <span className="text-[var(--gold)] font-light italic lowercase">&amp;</span>{' '}
                  Sreeja P
                </p>
                <p className="font-caps text-[0.4rem] sm:text-[0.45rem] tracking-[0.2em] text-[var(--muted-foreground)] mt-3 mb-1 uppercase font-semibold">
                  Residence
                </p>
                <p className="font-display text-[0.6rem] sm:text-[0.65rem] md:text-xs text-[var(--muted-foreground)] tracking-wide leading-tight uppercase font-semibold">
                  Vaishnavam Poyilil House{' '}
                  <span className="text-[var(--gold)] font-light italic lowercase">&amp;</span>
                  <br />
                  Malayamma, Kozhikode
                </p>
              </div>
            </Reveal>
          </div>

          <Reveal animation="fade-up" duration={1000} delay={600} className="w-full mt-8 md:mt-12 pb-4">
            <p className="font-caps text-[0.55rem] md:text-[0.65rem] tracking-[0.25em] text-primary leading-relaxed font-semibold">
              Raised with love,<br />united by destiny,
            </p>
            <p className="font-script text-[var(--gold)] text-2xl md:text-4xl italic leading-none mt-1 font-normal">
              together forever
            </p>
            <GoldDivider text="♥" className="mt-2.5" />
          </Reveal>
        </div>
      </section>

      {/* --------------------------------------------------------------
          SECTION 3: OUR STORY (Currently Hidden as requested)
         -------------------------------------------------------------- */}
      {/* 
      <section className="relative isolate min-h-screen overflow-hidden px-6 py-16 bg-[var(--paper)]">
        <img
          src="/assets/Kerala Temple Backwaters Watercolour Invitation.png"
          alt=""
          className="pointer-events-none absolute inset-0 -z-10 h-full w-full object-cover object-center md:hidden"
        />
        <img
          src="/assets/Kerala Backwaters Watercolour Invitation Scene.png"
          alt=""
          className="pointer-events-none absolute inset-0 -z-10 h-full w-full object-cover object-center hidden md:block"
        />

        <div className="relative mx-auto max-w-2xl text-center">
          <Reveal animation="fade-down" duration={1000}>
            <div>
              <h2 className="font-display text-3xl md:text-5xl text-primary font-medium tracking-[0.15em] uppercase">
                OUR STORY
              </h2>
              <div className="mt-3 flex items-center justify-center gap-3 text-[var(--gold)]">
                <span className="h-px w-12 bg-gradient-to-r from-transparent to-[var(--gold)]" />
                <span className="text-sm">❦</span>
                <span className="h-px w-12 bg-gradient-to-l from-transparent to-[var(--gold)]" />
              </div>
              <p className="mt-3 font-display italic text-sm md:text-base text-[var(--muted-foreground)]">
                Some chapters are written by destiny.
              </p>
            </div>
          </Reveal>

          <Reveal animation="zoom-in" duration={1000} delay={200}>
            <StoryCarousel />
          </Reveal>

          <Reveal animation="fade-up" duration={1000} delay={400} className="deckled mx-auto max-w-[320px] p-4 mt-10 select-none border border-[var(--gold)]/20 rotate-[0.5deg] bg-white/70 backdrop-blur-sm shadow-md rounded-lg">
            <svg className="w-4 h-4 text-[var(--gold)] mx-auto mb-1.5 opacity-80" viewBox="0 0 24 24" fill="currentColor">
              <path d="M 12 4 C 10 4 8 2 12 0 C 16 2 14 4 12 4 Z" />
              <path d="M 12 12 C 8 10 8 7 11 5 C 14 3 13 12 12 12 Z" stroke="currentColor" strokeWidth="0.5" />
              <path d="M 12 12 C 16 10 16 7 13 5 C 10 3 11 12 12 12 Z" stroke="currentColor" strokeWidth="0.5" />
              <path d="M 12 20 C 10 18 9 15 12 13 C 15 11 14 20 12 20 Z" />
            </svg>
            <p className="font-script text-[var(--gold)] text-base italic font-normal">
              ”From that first conversation to a lifetime of adventures”
            </p>
            <div className="text-[var(--gold)] text-[10px] mt-1.5 opacity-80 select-none">♥</div>
          </Reveal>
        </div>
      </section>
      */}

      {/* --------------------------------------------------------------
          SECTION 4: SCHEDULE & WEDDING MUHURTHAM
          Background: Uploaded Kerala Backwaters Temple Invitation Background
         -------------------------------------------------------------- */}
      <section id="schedule" className="relative isolate min-h-screen px-6 py-20 bg-[#e7ebf0]">
        <img
          src="/assets/kerala-temple-mobile.webp"
          alt=""
          loading="lazy"
          decoding="async"
          className="pointer-events-none absolute inset-0 -z-10 h-full w-full object-cover object-center md:hidden"
        />
        <img
          src="/assets/kerala-temple-desktop.webp"
          alt=""
          loading="lazy"
          decoding="async"
          className="pointer-events-none absolute inset-0 -z-10 h-full w-full object-cover object-center hidden md:block"
        />

        <div className="relative mx-auto max-w-5xl flex flex-col items-center pt-8 pb-12 px-2 sm:px-4">
          <Reveal animation="fade-down" duration={1000} className="text-center mt-4 mb-4">
            <div className="text-[var(--gold)] text-sm mb-2 select-none">❦</div>
            <h2 className="font-display text-3xl md:text-5xl text-primary font-medium tracking-[0.1em] uppercase">
              SCHEDULE OF EVENTS
            </h2>
            <div className="mt-4 flex items-center justify-center gap-2">
              <span className="h-[1px] w-8 bg-[var(--gold)]/40" />
              <span className="text-[var(--gold)] text-[10px]">♥</span>
              <span className="h-[1px] w-8 bg-[var(--gold)]/40" />
            </div>
            <p className="mt-4 font-caps text-xs md:text-sm text-primary tracking-[0.15em] font-semibold">
              A CELEBRATION OF TRADITION,<br />LOVE &amp; FAMILY
            </p>
          </Reveal>

          {/* Main Wedding Ceremony Card (3D Projection & Glassmorphism) */}
          <Reveal animation="zoom-in" duration={1000} delay={150} className="w-full flex justify-center">
            <CeremonyGlassCard />
          </Reveal>
        </div>
      </section>

      {/* --------------------------------------------------------------
          SECTION 5: WEDDING RECEPTION (Hidden)
          Background: Uploaded Kerala Backwaters Watercolour Scene
         -------------------------------------------------------------- */}
      {false && (
      <section id="reception" className="relative isolate min-h-screen px-6 py-20 bg-[#e7ebf0]">
        <img
          src="/assets/Kerala Temple Backwaters Watercolour Invitation.png"
          alt=""
          className="pointer-events-none absolute inset-0 -z-10 h-full w-full object-cover object-center md:hidden"
        />
        <img
          src="/assets/Kerala Backwaters Watercolour Invitation Scene.png"
          alt=""
          className="pointer-events-none absolute inset-0 -z-10 h-full w-full object-cover object-center hidden md:block"
        />

        <div className="relative w-full min-h-screen flex flex-col items-center justify-center pt-10 px-4 pb-20">
          <Reveal animation="fade-down" duration={1000} className="text-center mb-8">
            <h2 className="font-display text-3xl md:text-5xl text-primary font-medium tracking-[0.1em] uppercase">
              WEDDING RECEPTION
            </h2>
            <div className="mt-3 flex items-center justify-center gap-2">
              <span className="h-[1px] w-8 bg-[var(--gold)]/40" />
              <span className="text-[var(--gold)] text-[10px]">♥</span>
              <span className="h-[1px] w-8 bg-[var(--gold)]/40" />
            </div>
            <p className="mt-3 font-caps text-xs md:text-sm text-primary tracking-[0.15em] font-semibold">
              A CELEBRATION OF LOVE, JOY &amp; BLESSINGS
            </p>
            <div className="mt-3 flex items-center justify-center opacity-85">
              <OrnateFlourish />
            </div>
          </Reveal>

          {/* Reception Details Box */}
          <Reveal animation="zoom-in" duration={1000} delay={200} className="w-full max-w-lg bg-white/70 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-[var(--gold)]/40 shadow-xl text-center z-10">
            <h3 className="font-display text-lg md:text-2xl text-primary font-semibold tracking-[0.15em] uppercase">
              28TH DECEMBER, 2026
            </h3>
            <p className="font-serif italic text-primary text-xs md:text-sm text-[var(--gold)] font-medium">
              Monday
            </p>
            <div className="mt-2 flex items-center justify-center gap-2">
              <span className="h-[1px] w-12 bg-[var(--gold)]/60" />
              <span className="text-[var(--gold)] text-[8px]">♦</span>
              <span className="h-[1px] w-12 bg-[var(--gold)]/60" />
            </div>

            <h1 className="font-script text-5xl md:text-6xl text-primary font-normal leading-none mt-6">
              Evening Reception
            </h1>
            <div className="mt-4 flex items-center justify-center gap-4 text-primary font-bold text-lg md:text-xl tracking-widest">
              <span className="h-[1px] w-6 bg-[var(--gold)]" />
              4:00 PM – 9:00 PM
              <span className="h-[1px] w-6 bg-[var(--gold)]" />
            </div>

            <p className="mt-6 font-script text-3xl md:text-4xl text-[var(--gold)] font-normal">
              Venue:
            </p>
            <a
              href="https://www.google.com/maps/search/?api=1&query=Convention+Centre+Muthalam+Kozhikode"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 font-mono text-sm md:text-base text-primary tracking-widest leading-relaxed font-semibold hover:text-[var(--gold)] transition-colors block"
            >
              Convention Centre
              <br />
              Muthalam, Kozhikode
            </a>
            <a
              href="https://www.google.com/maps/search/?api=1&query=Convention+Centre+Muthalam+Kozhikode"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-3 px-4 py-1.5 rounded-full border border-[var(--gold)] text-[var(--gold)] hover:bg-[var(--gold)]/10 font-caps text-xs tracking-wider transition-colors"
            >
              <span>📍</span> Open Google Maps
            </a>

            <p className="mt-6 font-serif italic text-primary text-sm max-w-sm mx-auto border-t border-[var(--gold)]/20 pt-4">
              “Join us for an evening of joyous celebrations, dining and blessings.”
            </p>
          </Reveal>
        </div>
      </section>
      )}

      {/* --------------------------------------------------------------
          SECTION 6: RSVP
          Background: RSVP Background
         -------------------------------------------------------------- */}
      <section id="rsvp" className="relative min-h-screen pt-16 px-4 isolate flex flex-col items-center">
        <img
          src="/assets/rsvp-bg-I-N3en4m_.webp"
          alt=""
          loading="lazy"
          decoding="async"
          className="pointer-events-none absolute inset-0 -z-10 h-full w-full object-cover object-center md:hidden"
        />
        <img
          src="/assets/rsvp-bg-desktop-optimized.webp"
          alt=""
          loading="lazy"
          decoding="async"
          className="pointer-events-none absolute inset-0 -z-10 h-full w-full object-cover object-center hidden md:block"
        />

        {/* RSVP Card Component */}
        <Reveal animation="zoom-in" duration={1000}>
          <RsvpForm />
        </Reveal>

        {/* Bottom Location Directions CTA */}
        <Reveal animation="fade-up" duration={1000} delay={200} className="mt-8 text-center flex flex-col items-center pb-16 relative z-10">
          <p className="font-script text-3xl text-[#1a2c5b] italic drop-shadow-sm">
            Celebrate this new chapter with us.
          </p>
          <div className="mt-2 mb-6 text-[#c0a062] text-xs">♥</div>
          <a
            href="https://www.google.com/maps/search/?api=1&query=Sree+Gokulam+Convention+Centre+Balussery+Kozhikode"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 rounded-full border border-[#c0a062]/40 px-8 py-2.5 font-caps text-[0.65rem] tracking-[0.15em] text-[#c0a062] hover:bg-[#c0a062]/10 transition flex items-center gap-2 bg-[#fdfbf7]/60 backdrop-blur-md inline-flex shadow-sm"
          >
            <span className="text-[#c0a062]">📍</span> GET DIRECTIONS
          </a>
        </Reveal>
      </section>
    </main>
  );
}
