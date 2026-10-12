import React, { useRef, useEffect, useState } from 'react';
import confetti from 'canvas-confetti';

export default function ScratchCard({ onRevealed, children }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const isDrawing = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const dpr = window.devicePixelRatio || 1;
    const initCanvas = () => {
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        const w = rect.width;
        const h = rect.height;

        // Gradient background
        const grad = ctx.createLinearGradient(0, 0, w, h);
        grad.addColorStop(0, '#1e3a5f');
        grad.addColorStop(0.5, '#2d5a8e');
        grad.addColorStop(1, '#3b6fa0');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);

        // Gold sparkles
        ctx.fillStyle = 'rgba(232, 200, 124, 0.55)';
        for (let i = 0; i < 50; i++) {
          const x = Math.random() * w;
          const y = Math.random() * h;
          const r = Math.random() * 1.6 + 0.3;
          ctx.beginPath();
          ctx.arc(x, y, r, 0, Math.PI * 2);
          ctx.fill();
        }

        // Text
        ctx.fillStyle = 'rgba(232, 200, 124, 0.95)';
        ctx.font = "600 13px 'Cormorant SC', serif";
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('✦   SCRATCH TO REVEAL   ✦', w / 2, h / 2 - 8);

        ctx.font = "italic 12px 'Cormorant Garamond', serif";
        ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
        ctx.fillText('our special day', w / 2, h / 2 + 10);

        ctx.globalCompositeOperation = 'destination-out';
      }
    };

    initCanvas();
    window.addEventListener('resize', initCanvas);
    return () => window.removeEventListener('resize', initCanvas);
  }, []);

  const scratch = (clientX, clientY) => {
    const canvas = canvasRef.current;
    if (!canvas || isRevealed) return;
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.beginPath();
      ctx.arc(x, y, 28, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  const checkScratchPercentage = () => {
    const canvas = canvasRef.current;
    if (!canvas || isRevealed) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = canvas;
    const imgData = ctx.getImageData(0, 0, width, height).data;
    let cleared = 0;
    const step = 40;
    let total = 0;

    for (let i = 3; i < imgData.length; i += 4 * step) {
      if (imgData[i] === 0) cleared++;
      total++;
    }

    if (cleared / total > 0.45) {
      setIsRevealed(true);
      ctx.clearRect(0, 0, width, height);
      fireConfetti();
      if (onRevealed) onRevealed();
    }
  };

  const fireConfetti = () => {
    const colors = ['#1e3a5f', '#3b6fa0', '#e8c87c', '#f5f0e0', '#ffffff'];
    const end = Date.now() + 1200;

    (function frame() {
      confetti({ particleCount: 6, angle: 60, spread: 70, origin: { x: 0, y: 0.7 }, colors });
      confetti({ particleCount: 6, angle: 120, spread: 70, origin: { x: 1, y: 0.7 }, colors });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();

    confetti({ particleCount: 120, spread: 100, origin: { y: 0.6 }, colors });
  };

  const handlePointerDown = (e) => {
    isDrawing.current = true;
    e.target.setPointerCapture?.(e.pointerId);
    scratch(e.clientX, e.clientY);
  };

  const handlePointerMove = (e) => {
    if (isDrawing.current) {
      scratch(e.clientX, e.clientY);
    }
  };

  const handlePointerUp = () => {
    isDrawing.current = false;
    checkScratchPercentage();
  };

  return (
    <div
      ref={containerRef}
      className="relative mx-auto w-full aspect-[5/2] rounded-xl overflow-hidden border border-[var(--gold)]/30 shadow-md"
      style={{ touchAction: isRevealed ? 'auto' : 'pan-y' }}
    >
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/50 backdrop-blur-md p-4 text-center">
        {children}
      </div>
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        className={`absolute inset-0 h-full w-full cursor-grab transition-opacity duration-500 ${
          isRevealed ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      />
    </div>
  );
}
