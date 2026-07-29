document.addEventListener("DOMContentLoaded", () => {
  // ==========================================================================
  // 1. Navigation Scroll Effect, Active Link Scrollspy & Mobile Drawer Controller
  // ==========================================================================
  const navbar = document.getElementById("navbar");
  const mobileToggle = document.getElementById("mobile-toggle");
  const mobileDrawer = document.getElementById("mobile-drawer");
  const mobileClose = document.getElementById("mobile-close");
  const mobileOverlay = document.getElementById("mobile-overlay");
  const mobileLinks = document.querySelectorAll(
    ".mobile-link, .mobile-nav-links a",
  );
  const navLinks = document.querySelectorAll(".nav-links a");
  const backToTopBtn = document.getElementById("back-to-top");
  const sections = document.querySelectorAll("section[id]");

  // Drawer Controls
  const openDrawer = () => {
    mobileDrawer?.classList.add("active");
    mobileOverlay?.classList.add("active");
    document.body.style.overflow = "hidden";
  };

  const closeDrawer = () => {
    mobileDrawer?.classList.remove("active");
    mobileOverlay?.classList.remove("active");
    document.body.style.overflow = "";
  };

  if (mobileToggle) mobileToggle.addEventListener("click", openDrawer);
  if (mobileClose) mobileClose.addEventListener("click", closeDrawer);
  if (mobileOverlay) mobileOverlay.addEventListener("click", closeDrawer);

  mobileLinks.forEach((link) => {
    link.addEventListener("click", closeDrawer);
  });

  // Scrollspy for active navigation links
  const updateActiveNav = () => {
    let currentSectionId = "home";
    const scrollPosition = window.scrollY + 160;

    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPosition >= top && scrollPosition < top + height) {
        currentSectionId = section.getAttribute("id");
      }
    });

    if (window.scrollY < 100) {
      currentSectionId = "home";
    }

    const allNavItems = document.querySelectorAll(
      ".nav-links a, .mobile-nav-links a",
    );
    allNavItems.forEach((link) => {
      const href = link.getAttribute("href");
      if (href === `#${currentSectionId}`) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });
  };

  // Scroll Header & Back-to-Top Effect
  const handleScroll = () => {
    if (window.scrollY > 40) {
      navbar?.classList.add("scrolled");
    } else {
      navbar?.classList.remove("scrolled");
    }

    if (window.scrollY > 400) {
      backToTopBtn?.classList.add("visible");
    } else {
      backToTopBtn?.classList.remove("visible");
    }

    updateActiveNav();
  };

  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();

  // Back to top click
  backToTopBtn?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // ==========================================================================
  // 2. Interactive Before / After Comparison Slider
  // ==========================================================================
  const baSlider = document.getElementById("ba-slider");
  const baAfterLayer = document.getElementById("ba-after-layer");
  const baHandle = document.getElementById("ba-handle");

  if (baSlider && baAfterLayer && baHandle) {
    let isDragging = false;

    const updateSliderPosition = (clientX) => {
      const rect = baSlider.getBoundingClientRect();
      let x = clientX - rect.left;

      // Boundary constraints
      if (x < 0) x = 0;
      if (x > rect.width) x = rect.width;

      const percentage = (x / rect.width) * 100;

      // Undistorted Clip Path clipping
      baAfterLayer.style.clipPath = `inset(0 0 0 ${percentage}%)`;
      baHandle.style.left = `${percentage}%`;
    };

    const startDragging = (e) => {
      isDragging = true;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      updateSliderPosition(clientX);
    };

    const stopDragging = () => {
      isDragging = false;
    };

    const onMove = (e) => {
      if (!isDragging) return;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      updateSliderPosition(clientX);
    };

    baSlider.addEventListener("mousedown", startDragging);
    baSlider.addEventListener("touchstart", startDragging, { passive: true });

    window.addEventListener("mouseup", stopDragging);
    window.addEventListener("touchend", stopDragging);

    window.addEventListener("mousemove", onMove);
    window.addEventListener("touchmove", onMove, { passive: true });
  }

  // ==========================================================================
  // 3. Animated Number Counters
  // ==========================================================================
  const statNumbers = document.querySelectorAll(".stat-number");
  let hasAnimatedStats = false;

  const animateCounters = () => {
    if (hasAnimatedStats) return;
    hasAnimatedStats = true;

    statNumbers.forEach((stat) => {
      const target = parseInt(stat.getAttribute("data-target"), 10);
      if (isNaN(target)) return;

      let current = 0;
      const duration = 2000;
      const increment = target / (duration / 16);

      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }

        if (target === 99) {
          stat.textContent = `${Math.floor(current).toLocaleString("fa-IR")}٪`;
        } else {
          stat.textContent = `+${Math.floor(current).toLocaleString("fa-IR")}`;
        }
      }, 16);
    });
  };

  // Observer for Hero Stats
  const statsContainer = document.querySelector(".hero-stats");
  if (statsContainer && "IntersectionObserver" in window) {
    const statsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounters();
            statsObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 },
    );

    statsObserver.observe(statsContainer);
  } else {
    animateCounters();
  }

  // ==========================================================================
  // 4. Diagnostic Quiz State Machine & Lead Form
  // ==========================================================================
  const quizSteps = document.querySelectorAll(".quiz-step");
  const quizProgressBar = document.getElementById("quiz-progress-bar");
  const quizStepText = document.getElementById("quiz-step-text");
  const quizPercentText = document.getElementById("quiz-percent-text");
  const quizLeadForm = document.getElementById("quiz-lead-form");
  const resultsSection = document.getElementById("results-section");
  const quizSection = document.getElementById("quiz-section");
  const userNameDisplay = document.getElementById("user-name-display");

  let currentQuizStep = 0;
  const totalQuizSteps = 4; // 3 questions + 1 lead form

  const updateQuizUI = () => {
    quizSteps.forEach((step, index) => {
      if (index === currentQuizStep) {
        step.classList.add("active");
      } else {
        step.classList.remove("active");
      }
    });

    const progressPercent = Math.round(
      (currentQuizStep / (totalQuizSteps - 1)) * 100,
    );
    if (quizProgressBar) quizProgressBar.style.width = `${progressPercent}%`;
    if (quizPercentText)
      quizPercentText.textContent = `${progressPercent.toLocaleString("fa-IR")}٪ کامل شده`;

    if (currentQuizStep < 3) {
      if (quizStepText)
        quizStepText.textContent = `مرحله ${(currentQuizStep + 1).toLocaleString("fa-IR")} از ۳`;
    } else {
      if (quizStepText) quizStepText.textContent = `مرحله نهایی`;
    }
  };

  // Enable next button when option chosen
  quizSteps.forEach((step) => {
    const radioInputs = step.querySelectorAll('input[type="radio"]');
    const nextBtn = step.querySelector(".quiz-next-btn");

    if (radioInputs.length > 0 && nextBtn) {
      radioInputs.forEach((input) => {
        input.addEventListener("change", () => {
          nextBtn.removeAttribute("disabled");
        });
      });

      nextBtn.addEventListener("click", () => {
        if (currentQuizStep < totalQuizSteps - 1) {
          currentQuizStep++;
          updateQuizUI();
        }
      });
    }

    const prevBtn = step.querySelector(".quiz-prev-btn");
    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        if (currentQuizStep > 0) {
          currentQuizStep--;
          updateQuizUI();
        }
      });
    }
  });

  // Quiz Lead Form Submit
  if (quizLeadForm) {
    quizLeadForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const nameInput = document.getElementById("quiz-name").value;

      if (userNameDisplay && nameInput) {
        userNameDisplay.textContent = nameInput;
      }

      if (quizSection) quizSection.classList.add("hidden");
      if (resultsSection) {
        resultsSection.classList.remove("hidden");
        resultsSection.scrollIntoView({ behavior: "smooth", block: "start" });
      }

      startCountdownTimer();
      showToast("تحلیل اختصاصی شما با موفقیت آماده شد!");
    });
  }

  // ==========================================================================
  // 5. 48-Hour Countdown Timer
  // ==========================================================================
  const startCountdownTimer = () => {
    const countDownDate = new Date().getTime() + 48 * 60 * 60 * 1000;

    const hoursEl = document.getElementById("hours");
    const minsEl = document.getElementById("minutes");
    const secsEl = document.getElementById("seconds");

    const timerInterval = setInterval(() => {
      const now = new Date().getTime();
      const distance = countDownDate - now;

      if (distance < 0) {
        clearInterval(timerInterval);
        if (hoursEl) hoursEl.textContent = "00";
        if (minsEl) minsEl.textContent = "00";
        if (secsEl) secsEl.textContent = "00";
        return;
      }

      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      if (hoursEl) hoursEl.textContent = hours < 10 ? "0" + hours : hours;
      if (minsEl) minsEl.textContent = minutes < 10 ? "0" + minutes : minutes;
      if (secsEl) secsEl.textContent = seconds < 10 ? "0" + seconds : seconds;
    }, 1000);
  };

  // ==========================================================================
  // 6. Portfolio Category Filter
  // ==========================================================================
  const filterBtns = document.querySelectorAll(".filter-btn");
  const galleryCards = document.querySelectorAll(".gallery-card");

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const filterValue = btn.getAttribute("data-filter");

      galleryCards.forEach((card) => {
        const category = card.getAttribute("data-category");
        if (filterValue === "all" || category === filterValue) {
          card.style.display = "block";
          card.style.opacity = "1";
        } else {
          card.style.display = "none";
          card.style.opacity = "0";
        }
      });
    });
  });

  // ==========================================================================
  // 7. FAQ Accordion Toggle
  // ==========================================================================
  const faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach((item) => {
    const header = item.querySelector(".faq-header");
    if (header) {
      header.addEventListener("click", () => {
        const isActive = item.classList.contains("active");

        // Close other items
        faqItems.forEach((other) => other.classList.remove("active"));

        // Toggle current
        if (!isActive) {
          item.classList.add("active");
        }
      });
    }
  });

  // ==========================================================================
  // 8. Booking Modal Dialog Controller
  // ==========================================================================
  const bookingModal = document.getElementById("booking-modal");
  const openModalBtns = document.querySelectorAll(".open-booking-modal");
  const closeModalBtn = document.getElementById("modal-close");
  const modalBookingForm = document.getElementById("modal-booking-form");
  const modalServiceSelect = document.getElementById("modal-service");

  openModalBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const requestedService = btn.getAttribute("data-service");
      if (requestedService && modalServiceSelect) {
        modalServiceSelect.value = requestedService;
      }
      if (bookingModal) {
        bookingModal.classList.add("active");
        document.body.style.overflow = "hidden";
      }
    });
  });

  const closeModal = () => {
    if (bookingModal) {
      bookingModal.classList.remove("active");
      document.body.style.overflow = "";
    }
  };

  closeModalBtn?.addEventListener("click", closeModal);
  bookingModal?.addEventListener("click", (e) => {
    if (e.target === bookingModal) {
      closeModal();
    }
  });

  if (modalBookingForm) {
    modalBookingForm.addEventListener("submit", (e) => {
      e.preventDefault();
      closeModal();
      showToast("نوبت شما با موفقیت رزرو شد. به زودی با شما تماس می‌گیریم.");
      modalBookingForm.reset();
    });
  }

  // ==========================================================================
  // 9. Toast Notification System
  // ==========================================================================
  const toast = document.getElementById("toast-notification");
  const toastMessage = document.getElementById("toast-message");
  let toastTimeout;

  const showToast = (message) => {
    if (!toast || !toastMessage) return;
    toastMessage.textContent = message;
    toast.classList.add("active");

    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.remove("active");
    }, 4000);
  };

  // ==========================================================================
  // 10. Scroll Reveal Animations (Intersection Observer)
  // ==========================================================================
  const revealElements = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px",
      },
    );

    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    revealElements.forEach((el) => el.classList.add("visible"));
  }

  // ==========================================================================
  // 11. Hero Section 3-Image Luxury Slider Controller
  // ==========================================================================
  const heroSlider = document.getElementById("hero-slider");
  if (heroSlider) {
    const slides = heroSlider.querySelectorAll(".hero-slide");
    const dots = heroSlider.querySelectorAll(".slider-dot");
    const prevBtn = document.getElementById("hero-slider-prev");
    const nextBtn = document.getElementById("hero-slider-next");

    let currentSlide = 0;
    let slideInterval = null;
    const autoPlayDelay = 4500;

    const goToSlide = (index) => {
      if (index < 0) {
        currentSlide = slides.length - 1;
      } else if (index >= slides.length) {
        currentSlide = 0;
      } else {
        currentSlide = index;
      }

      slides.forEach((slide, idx) => {
        if (idx === currentSlide) {
          slide.classList.add("active");
        } else {
          slide.classList.remove("active");
        }
      });

      dots.forEach((dot, idx) => {
        if (idx === currentSlide) {
          dot.classList.add("active");
        } else {
          dot.classList.remove("active");
        }
      });
    };

    const nextSlide = () => goToSlide(currentSlide + 1);
    const prevSlide = () => goToSlide(currentSlide - 1);

    const startAutoPlay = () => {
      stopAutoPlay();
      slideInterval = setInterval(nextSlide, autoPlayDelay);
    };

    const stopAutoPlay = () => {
      if (slideInterval) {
        clearInterval(slideInterval);
        slideInterval = null;
      }
    };

    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        prevSlide();
        startAutoPlay();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        nextSlide();
        startAutoPlay();
      });
    }

    dots.forEach((dot) => {
      dot.addEventListener("click", () => {
        const index = parseInt(dot.getAttribute("data-index"), 10);
        if (!isNaN(index)) {
          goToSlide(index);
          startAutoPlay();
        }
      });
    });

    // Mobile touch swipe gesture
    let touchStartX = 0;
    let touchEndX = 0;

    heroSlider.addEventListener(
      "touchstart",
      (e) => {
        touchStartX = e.changedTouches[0].screenX;
        stopAutoPlay();
      },
      { passive: true }
    );

    heroSlider.addEventListener(
      "touchend",
      (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const swipeDistance = touchEndX - touchStartX;
        if (swipeDistance > 40) {
          prevSlide();
        } else if (swipeDistance < -40) {
          nextSlide();
        }
        startAutoPlay();
      },
      { passive: true }
    );

    // Pause auto-play on mouse hover
    heroSlider.addEventListener("mouseenter", stopAutoPlay);
    heroSlider.addEventListener("mouseleave", startAutoPlay);

    // Keyboard navigation when hero section is in view
    document.addEventListener("keydown", (e) => {
      const heroSection = document.getElementById("home");
      if (!heroSection) return;
      const rect = heroSection.getBoundingClientRect();
      const isHeroVisible = rect.top < window.innerHeight && rect.bottom > 0;
      if (!isHeroVisible) return;

      if (e.key === "ArrowLeft") {
        nextSlide();
        startAutoPlay();
      } else if (e.key === "ArrowRight") {
        prevSlide();
        startAutoPlay();
      }
    });

    goToSlide(0);
    startAutoPlay();
  }
});
