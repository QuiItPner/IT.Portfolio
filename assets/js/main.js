/**
 * Mai Phuc Qui - Portfolio Interactive Script & Animation Controller
 * Replicates Gatsby/Ant Design interactions & animations from hongtin2104.github.io
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Hamburger Menu Toggle (matches Header/index.jsx)
  const circleMenu = document.getElementById('circleMenuBtn');
  const hamburger = document.getElementById('hamburgerIcon');
  const navWrap = document.getElementById('headerNavWrap');

  let menuOpen = false;

  function setMenuState(open) {
    menuOpen = open;
    if (menuOpen) {
      hamburger.classList.add('menuIcon');
      navWrap.classList.remove('hidden');
      navWrap.classList.add('openMenu');
    } else {
      hamburger.classList.remove('menuIcon');
      navWrap.classList.add('hidden');
      navWrap.classList.remove('openMenu');
    }
  }

  function toggleMenu() {
    if (window.innerWidth <= 768) {
      setMenuState(!menuOpen);
    }
  }

  if (circleMenu) {
    circleMenu.addEventListener('click', toggleMenu);
    circleMenu.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleMenu();
      }
    });
  }

  window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && menuOpen) {
      setMenuState(false);
    }
    updateSidebarVisibility();
  });

  // 2. SPA View Switching & Page Re-Animation (About / Projects / Contact / Resume)
  const navLinks = document.querySelectorAll('[data-page]');
  const pageViews = document.querySelectorAll('.page-view');
  const sidebarCol = document.getElementById('sidebarCol');

  let currentPage = 'about';

  function updateSidebarVisibility() {
    if (!sidebarCol) return;
    // Matches Sidebar/index.jsx: on mobile (<768px), sidebar only shows on Home ('about')
    if (window.innerWidth < 768 && currentPage !== 'about') {
      sidebarCol.style.display = 'none';
    } else {
      sidebarCol.style.display = '';
    }
  }

  function retriggerAnimations(container) {
    if (!container) return;
    const animatedEls = container.querySelectorAll('.animate-fade-in-up');
    animatedEls.forEach((el) => {
      el.style.animation = 'none';
      // Trigger reflow
      void el.offsetHeight;
      el.style.animation = '';
    });
  }

  function switchPage(targetPage, scrollTargetId = null) {
    currentPage = targetPage;

    // Update active state on nav links
    navLinks.forEach((link) => {
      const linkPage = link.getAttribute('data-page');
      const linkScroll = link.getAttribute('data-scroll');
      if (scrollTargetId) {
        if (linkScroll === scrollTargetId) {
          link.classList.add('anchorActive');
        } else {
          link.classList.remove('anchorActive');
        }
      } else {
        if (linkPage === targetPage && !linkScroll) {
          link.classList.add('anchorActive');
        } else {
          link.classList.remove('anchorActive');
        }
      }
    });

    // Show target view
    pageViews.forEach((view) => {
      if (view.id === `view-${targetPage}`) {
        view.classList.add('active-view');
        retriggerAnimations(view);
      } else {
        view.classList.remove('active-view');
      }
    });

    updateSidebarVisibility();

    // Close mobile menu if open
    if (menuOpen) {
      setMenuState(false);
    }

    // Scroll handling
    if (scrollTargetId) {
      setTimeout(() => {
        const targetEl = document.getElementById(scrollTargetId);
        if (targetEl) {
          targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 60);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  navLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      const targetPage = link.getAttribute('data-page');
      const scrollTargetId = link.getAttribute('data-scroll');
      if (targetPage) {
        e.preventDefault();
        switchPage(targetPage, scrollTargetId);
      }
    });
  });

  // 3. Project Category Filter (All / Phu Nong Co., Ltd. / University & CV / Automation Tools)
  const filterBtns = document.querySelectorAll('.projectTabBtn');
  const projectItems = document.querySelectorAll('.project-item-col');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const filterValue = btn.getAttribute('data-filter');

      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      projectItems.forEach((item) => {
        const categories = (item.getAttribute('data-category') || '').split(' ');
        if (filterValue === 'all' || categories.includes(filterValue)) {
          item.style.display = 'block';
          const card = item.querySelector('.projectCard');
          if (card) {
            card.style.animation = 'none';
            void card.offsetHeight;
            card.style.animation = 'fadeInUp 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) forwards';
          }
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  // 4. Contact Form Handler (Replicates ContactForm/index.jsx with Antd Toast)
  const contactForm = document.getElementById('contactForm');
  const toastEl = document.getElementById('antToast');

  function showToast(msg) {
    if (!toastEl) return;
    const textSpan = toastEl.querySelector('.toast-text');
    if (textSpan) textSpan.textContent = msg;
    toastEl.classList.add('show');
    setTimeout(() => {
      toastEl.classList.remove('show');
    }, 4000);
  }

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const nameVal = document.getElementById('contactName').value.trim();
      const emailVal = document.getElementById('contactEmail').value.trim();
      const descVal = document.getElementById('contactDescription').value.trim();

      if (!nameVal || !descVal) {
        showToast('Please fill in all required fields (*)');
        return;
      }

      // Open mailto or send form feedback
      showToast('Thank you for your kind response! Will get back to you soon.');
      contactForm.reset();
    });
  }

  // Initialize copyright year
  const yearEl = document.getElementById('currentYear');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
});

