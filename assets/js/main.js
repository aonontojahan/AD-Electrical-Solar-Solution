/* ============================================
   AD Electrical & Solar Solution - Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
  // Initialize all functions
  initNavbar();
  initMobileMenu();
  initScrollAnimations();
  initLightbox();
  initFormValidation();
  setFooterYear();
});

/* ============================================
   Navbar Scroll Effect
   ============================================ */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  
  if (!navbar) return;
  
  window.addEventListener('scroll', function() {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
}

/* ============================================
   Mobile Menu Toggle
   ============================================ */
function initMobileMenu() {
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const mobileNav = document.querySelector('.mobile-nav');
  const overlay = document.querySelector('.overlay');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav a');
  
  if (!mobileMenuBtn || !mobileNav) return;
  
  function toggleMenu() {
    mobileMenuBtn.classList.toggle('active');
    mobileNav.classList.toggle('active');
    if (overlay) overlay.classList.toggle('active');
    document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
  }
  
  function closeMenu() {
    mobileMenuBtn.classList.remove('active');
    mobileNav.classList.remove('active');
    if (overlay) overlay.classList.remove('active');
    document.body.style.overflow = '';
  }
  
  mobileMenuBtn.addEventListener('click', toggleMenu);
  
  if (overlay) {
    overlay.addEventListener('click', closeMenu);
  }
  
  // Close menu when clicking on a link
  mobileNavLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });
  
  // Close menu on escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && mobileNav.classList.contains('active')) {
      closeMenu();
    }
  });
}

/* ============================================
   Scroll Animations (Fade In)
   ============================================ */
function initScrollAnimations() {
  const fadeElements = document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right');
  
  if (fadeElements.length === 0) return;
  
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };
  
  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  fadeElements.forEach(element => {
    observer.observe(element);
  });
}

/* ============================================
   Lightbox Gallery
   ============================================ */
function initLightbox() {
  const projectCards = document.querySelectorAll('.project-card');
  const lightbox = document.querySelector('.lightbox');
  const lightboxImg = document.querySelector('.lightbox img');
  const lightboxClose = document.querySelector('.lightbox-close');
  
  if (!lightbox || projectCards.length === 0) return;
  
  projectCards.forEach(card => {
    card.addEventListener('click', function() {
      const img = this.querySelector('img');
      if (img && lightboxImg) {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });
  
  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }
  
  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }
  
  lightbox.addEventListener('click', function(e) {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });
  
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      closeLightbox();
    }
  });
}

/* ============================================
   Form Validation
   ============================================ */
function initFormValidation() {
  const forms = document.querySelectorAll('form[data-validate]');
  
  forms.forEach(form => {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      if (validateForm(this)) {
        // For contact page form with mailto fallback
        const mailtoLink = this.getAttribute('data-mailto');
        if (mailtoLink) {
          const formData = new FormData(this);
          const subject = encodeURIComponent(formData.get('subject') || 'Contact Form Submission');
          const body = encodeURIComponent(`Name: ${formData.get('name')}\nEmail: ${formData.get('email')}\nPhone: ${formData.get('phone')}\n\nMessage:\n${formData.get('message')}`);
          window.location.href = `${mailtoLink}?subject=${subject}&body=${body}`;
        }
        
        // Show success message
        const successMessage = this.querySelector('.success-message');
        if (successMessage) {
          successMessage.classList.add('show');
          this.reset();
          
          // Hide success message after 5 seconds
          setTimeout(() => {
            successMessage.classList.remove('show');
          }, 5000);
        }
      }
    });
    
    // Real-time validation
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
      input.addEventListener('blur', function() {
        validateField(this);
      });
      
      input.addEventListener('input', function() {
        if (this.classList.contains('error')) {
          validateField(this);
        }
      });
    });
  });
}

function validateForm(form) {
  let isValid = true;
  const inputs = form.querySelectorAll('input[required], textarea[required]');
  
  inputs.forEach(input => {
    if (!validateField(input)) {
      isValid = false;
    }
  });
  
  return isValid;
}

function validateField(field) {
  const value = field.value.trim();
  const errorMessage = field.parentElement.querySelector('.error-message');
  let isValid = true;
  let errorText = '';
  
  // Required validation
  if (field.hasAttribute('required') && !value) {
    isValid = false;
    errorText = 'This field is required';
  }
  
  // Email validation
  if (isValid && field.type === 'email' && value) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(value)) {
      isValid = false;
      errorText = 'Please enter a valid email address';
    }
  }
  
  // Phone validation
  if (isValid && field.type === 'tel' && value) {
    const phonePattern = /^[\d\s\-\+\(\)]{10,}$/;
    if (!phonePattern.test(value)) {
      isValid = false;
      errorText = 'Please enter a valid phone number';
    }
  }
  
  // Min length validation
  if (isValid && field.hasAttribute('minlength') && value) {
    const minLength = parseInt(field.getAttribute('minlength'));
    if (value.length < minLength) {
      isValid = false;
      errorText = `Minimum ${minLength} characters required`;
    }
  }
  
  // Update UI
  if (isValid) {
    field.classList.remove('error');
    if (errorMessage) errorMessage.classList.remove('show');
  } else {
    field.classList.add('error');
    if (errorMessage) {
      errorMessage.textContent = errorText;
      errorMessage.classList.add('show');
    }
  }
  
  return isValid;
}

/* ============================================
   Dynamic Footer Year
   ============================================ */
function setFooterYear() {
  const yearElements = document.querySelectorAll('.current-year');
  const currentYear = new Date().getFullYear();
  
  yearElements.forEach(element => {
    element.textContent = currentYear;
  });
}

/* ============================================
   Smooth Scroll for Anchor Links
   ============================================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      e.preventDefault();
      const navbarHeight = document.querySelector('.navbar').offsetHeight;
      const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  });
});

/* ============================================
   Testimonial Slider (Auto-rotate)
   ============================================ */
function initTestimonialSlider() {
  const testimonials = document.querySelectorAll('.testimonial-card');
  
  if (testimonials.length <= 1) return;
  
  let currentIndex = 0;
  
  setInterval(() => {
    testimonials.forEach((testimonial, index) => {
      testimonial.style.opacity = index === currentIndex ? '1' : '0.5';
      testimonial.style.transform = index === currentIndex ? 'scale(1.05)' : 'scale(1)';
    });
    
    currentIndex = (currentIndex + 1) % testimonials.length;
  }, 5000);
}

// Initialize testimonial slider if on homepage
document.addEventListener('DOMContentLoaded', function() {
  if (document.querySelector('.testimonials-section')) {
    initTestimonialSlider();
  }
});
