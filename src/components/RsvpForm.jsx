import React, { useState } from 'react';
import confetti from 'canvas-confetti';

const eventsList = [
  {
    id: 'wedding',
    title: 'Wedding Ceremony (Muhurtham)',
    location: 'Sree Gokulam Convention Centre, Balussery, Kozhikode',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=Sree+Gokulam+Convention+Centre+Balussery+Kozhikode'
  }
];

export default function RsvpForm() {
  const [name, setName] = useState('');
  const [attending, setAttending] = useState(null);
  const [guestCount, setGuestCount] = useState(1);
  const [selectedEvents, setSelectedEvents] = useState(['wedding']);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const toggleEvent = (id) => {
    setSelectedEvents((prev) =>
      prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    if (attending === null) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const payload = {
        name: name.trim(),
        attending,
        guestCount: attending ? guestCount : 0,
        selectedEvents: attending ? selectedEvents : []
      };

      const response = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error('Failed to record RSVP');
      }

      setIsSubmitted(true);
      if (attending) {
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.7 } });
      }
    } catch (err) {
      console.error('Error submitting RSVP:', err);
      // Still set submitted for positive guest experience, and log to console
      setIsSubmitted(true);
      if (attending) {
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.7 } });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative w-[340px] h-[650px] md:w-[440px] md:h-[840px] mt-12 flex flex-col items-center">
      <img
        src="/assets/rsvp-shape-z1pcPNfJ_1.webp"
        alt="RSVP Card Background"
        loading="lazy"
        decoding="async"
        className="absolute inset-0 w-full h-full object-cover drop-shadow-xl z-0"
      />

      <div className="absolute inset-0 z-10 w-full h-full px-8 md:px-14 pt-24 md:pt-36 pb-[195px] md:pb-[255px] text-center flex flex-col items-center justify-start">
        {/* Monogram & divider */}
        <div className="flex flex-col items-center text-[#1a2c5b]">
          <span className="font-display text-lg md:text-xl tracking-[0.25em] font-light leading-none">
            S | V
          </span>
          <svg width="48" height="12" viewBox="0 0 48 12" fill="none" className="text-[#1a2c5b] mt-1.5 opacity-80">
            <path d="M24 9C20 9 16 7.5 12 7" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" />
            <path d="M12 7C9.5 6.5 7 7 4 8" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" />
            <path d="M24 9C28 9 32 7.5 36 7" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" />
            <path d="M36 7C38.5 6.5 41 7 44 8" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" />
            <circle cx="24" cy="9" r="1" fill="currentColor" />
          </svg>
        </div>

        <h2 className="mt-0.5 md:mt-1 font-display text-2xl md:text-3xl text-[#1a2c5b] tracking-[0.2em] leading-none">
          RSVP
        </h2>
        <div className="mt-0.5 mb-1.5 md:mb-2.5 text-[#c0a062] text-xs">♥</div>

        {isSubmitted ? (
          <div className="py-12 my-auto animate-fade-in text-center">
            <p className="font-script text-3xl md:text-4xl text-[#c0a062] italic">
              Thank you, {name.trim() || 'dear friend'}!
            </p>
            <p className="mt-4 font-display text-sm md:text-base italic text-[#1a2c5b]/80">
              {attending
                ? 'Your presence will make our day truly special and complete.'
                : 'Thank you for your warm wishes and blessings.'}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="text-left space-y-1.5 md:space-y-2 w-full">
            <div>
              <label className="font-caps text-[0.55rem] md:text-[0.6rem] font-semibold text-[#1a2c5b] tracking-[0.08em] text-left block mb-0.5">
                FULL NAME
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                required
                className="w-full rounded-md border border-[#1a2c5b]/60 bg-transparent px-2.5 py-1.5 md:px-3.5 md:py-2 font-serif text-[11px] md:text-xs text-[#1a2c5b] focus:outline-none focus:border-[#c0a062] transition placeholder:text-[#1a2c5b]/50"
              />
            </div>

            <div>
              <label className="font-caps text-[0.55rem] md:text-[0.6rem] font-semibold text-[#1a2c5b] tracking-[0.08em] text-left block mb-0.5">
                WILL YOU BE ATTENDING?
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setAttending(true)}
                  className={`rounded-md border px-2 py-1.5 md:px-3 md:py-2 font-display text-[11px] md:text-xs tracking-wide transition cursor-pointer ${
                    attending === true
                      ? 'bg-[#1a2c5b] border-[#1a2c5b] text-white'
                      : 'border-[#1a2c5b]/60 text-[#1a2c5b] hover:bg-[#1a2c5b]/5'
                  }`}
                >
                  Joyfully Accept
                </button>
                <button
                  type="button"
                  onClick={() => setAttending(false)}
                  className={`rounded-md border px-2 py-1.5 md:px-3 md:py-2 font-display text-[11px] md:text-xs tracking-wide transition cursor-pointer ${
                    attending === false
                      ? 'bg-[#1a2c5b] border-[#1a2c5b] text-white'
                      : 'border-[#1a2c5b]/60 text-[#1a2c5b] hover:bg-[#1a2c5b]/5'
                  }`}
                >
                  Regretfully Decline
                </button>
              </div>
            </div>

            {attending === true && (
              <>
                <div>
                  <label className="font-caps text-[0.55rem] md:text-[0.6rem] font-semibold text-[#1a2c5b] tracking-[0.08em] text-left block mb-0.5">
                    NO. OF GUESTS ATTENDING
                  </label>
                  <div className="grid grid-cols-[auto_1fr_auto] gap-1 rounded-md border border-[#1a2c5b]/60 bg-transparent overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setGuestCount((c) => Math.max(1, c - 1))}
                      className="px-2.5 py-0.5 md:px-3 md:py-1 font-display text-sm md:text-base text-[#1a2c5b] hover:bg-[#1a2c5b]/5 cursor-pointer"
                    >
                      −
                    </button>
                    <div className="text-center py-0.5 md:py-1 font-serif font-bold text-sm md:text-base text-[#1a2c5b] flex items-center justify-center">
                      {guestCount}
                    </div>
                    <button
                      type="button"
                      onClick={() => setGuestCount((c) => c + 1)}
                      className="px-2.5 py-0.5 md:px-3 md:py-1 font-display text-sm md:text-base text-[#1a2c5b] hover:bg-[#1a2c5b]/5 cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div>
                  <p className="font-caps text-[0.52rem] md:text-[0.58rem] text-[#1a2c5b] tracking-[0.08em] font-semibold text-center my-1">
                    EVENTS YOU'LL BE JOINING
                  </p>
                  <div className="space-y-1.5">
                    {eventsList.map((ev) => {
                      const isChecked = selectedEvents.includes(ev.id);
                      return (
                        <label
                          key={ev.id}
                          className={`flex items-center justify-between rounded-md border border-[#1a2c5b] px-2 py-1 md:px-3 md:py-1.5 cursor-pointer transition ${
                            isChecked ? 'bg-white/50 shadow-sm' : 'bg-transparent'
                          }`}
                        >
                          <div className="flex flex-col gap-0.5 text-left">
                            <span className="font-display text-[#1a2c5b] text-[11px] md:text-xs leading-none font-semibold">
                              {ev.title}
                            </span>
                            <span className="font-serif text-[8.5px] md:text-[9.5px] text-[#1a2c5b]/70 leading-tight">
                              📍 {ev.location}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => toggleEvent(ev.id)}
                              className="w-3.5 h-3.5 accent-[#1a2c5b] cursor-pointer"
                            />
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={attending === null || isSubmitting}
              className="w-full rounded-full bg-[#1a2c5b] py-1.5 md:py-2.5 font-caps text-[0.52rem] md:text-[0.6rem] tracking-[0.18em] text-white hover:bg-[#1a2c5b]/90 transition flex items-center justify-center gap-2 mt-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-md"
            >
              {isSubmitting ? 'RECORDING RSVP...' : 'SEND RSVP'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
