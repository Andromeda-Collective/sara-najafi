document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // Navbar Scroll Effect & Mobile Menu
    // ==========================================
    const navbar = document.getElementById('navbar');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const navActions = document.querySelector('.nav-actions');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            navActions.classList.toggle('active');
        });
    }

    // ==========================================
    // Quiz State Machine Logic
    // ==========================================
    const quizSteps = document.querySelectorAll('.quiz-step');
    const nextBtns = document.querySelectorAll('.next-btn');
    const prevBtns = document.querySelectorAll('.prev-btn');
    const progressBar = document.getElementById('quiz-progress');
    
    let currentStep = 0;
    const totalSteps = quizSteps.length;
    
    // Function to update step visibility and progress
    const updateQuizState = () => {
        quizSteps.forEach((step, index) => {
            if (index === currentStep) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });
        
        // Calculate progress (excluding the lead form step which is the last one)
        // If 4 steps (3 questions + 1 lead form)
        const progressPercentage = ((currentStep + 1) / totalSteps) * 100;
        if (progressBar) {
            progressBar.style.width = `${progressPercentage}%`;
        }
    };

    // Enable Next buttons only when an option is selected
    quizSteps.forEach((step, index) => {
        const radios = step.querySelectorAll('input[type="radio"]');
        const nextBtn = step.querySelector('.next-btn');
        
        if (radios.length > 0 && nextBtn) {
            radios.forEach(radio => {
                radio.addEventListener('change', () => {
                    nextBtn.removeAttribute('disabled');
                });
            });
        }
    });

    // Next Button Listeners
    nextBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (currentStep < totalSteps - 1) {
                currentStep++;
                updateQuizState();
            }
        });
    });

    // Previous Button Listeners
    prevBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (currentStep > 0) {
                currentStep--;
                updateQuizState();
            }
        });
    });

    // Initialize first step
    updateQuizState();


    // ==========================================
    // Lead Form Submission & Results Display
    // ==========================================
    const leadForm = document.getElementById('lead-form');
    const quizSection = document.getElementById('quiz-section');
    const resultsSection = document.getElementById('results-section');
    const userNameDisplay = document.getElementById('user-name-display');

    if (leadForm) {
        leadForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get user's first name
            const firstName = document.getElementById('first-name').value;
            if (firstName && userNameDisplay) {
                userNameDisplay.textContent = firstName;
            }
            
            // Hide Quiz Section and Show Results Section
            quizSection.style.display = 'none';
            resultsSection.classList.remove('hidden');
            
            // Scroll to results smoothly
            resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            
            // Start the countdown timer
            startCountdown();
        });
    }

    // ==========================================
    // Countdown Timer (48 Hours)
    // ==========================================
    const startCountdown = () => {
        // Set time for 48 hours from now
        const now = new Date().getTime();
        const countDownDate = now + (48 * 60 * 60 * 1000);

        const timerInterval = setInterval(() => {
            const currentTime = new Date().getTime();
            const distance = countDownDate - currentTime;

            // Time calculations
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24 * 3)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            // Output the result
            const hoursEl = document.getElementById("hours");
            const minsEl = document.getElementById("minutes");
            const secsEl = document.getElementById("seconds");

            if(hoursEl && minsEl && secsEl) {
                hoursEl.textContent = hours < 10 ? '0' + hours : hours;
                minsEl.textContent = minutes < 10 ? '0' + minutes : minutes;
                secsEl.textContent = seconds < 10 ? '0' + seconds : seconds;
            }

            // If the count down is over, clear interval
            if (distance < 0) {
                clearInterval(timerInterval);
                if(hoursEl && minsEl && secsEl) {
                    hoursEl.textContent = "00";
                    minsEl.textContent = "00";
                    secsEl.textContent = "00";
                }
            }
        }, 1000);
    };

    // ==========================================
    // Scroll Animations (Intersection Observer)
    // ==========================================
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    if ('IntersectionObserver' in window) {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.15
        };
        
        const scrollObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target); // Only animate once
                }
            });
        }, observerOptions);
        
        animatedElements.forEach(el => {
            scrollObserver.observe(el);
        });
    } else {
        // Fallback for older browsers
        animatedElements.forEach(el => {
            el.classList.add('visible');
        });
    }

});
