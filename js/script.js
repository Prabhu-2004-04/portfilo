document.addEventListener('DOMContentLoaded', () => {
  // --- Initialize DOM Elements ---
  const body = document.body;
  const header = document.querySelector('.header');
  const navbar = document.querySelector('.navbar');
  const hamburgerBtn = document.querySelector('.hamburger-btn');
  const themeToggleBtn = document.querySelector('.theme-toggle-btn');
  const scrollTopBtn = document.querySelector('.scroll-top-btn');
  const progressBar = document.querySelector('.scroll-progress-bar');
  const preloader = document.querySelector('.preloader');
  const contactForm = document.getElementById('contactForm');
  const toastMsg = document.querySelector('.toast-msg');

  // --- 1. Preloader Handler ---
  window.addEventListener('load', () => {
    setTimeout(() => {
      if (preloader) {
        preloader.classList.add('fade-out');
      }
    }, 400); // 400ms buffer for smooth entry
  });
  
  // Fallback in case load event already fired or delayed
  setTimeout(() => {
    if (preloader && !preloader.classList.contains('fade-out')) {
      preloader.classList.add('fade-out');
    }
  }, 1500);

  // --- 2. Theme Switching (Light/Dark) ---
  const currentTheme = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', currentTheme);

  themeToggleBtn.addEventListener('click', () => {
    let theme = document.documentElement.getAttribute('data-theme');
    let newTheme = theme === 'dark' ? 'light' : 'dark';
    
    // Add temporary transition class to body to prevent flashing during switch
    body.style.transition = 'background-color 0.5s ease, color 0.5s ease';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  });

  // --- 3. Scroll Progress and Header states ---
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    
    // Header scrolled class
    if (scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Scroll Progress Bar
    if (docHeight > 0) {
      const scrollPercent = (scrollY / docHeight) * 100;
      progressBar.style.width = `${scrollPercent}%`;
    }

    // Scroll To Top Visibility
    if (scrollY > 600) {
      scrollTopBtn.classList.add('show');
    } else {
      scrollTopBtn.classList.remove('show');
    }
  });

  // Scroll to Top action
  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  // --- 4. Mobile Menu Handler ---
  const toggleMobileMenu = () => {
    navbar.classList.toggle('open');
    hamburgerBtn.classList.toggle('open');
  };

  hamburgerBtn.addEventListener('click', toggleMobileMenu);

  // Close mobile menu when clicking nav links
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navbar.classList.contains('open')) {
        toggleMobileMenu();
      }
    });
  });

  // Close mobile menu when clicking outside
  document.addEventListener('click', (e) => {
    if (navbar.classList.contains('open') && 
        !navbar.contains(e.target) && 
        !hamburgerBtn.contains(e.target)) {
      toggleMobileMenu();
    }
  });

  // --- 5. Navigation Highlighting on Scroll (Intersection Observer) ---
  const sections = document.querySelectorAll('section');
  const observerOptions = {
    root: null,
    rootMargin: '-30% 0px -60% 0px', // Trigger activation near vertical center of viewport
    threshold: 0
  };

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => navObserver.observe(section));

  // --- 6. Scroll Triggered Animations ---
  const animateOptions = {
    root: null,
    rootMargin: '0px 0px -100px 0px', // Trigger slightly before element enters viewport
    threshold: 0.1
  };

  const animationObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        
        // Custom hooks for specific element entries
        if (entry.target.classList.contains('skills-category-card')) {
          animateSkillsBars(entry.target);
        }
        if (entry.target.classList.contains('about-stats')) {
          animateCounters(entry.target);
        }
        
        observer.unobserve(entry.target); // Animate once
      }
    });
  }, animateOptions);

  // Observe all scroll animation items
  document.querySelectorAll('.animate-on-scroll').forEach(el => {
    animationObserver.observe(el);
  });

  // Skill progress bar animation helper
  const animateSkillsBars = (card) => {
    const bars = card.querySelectorAll('.skill-progress-bar');
    bars.forEach(bar => {
      const progress = bar.getAttribute('data-progress');
      bar.style.width = `${progress}%`;
    });
  };

  // Stat Counter animation helper
  let countersAnimated = false;
  const animateCounters = (statsContainer) => {
    if (countersAnimated) return;
    countersAnimated = true;

    const counters = statsContainer.querySelectorAll('.stat-num');
    counters.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-target'), 10);
      const suffix = counter.getAttribute('data-suffix') || '';
      let count = 0;
      const duration = 1500; // Total millisecond duration
      const stepTime = Math.max(Math.floor(duration / target), 15);
      
      const timer = setInterval(() => {
        count += Math.ceil(target / (duration / stepTime));
        if (count >= target) {
          counter.textContent = target + suffix;
          clearInterval(timer);
        } else {
          counter.textContent = count + suffix;
        }
      }, stepTime);
    });
  };

  // --- 7. Button Ripple Effect ---
  const buttons = document.querySelectorAll('.btn, .social-icon, .theme-toggle-btn');
  buttons.forEach(button => {
    button.addEventListener('click', function(e) {
      // Don't draw ripple for basic non-filled small circles if it distorts layout
      if (this.classList.contains('theme-toggle-btn') || this.classList.contains('social-icon')) {
        return;
      }
      
      let x = e.clientX - e.target.getBoundingClientRect().left;
      let y = e.clientY - e.target.getBoundingClientRect().top;
      
      let ripple = document.createElement('span');
      ripple.classList.add('ripple');
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      
      this.appendChild(ripple);
      
      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  });

  // --- 8. Project Grid Filtering ---
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active class from buttons and apply to current
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'flex';
          // Force reflow for fade in
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => {
            card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // --- 9. Contact Form Validation and Mock Submission ---
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const nameInput = document.getElementById('name');
      const emailInput = document.getElementById('email');
      const messageInput = document.getElementById('message');
      
      let isValid = true;

      // Helper function to show errors
      const showError = (input, message) => {
        input.classList.add('error');
        const errorContainer = input.nextElementSibling;
        if (errorContainer && errorContainer.classList.contains('error-message')) {
          errorContainer.textContent = message;
        }
        isValid = false;
      };

      // Helper function to clear errors
      const clearError = (input) => {
        input.classList.remove('error');
        const errorContainer = input.nextElementSibling;
        if (errorContainer && errorContainer.classList.contains('error-message')) {
          errorContainer.textContent = '';
        }
      };

      // Name Validation
      if (nameInput.value.trim() === '') {
        showError(nameInput, 'Name is required.');
      } else {
        clearError(nameInput);
      }

      // Email Validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (emailInput.value.trim() === '') {
        showError(emailInput, 'Email is required.');
      } else if (!emailRegex.test(emailInput.value.trim())) {
        showError(emailInput, 'Please enter a valid email address.');
      } else {
        clearError(emailInput);
      }

      // Message Validation
      if (messageInput.value.trim() === '') {
        showError(messageInput, 'Message is required.');
      } else if (messageInput.value.trim().length < 10) {
        showError(messageInput, 'Message must be at least 10 characters.');
      } else {
        clearError(messageInput);
      }

      // If valid, simulate submission
      if (isValid) {
        const submitBtn = contactForm.querySelector('.form-submit-btn');
        const originalBtnText = submitBtn.innerHTML;
        
        // Show loading state
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
          <svg class="spinner-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="animation: spin 1s linear infinite; margin-right: 0.5rem; display: inline-block; vertical-align: middle;">
            <line x1="12" y1="2" x2="12" y2="6"></line>
            <line x1="12" y1="18" x2="12" y2="22"></line>
            <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
            <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
            <line x1="2" y1="12" x2="6" y2="12"></line>
            <line x1="18" y1="12" x2="22" y2="12"></line>
            <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
            <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
          </svg>
          Sending...
        `;

        // Inject css keyframes dynamically for button spinner
        if (!document.getElementById('spinAnimation')) {
          const style = document.createElement('style');
          style.id = 'spinAnimation';
          style.innerHTML = `@keyframes spin { to { transform: rotate(360deg); } }`;
          document.head.appendChild(style);
        }

        // Simulate API call
        setTimeout(() => {
          // Reset form fields
          contactForm.reset();
          
          // Re-enable and restore button
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnText;

          // Display success toast notification
          showToast();
        }, 1800);
      }
    });
  }

  // Toast message helper
  const showToast = () => {
    if (toastMsg) {
      toastMsg.classList.add('show');
      setTimeout(() => {
        toastMsg.classList.remove('show');
      }, 4000);
    }
  };
});
