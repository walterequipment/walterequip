/* ============================================
   Walter Equipment - Main JavaScript
   Navigation, Animations, Interactions
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {

  // ============================================
  // HEADER SCROLL EFFECT
  // ============================================
  const header = document.querySelector('.header');
  
  function handleScroll() {
    if (window.scrollY > 80) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }
  
  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Check on load

  // ============================================
  // MOBILE MENU TOGGLE
  // ============================================
  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', function() {
      this.classList.toggle('active');
      navMenu.classList.toggle('active');
      document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu when clicking a link
    navMenu.querySelectorAll('a').forEach(function(link) {
      link.addEventListener('click', function() {
        menuToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
      });
    });

    // Close menu on outside click
    document.addEventListener('click', function(e) {
      if (!menuToggle.contains(e.target) && !navMenu.contains(e.target)) {
        menuToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  // ============================================
  // SMOOTH SCROLL FOR ANCHOR LINKS
  // ============================================
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        const headerHeight = header.offsetHeight;
        const targetPosition = targetEl.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ============================================
  // SCROLL-TRIGGERED ANIMATIONS (IntersectionObserver)
  // ============================================
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -80px 0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Optional: unobserve after animation plays once
        // observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe all animated elements
  document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right').forEach(function(el) {
    observer.observe(el);
  });

  // ============================================
  // COUNTER ANIMATION FOR STATS
  // ============================================
  function animateCounter(el, target, duration) {
    let start = 0;
    const increment = target / (duration / 16);
    
    function update() {
      start += increment;
      if (start < target) {
        el.textContent = Math.floor(start) + '+';
        requestAnimationFrame(update);
      } else {
        el.textContent = target + '+';
      }
    }
    
    update();
  }

  const statsObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting && !entry.target.dataset.animated) {
        entry.target.dataset.animated = 'true';
        const target = parseInt(entry.target.dataset.count);
        animateCounter(entry.target, target, 1500);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.stat-number[data-count]').forEach(function(stat) {
    statsObserver.observe(stat);
  });

  // ============================================
  // CONTACT FORM HANDLING
  // ============================================
  const contactForm = document.getElementById('contactForm');
  
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Get form data
      const formData = new FormData(this);
      const data = {};
      formData.forEach(function(value, key) {
        data[key] = value;
      });
      
      // Basic validation
      let isValid = true;
      this.querySelectorAll('[required]').forEach(function(field) {
        if (!field.value.trim()) {
          isValid = false;
          field.style.borderColor = '#e53e3e';
        } else {
          field.style.borderColor = '#e2e8f0';
        }
      });
      
      if (!isValid) {
        showFormMessage('Please fill in all required fields.', 'error');
        return;
      }

      // Email validation
      const emailField = this.querySelector('[name="email"]');
      if (emailField && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailField.value)) {
        showFormMessage('Please enter a valid email address.', 'error');
        return;
      }

      // Show success message (replace with actual form submission)
      const submitBtn = this.querySelector('.btn-submit');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;

      // Simulate form submission (replace with Formspree or similar)
      setTimeout(function() {
        showFormMessage('Thank you! Your message has been sent. We\'ll get back to you within 24 hours.', 'success');
        contactForm.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }, 1200);
    });
  }

  function showFormMessage(message, type) {
    // Remove existing message
    const existingMsg = document.querySelector('.form-message');
    if (existingMsg) existingMsg.remove();

    const msgEl = document.createElement('div');
    msgEl.className = 'form-message';
    msgEl.style.cssText = 
      'padding: 14px 20px; border-radius: 8px; margin-bottom: 20px; font-size: 14px; font-weight: 500;' +
      (type === 'success' ? 'background: #f0fdf4; color: #166534; border: 1px solid #bbf7d0;' : 'background: #fef2f2; color: #991b1b; border: 1px solid #fecaca;');
    msgEl.textContent = message;

    const formInner = document.querySelector('.contact-form');
    formInner.insertBefore(msgEl, formInner.firstChild);

    // Auto-remove after 5 seconds
    setTimeout(function() {
      if (msgEl.parentNode) msgEl.remove();
    }, 5000);
  }

  // ============================================
  // ACTIVE NAV LINK HIGHLIGHTING
  // ============================================
  const sections = document.querySelectorAll('section[id]');
  
  function highlightNav() {
    const scrollPos = window.scrollY + header.offsetHeight + 100;
    
    sections.forEach(function(section) {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      
      if (scrollPos >= top && scrollPos < top + height) {
        document.querySelectorAll('.nav-menu a').forEach(function(link) {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + id) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', highlightNav);

  // ============================================
  // PRODUCT CARD HOVER EFFECT (3D tilt)
  // ============================================
  document.querySelectorAll('.product-card').forEach(function(card) {
    card.addEventListener('mousemove', function(e) {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / 20;
      const rotateY = (centerX - x) / 20;
      
      card.style.transform = 'perspective(1000px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) translateY(-8px)';
    });

    card.addEventListener('mouseleave', function() {
      card.style.transform = '';
    });
  });

});
