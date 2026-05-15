
//  script.js
   (function () {
    'use strict';
  
// 1) FADE-UP ON SCROLL
    const fadeObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );
  
    document.querySelectorAll('.fade-up').forEach((el) => {
      fadeObserver.observe(el);
    });
  

// 2) SMOOTH SCROLL FOR IN-PAGE LINKS
      
    document.querySelectorAll('a[href^="#"]').forEach((link) => {
      link.addEventListener('click', (e) => {
        const target = document.querySelector(link.getAttribute('href'));
  
        if (target) {
          e.preventDefault();
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  
// 3) CONTACT FORM SUBMISSION

    const contactForm = document.querySelector('.contact-form');
    const submitBtn = document.getElementById('contact-submit');
    const formSuccess = document.getElementById('form-success');
  
    if (contactForm && submitBtn && formSuccess) {
      contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
  
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
  
        const formData = new FormData(contactForm);
  
        try {
          const response = await fetch(contactForm.action, {
            method: contactForm.method,
            body: formData,
            headers: {
              Accept: 'application/json'
            }
          });
  
          if (response.ok) {
            contactForm.reset();
  
            formSuccess.classList.add('show');
            submitBtn.textContent = 'Sent ✓';
            submitBtn.classList.add('sent');
  
            setTimeout(() => {
              formSuccess.classList.remove('show');
              submitBtn.textContent = 'Send Message';
              submitBtn.classList.remove('sent');
              submitBtn.disabled = false;
            }, 4000);
          } else {
            submitBtn.textContent = 'Try Again';
            submitBtn.disabled = false;
          }
        } catch (error) {
          submitBtn.textContent = 'Try Again';
          submitBtn.disabled = false;
        }
      });
    }
  
// 4) EXPERIENCE SLIDER

    const track = document.querySelector('.exp-slider-track');
    const cards = document.querySelectorAll('.exp-card');
    const prevBtn = document.querySelector('.exp-prev');
    const nextBtn = document.querySelector('.exp-next');
    const dotsContainer = document.querySelector('.exp-dots');
  
    if (track && cards.length && prevBtn && nextBtn && dotsContainer) {
      let currentIndex = 0;
      let cardsPerView = 3;
      const GAP_PX = 24;
  
      function updateCardsPerView() {
        cardsPerView = window.innerWidth <= 768 ? 1 : 3;
      }
  
      function getMaxIndex() {
        return Math.max(0, cards.length - cardsPerView);
      }
  
      function buildDots() {
        dotsContainer.innerHTML = '';
  
        const dotCount = getMaxIndex() + 1;
  
        for (let i = 0; i < dotCount; i++) {
          const dot = document.createElement('button');
          dot.className = 'exp-dot';
          dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
  
          dot.addEventListener('click', () => {
            currentIndex = i;
            updateSlider();
          });
  
          dotsContainer.appendChild(dot);
        }
      }
  
      function updateSlider() {
        const cardWidth = cards[0].offsetWidth;
        const offsetPx = currentIndex * (cardWidth + GAP_PX);
  
        track.style.transform = `translateX(-${offsetPx}px)`;
  
        const dots = dotsContainer.querySelectorAll('.exp-dot');
  
        dots.forEach((dot, i) => {
          dot.classList.toggle('active', i === currentIndex);
        });
  
        cards.forEach((card, i) => {
          card.classList.toggle('active', i === currentIndex);
        });
  
        prevBtn.disabled = currentIndex === 0;
        nextBtn.disabled = currentIndex >= getMaxIndex();
      }
  
      prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
          currentIndex--;
          updateSlider();
        }
      });
  
      nextBtn.addEventListener('click', () => {
        if (currentIndex < getMaxIndex()) {
          currentIndex++;
          updateSlider();
        }
      });
  
      let resizeFrame;
  
      window.addEventListener('resize', () => {
        cancelAnimationFrame(resizeFrame);
  
        resizeFrame = requestAnimationFrame(() => {
          updateCardsPerView();
          buildDots();
  
          if (currentIndex > getMaxIndex()) {
            currentIndex = getMaxIndex();
          }
  
          updateSlider();
        });
      });
  
      let touchStartX = 0;
  
      track.addEventListener(
        'touchstart',
        (e) => {
          touchStartX = e.changedTouches[0].screenX;
        },
        { passive: true }
      );
  
      track.addEventListener(
        'touchend',
        (e) => {
          const touchEndX = e.changedTouches[0].screenX;
          const deltaX = touchEndX - touchStartX;
  
          if (Math.abs(deltaX) > 50) {
            if (deltaX < 0 && currentIndex < getMaxIndex()) {
              currentIndex++;
            } else if (deltaX > 0 && currentIndex > 0) {
              currentIndex--;
            }
  
            updateSlider();
          }
        },
        { passive: true }
      );
  
      updateCardsPerView();
      buildDots();
      updateSlider();
    }
  })();
