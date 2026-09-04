
/* =========================================================
   QUINEX — ANIMATIONS SCRIPT
   Controls: scroll-triggered reveal animations
   Reusable: just add class="reveal" to any element and it
   will fade+slide up the first time it enters the viewport.
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
  const revealEls = document.querySelectorAll('.reveal');
  if (!revealEls.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-visible');
        observer.unobserve(entry.target); // animate once only
      }
    });
  }, {
    threshold: 0.15, // trigger when 15% of the element is visible
  });

  revealEls.forEach((el) => observer.observe(el));
});
