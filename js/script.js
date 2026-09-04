/* =========================================================
   QUINEX — CORE SCRIPT
   Controls: mobile navigation toggle, FAQ accordion,
             contact form validation + submit animation,
             portfolio filter buttons
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- MOBILE NAV TOGGLE ---------- */
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('active');
      hamburger.classList.toggle('active', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen);
    });

    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- FAQ ACCORDION (Contact page) ---------- */
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach((item) => {
    const question = item.querySelector('.faq-question');

    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');

      faqItems.forEach((other) => {
        other.classList.remove('is-open');
        other.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
      });

      if (!isOpen) {
        item.classList.add('is-open');
        question.setAttribute('aria-expanded', 'true');
      }
    });
  });

    /* ---------- CONTACT FORM: real backend submission ---------- */
  const contactForm = document.getElementById('contactForm');

  // ⚠️ Change this if your backend runs on a different URL/port
  const API_BASE_URL = 'http://localhost:5000';

  if (contactForm) {
    const submitBtn = contactForm.querySelector('.form-submit');
    const successMsg = document.getElementById('formSuccess');
    const errorMsg = document.getElementById('formError');

    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      errorMsg.classList.remove('is-visible');
      successMsg.classList.remove('is-visible');

      // Required-field check (native "required" already blocks most empty submits)
      const requiredFields = contactForm.querySelectorAll('[required]');
      let allFilled = true;

      requiredFields.forEach((field) => {
        if (!field.value.trim()) {
          allFilled = false;
          field.style.borderColor = '#f87171';
        } else {
          field.style.borderColor = '';
        }
      });

      if (!allFilled) return;

      const payload = {
        fullName: contactForm.fullName.value.trim(),
        email: contactForm.email.value.trim(),
        phone: contactForm.phone.value.trim(),
        companyName: contactForm.companyName.value.trim(),
        service: contactForm.service.value,
        budget: contactForm.budget.value.trim(),
        preferredContact: contactForm.preferredContact.value,
        projectDetails: contactForm.projectDetails.value.trim(),
      };

      submitBtn.classList.add('is-loading');
      submitBtn.disabled = true;

      try {
        const response = await fetch(`${API_BASE_URL}/api/quotes`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || 'Something went wrong.');
        }

        successMsg.classList.add('is-visible');
        contactForm.reset();

        setTimeout(() => {
          successMsg.classList.remove('is-visible');
        }, 6000);
      } catch (error) {
        errorMsg.textContent = 'Could not send your request. Please try again or contact us directly.';
        errorMsg.classList.add('is-visible');
      } finally {
        submitBtn.classList.remove('is-loading');
        submitBtn.disabled = false;
      }
    });
  }
  /* ---------- PORTFOLIO FILTER BUTTONS (Portfolio page) ---------- */
  const filterRow = document.getElementById('filterRow');
  const workGrid = document.getElementById('workGrid');
  const workEmpty = document.getElementById('workEmpty');

  if (filterRow && workGrid) {
    const filterButtons = filterRow.querySelectorAll('.filter-btn');
    const workCards = workGrid.querySelectorAll('.work-card');

    filterButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        // Highlight the clicked filter only
        filterButtons.forEach((b) => b.classList.remove('is-active'));
        btn.classList.add('is-active');

        const filter = btn.getAttribute('data-filter');
        let visibleCount = 0;

        workCards.forEach((card) => {
          const matches = filter === 'all' || card.getAttribute('data-category') === filter;
          card.classList.toggle('is-hidden', !matches);
          if (matches) visibleCount++;
        });

        // Show a friendly message if a category currently has no projects
        if (workEmpty) {
          workEmpty.classList.toggle('is-visible', visibleCount === 0);
        }
      });
    });
  }
});