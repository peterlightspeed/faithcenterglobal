/*
  TFCG Hero Particles
  ------------------------------------------------------------
  A small, self-contained interactive animation for the homepage
  hero — soft golden light motes that drift upward (evoking a
  "glory cloud" / warm candlelight feel fitting a Word of Faith
  church) and gently respond to the visitor's cursor.

  Design notes:
  - Pure Canvas 2D, no dependencies, no libraries.
  - Respects `prefers-reduced-motion: reduce` — the canvas is
    simply left blank for visitors who've asked for less motion.
  - Pauses via `requestAnimationFrame` when the tab isn't visible,
    so it costs nothing when the page isn't being looked at.
  - Only runs if a #hero-particles canvas exists on the page — safe
    to include on every page's script list without side effects.
*/
(function () {
  const canvas = document.getElementById("hero-particles");
  if (!canvas) return;

  const prefersReducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReducedMotion) return;

  const ctx = canvas.getContext("2d");
  const hero = canvas.closest(".hero-section") || canvas.parentElement;

  let width = 0;
  let height = 0;
  let particles = [];
  let mouseX = null;
  let mouseY = null;
  let rafId = null;
  let running = true;

  const GOLD = [212, 160, 23];
  const PARTICLE_COUNT_DESKTOP = 55;
  const PARTICLE_COUNT_MOBILE = 28;

  function particleCount() {
    return width < 700 ? PARTICLE_COUNT_MOBILE : PARTICLE_COUNT_DESKTOP;
  }

  function makeParticle() {
    return {
      x: Math.random() * width,
      y: height + Math.random() * height * 0.5,
      radius: 1 + Math.random() * 2.4,
      speed: 0.15 + Math.random() * 0.45,
      drift: (Math.random() - 0.5) * 0.3,
      opacity: 0.15 + Math.random() * 0.45,
      twinklePhase: Math.random() * Math.PI * 2,
      twinkleSpeed: 0.01 + Math.random() * 0.02
    };
  }

  function resize() {
    const rect = hero.getBoundingClientRect();
    width = canvas.width = rect.width;
    height = canvas.height = rect.height;
    particles = Array.from({ length: particleCount() }, makeParticle);
  }

  function step() {
    if (!running) return;
    ctx.clearRect(0, 0, width, height);

    particles.forEach((p) => {
      /* Gentle upward drift, like embers or dust in a light beam */
      p.y -= p.speed;
      p.x += p.drift;

      /* Subtle attraction toward the cursor within a limited radius —
         interactive, but understated rather than gimmicky */
      if (mouseX !== null && mouseY !== null) {
        const dx = mouseX - p.x;
        const dy = mouseY - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 160 && dist > 0.01) {
          p.x += (dx / dist) * 0.35;
          p.y += (dy / dist) * 0.35;
        }
      }

      p.twinklePhase += p.twinkleSpeed;
      const twinkle = (Math.sin(p.twinklePhase) + 1) / 2; /* 0..1 */
      const alpha = p.opacity * (0.5 + twinkle * 0.5);

      if (p.y < -10) {
        Object.assign(p, makeParticle(), { y: height + 10 });
      }
      if (p.x < -10) p.x = width + 10;
      if (p.x > width + 10) p.x = -10;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${GOLD[0]}, ${GOLD[1]}, ${GOLD[2]}, ${alpha.toFixed(3)})`;
      ctx.shadowColor = `rgba(${GOLD[0]}, ${GOLD[1]}, ${GOLD[2]}, ${(alpha * 0.6).toFixed(3)})`;
      ctx.shadowBlur = p.radius * 3;
      ctx.fill();
    });

    rafId = requestAnimationFrame(step);
  }

  function handleMouseMove(e) {
    const rect = hero.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
  }

  function handleMouseLeave() {
    mouseX = null;
    mouseY = null;
  }

  let resizeTimer = null;
  function handleResize() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 150);
  }

  document.addEventListener("visibilitychange", () => {
    running = !document.hidden;
    if (running && !rafId) step();
    if (!running && rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  });

  resize();
  hero.addEventListener("mousemove", handleMouseMove);
  hero.addEventListener("mouseleave", handleMouseLeave);
  window.addEventListener("resize", handleResize);
  step();
})();
