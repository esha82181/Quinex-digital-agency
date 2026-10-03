/* =========================================================
   QUINEX — CORE SCRIPT
   Controls: mobile navigation toggle, FAQ accordion,
             contact form validation + submit animation,
             portfolio filter buttons
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
let portfolioData = [];

// JSON load karna
fetch('assets/data/portfolio-data.json')
  .then(res => res.json())
  .then(data => {
    portfolioData = data;
    renderWorkGrid('all');
  })
  .catch(err => console.error('Portfolio load error:', err));

// Cards render karna
function renderWorkGrid(filter) {
  const grid = document.getElementById('workGrid');
  const empty = document.getElementById('workEmpty');
  grid.innerHTML = '';

  const filtered = filter === 'all'
    ? portfolioData
    : portfolioData.filter(item => item.category === filter);

  if (filtered.length === 0) {
    empty.style.display = 'block';
    return;
  }
  empty.style.display = 'none';

  filtered.forEach(item => {
    const card = document.createElement('div');
    card.className = 'work-card reveal';
    card.dataset.category = item.category;
    card.innerHTML = `
      <div class="work-thumb ${item.thumbClass}">
        ${item.image ? `<img src="${item.image}" alt="${item.title}">` : `<i class="fa-solid ${item.thumbIcon}"></i>`}
      </div>
      <span class="work-tag">${item.categoryLabel}</span>
      <h3 class="work-title">${item.title}</h3>
      <p class="work-desc">${item.description}</p>
      <a href="${item.boardImage ? '#' : item.link}" class="work-link" data-board="${item.boardImage || ''}" data-title="${item.title}">
  ${item.linkText || 'View Case Study'} <i class="fa-solid fa-arrow-right"></i>
</a>
      
    `;
    grid.appendChild(card);
  });
}
// Lightbox click handling
document.addEventListener('click', (e) => {
  const link = e.target.closest('.work-link[data-board]');
  if (link && link.dataset.board) {
    e.preventDefault();
    const lightbox = document.getElementById('boardLightbox');
    const lightboxImg = document.getElementById('lightboxImage');
    lightboxImg.src = link.dataset.board;
    lightboxImg.alt = link.dataset.title;
    lightbox.classList.add('is-open');
  }
});

document.getElementById('lightboxClose')?.addEventListener('click', () => {
  document.getElementById('boardLightbox').classList.remove('is-open');
});

document.getElementById('boardLightbox')?.addEventListener('click', (e) => {
  if (e.target.id === 'boardLightbox') {
    document.getElementById('boardLightbox').classList.remove('is-open');
  }
});
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelector('.filter-btn.is-active')?.classList.remove('is-active');
    btn.classList.add('is-active');
    renderWorkGrid(btn.dataset.filter);
  });
});
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
    /* ---------- DROPDOWN PLACEHOLDER COLOR (Contact form selects) ---------- */
  document.querySelectorAll('.form-field select').forEach((select) => {
    const updateColor = () => {
      select.classList.toggle('has-value', select.value !== '');
    };
    updateColor(); // set correct color on page load
    select.addEventListener('change', updateColor);
  });
    /* ---------- CONTACT FORM: real-time input restrictions ---------- */
  const fullNameInput = document.getElementById('fullName');
  const phoneInput = document.getElementById('phone');

  // Full Name: block numbers/symbols as the user types (letters + spaces only)
  if (fullNameInput) {
    fullNameInput.addEventListener('input', () => {
      fullNameInput.value = fullNameInput.value.replace(/[^A-Za-z\s]/g, '');
    });
  }

  // Phone: block letters/symbols as the user types (digits, +, -, spaces only)
  if (phoneInput) {
    phoneInput.addEventListener('input', () => {
      phoneInput.value = phoneInput.value.replace(/[^0-9+\-\s]/g, '');
    });
  }
    // Company Name: letters, numbers, spaces, and & . , - ' only
  const companyInput = document.getElementById('companyName');
  if (companyInput) {
    companyInput.addEventListener('input', () => {
      companyInput.value = companyInput.value.replace(/[^A-Za-z0-9\s&.,'\-]/g, '');
    });
  }

  // Budget: numbers, $, commas, hyphens, spaces only (e.g. "$500 - 1000")
  const budgetInput = document.getElementById('budget');
  if (budgetInput) {
    budgetInput.addEventListener('input', () => {
      budgetInput.value = budgetInput.value.replace(/[^0-9$,\-\s]/g, '');
    });
  }

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
            // Extra format validation (name = letters only, email format, phone format)
      const namePattern = /^[A-Za-z\s]+$/;
      if (!namePattern.test(contactForm.fullName.value.trim())) {
        errorMsg.textContent = 'Name can only contain letters.';
        errorMsg.classList.add('is-visible');
        contactForm.fullName.style.borderColor = '#f87171';
        return;
      }

      const emailPattern = /^\S+@\S+\.\S+$/;
      if (!emailPattern.test(contactForm.email.value.trim())) {
        errorMsg.textContent = 'Please enter a valid email address.';
        errorMsg.classList.add('is-visible');
        contactForm.email.style.borderColor = '#f87171';
        return;
      }

      const phoneValue = contactForm.phone.value.trim();
      const phonePattern = /^[0-9+\-\s]{7,15}$/;
      if (phoneValue && !phonePattern.test(phoneValue)) {
        errorMsg.textContent = 'Please enter a valid phone number.';
        errorMsg.classList.add('is-visible');
        contactForm.phone.style.borderColor = '#f87171';
        return;
      }
            const companyValue = contactForm.companyName.value.trim();
      const companyPattern = /^[A-Za-z0-9\s&.,'\-]+$/;
      if (companyValue && !companyPattern.test(companyValue)) {
        errorMsg.textContent = 'Please enter a valid company name.';
        errorMsg.classList.add('is-visible');
        contactForm.companyName.style.borderColor = '#f87171';
        return;
      }

      const budgetValue = contactForm.budget.value.trim();
      const budgetPattern = /^[0-9$,\-\s]+$/;
      if (budgetValue && !budgetPattern.test(budgetValue)) {
        errorMsg.textContent = 'Budget should contain numbers only.';
        errorMsg.classList.add('is-visible');
        contactForm.budget.style.borderColor = '#f87171';
        return;
      }

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