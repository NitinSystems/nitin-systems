document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // --- REMOVED FLASHLIGHT TRACKING ---

    // --- REVEAL ON SCROLL ---
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => { 
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    // --- ELITE LOOPING DELIVERY ENGINE ---
    let currentPhase = 1;
    const totalPhases = 5;
    let loopInterval = null;
    let isUserInteracting = false;

    const phaseData = {
        1: { title: 'Assessment', sub: 'Discovery', icon: 'search' },
        2: { title: 'System Design', sub: 'Structure', icon: 'pen-tool' },
        3: { title: 'Implementation', sub: 'Deployment', icon: 'settings' },
        4: { title: 'Validation', sub: 'Testing', icon: 'shield-check' },
        5: { title: 'Handover', sub: 'Management', icon: 'book-open' }
    };

    function updatePhase(phase, manual = false) {
        if (manual) {
            isUserInteracting = true;
            clearInterval(loopInterval);
            // Restart loop after 8 seconds of no interaction
            setTimeout(() => { isUserInteracting = false; startLoop(); }, 8000);
        }

        currentPhase = phase;
        const cards = document.querySelectorAll('[data-phase]');
        const statusDisplay = document.getElementById('phase-status');
        const subtextDisplay = document.getElementById('phase-subtext');
        const iconContainer = document.getElementById('phase-icon-container');
        const backboneProgress = document.getElementById('backbone-progress');

        if (!statusDisplay || !subtextDisplay || !iconContainer) return;

        // Update backbone progress
        if (backboneProgress) {
            const progress = ((phase - 1) / (totalPhases - 1)) * 100;
            backboneProgress.style.height = `${progress}%`;
        }

        cards.forEach((card) => {
            const pNum = parseInt(card.getAttribute('data-phase'));
            const desc = card.querySelector('.phase-desc');
            
            if (pNum === phase) {
                card.classList.add('active', 'opacity-100');
                card.classList.remove('opacity-40');
                if(desc) {
                    desc.classList.remove('hidden');
                    desc.style.display = 'block';
                }
            } else {
                card.classList.remove('active', 'opacity-100');
                card.classList.add('opacity-40');
                if(desc) {
                    desc.classList.add('hidden');
                    desc.style.display = 'none';
                }
            }
        });

        // Elite Transition for right side
        iconContainer.classList.add('phase-fade-exit');
        
        setTimeout(() => {
            statusDisplay.innerText = phaseData[phase].title;
            subtextDisplay.innerText = phaseData[phase].sub;
            iconContainer.innerHTML = `<i data-lucide="${phaseData[phase].icon}" class="w-16 h-16 text-blue-500"></i>`;
            if (typeof lucide !== 'undefined') lucide.createIcons();
            
            iconContainer.classList.remove('phase-fade-exit');
            iconContainer.classList.add('phase-fade-enter');
            
            setTimeout(() => {
                iconContainer.classList.remove('phase-fade-enter');
            }, 50);
        }, 300);
    }

    function startLoop() {
        if (loopInterval || isUserInteracting) return;
        loopInterval = setInterval(() => { 
            currentPhase = currentPhase >= totalPhases ? 1 : currentPhase + 1; 
            updatePhase(currentPhase); 
        }, 4000); 
    }

    // Add click listeners for manual override
    document.querySelectorAll('[data-phase]').forEach(card => {
        card.addEventListener('click', () => {
            const phase = parseInt(card.getAttribute('data-phase'));
            updatePhase(phase, true);
        });
    });

    const deliverySection = document.getElementById('delivery-section');
    if (deliverySection) {
        const deliveryObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) { 
                startLoop();
            } else { 
                clearInterval(loopInterval); 
                loopInterval = null; 
            }
        }, { threshold: 0.5 });
        deliveryObserver.observe(deliverySection);
    }

    // --- NAVBAR SCROLL EFFECT ---
    window.addEventListener('scroll', () => {
        const navbar = document.getElementById('navbar');
        if (!navbar) return;
        if (window.scrollY > 40) {
            navbar.classList.add('bg-black/80', 'backdrop-blur-2xl', 'border-white/10');
        } else {
            navbar.classList.remove('bg-black/80', 'backdrop-blur-2xl', 'border-white/10');
        }
    });

    // --- CALENDAR LOGIC ---
    // Cal.com handles the booking flow internally via the injected script in index.html.

    // --- MOBILE MENU LOGIC ---
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const closeMenuBtn = document.getElementById('close-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    if (mobileMenuBtn && closeMenuBtn && mobileMenu) {
        const toggleMenu = (show) => {
            if (show) {
                mobileMenu.classList.add('menu-open');
                document.body.style.overflow = 'hidden';
            } else {
                mobileMenu.classList.remove('menu-open');
                document.body.style.overflow = '';
            }
        };

        mobileMenuBtn.addEventListener('click', () => toggleMenu(true));
        closeMenuBtn.addEventListener('click', () => toggleMenu(false));
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => toggleMenu(false));
        });
    }

    // --- THEME TOGGLE LOGIC ---
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeToggleMobileBtn = document.getElementById('theme-toggle-mobile');
    const body = document.body;
    
    // Check local storage or system preference
    const savedTheme = localStorage.getItem('theme');
    const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
    
    // Default to dark mode unless user saved light mode
    if (savedTheme === 'light') {
        body.classList.add('light-theme');
    }

    const updateThemeIcons = () => {
        const isLight = body.classList.contains('light-theme');
        document.querySelectorAll('.sun-icon').forEach(el => el.classList.toggle('hidden', isLight));
        document.querySelectorAll('.moon-icon').forEach(el => el.classList.toggle('hidden', !isLight));
    };

    const toggleTheme = () => {
        body.classList.toggle('light-theme');
        const isLight = body.classList.contains('light-theme');
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
        updateThemeIcons();
    };

    if (themeToggleBtn) themeToggleBtn.addEventListener('click', toggleTheme);
    if (themeToggleMobileBtn) themeToggleMobileBtn.addEventListener('click', toggleTheme);
    
    // Initialize icons on load
    updateThemeIcons();

    // --- PDF MODAL LOGIC ---
    const pdfModal = document.getElementById('pdf-modal');
    const modalContainer = document.getElementById('modal-container');
    const viewChecklistBtn = document.getElementById('view-checklist-btn');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const modalOverlay = document.getElementById('modal-overlay');
    const pdfFrame = document.getElementById('pdf-frame');

    function openModal(pdfUrl) {
        if (!pdfModal || !pdfFrame) return;
        pdfFrame.src = pdfUrl;
        pdfModal.classList.remove('opacity-0', 'pointer-events-none');
        modalContainer.classList.remove('scale-95');
        modalContainer.classList.add('scale-100');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        if (!pdfModal || !pdfFrame) return;
        pdfModal.classList.add('opacity-0', 'pointer-events-none');
        modalContainer.classList.remove('scale-100');
        modalContainer.classList.add('scale-95');
        document.body.style.overflow = 'auto';
        setTimeout(() => {
            pdfFrame.src = '';
        }, 500);
    }

    if (viewChecklistBtn) {
        viewChecklistBtn.addEventListener('click', () => {
            // Restore Privacy Mode & Smoothness
            openModal('The-Lead-Engine-Checklist.pdf#toolbar=0&navpanes=0&scrollbar=0');
        });
    }

    if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
    if (modalOverlay) modalOverlay.addEventListener('click', closeModal);

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });

    // --- SYSTEMS CONCIERGE LOGIC ---
    const conciergeBtn = document.getElementById('concierge-btn');
    const conciergeMenu = document.getElementById('concierge-menu');

    if (conciergeBtn && conciergeMenu) {
        conciergeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            conciergeMenu.classList.toggle('active');
            
            // Toggle icon animation
            const icon = conciergeBtn.querySelector('i');
            if (conciergeMenu.classList.contains('active')) {
                icon.setAttribute('data-lucide', 'x');
            } else {
                icon.setAttribute('data-lucide', 'message-square-more');
            }
            if (typeof lucide !== 'undefined') lucide.createIcons();
        });

        // Close when clicking outside
        document.addEventListener('click', (e) => {
            if (!conciergeBtn.contains(e.target) && !conciergeMenu.contains(e.target)) {
                conciergeMenu.classList.remove('active');
                const icon = conciergeBtn.querySelector('i');
                icon.setAttribute('data-lucide', 'message-square-more');
                if (typeof lucide !== 'undefined') lucide.createIcons();
            }
        });
    }

    // --- TECHNICAL BENCHMARKS COUNTER LOGIC ---
    const countUp = (element) => {
        const target = parseFloat(element.getAttribute('data-target'));
        const suffix = element.getAttribute('data-suffix') || '';
        const duration = 2000; // 2 seconds
        const startTime = performance.now();
        const startValue = parseFloat(element.innerText) || 0;

        const update = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Ease out quad
            const easeProgress = progress * (2 - progress);
            
            const currentValue = startValue + (target - startValue) * easeProgress;
            
            if (target % 1 === 0) {
                element.innerText = Math.floor(currentValue) + suffix;
            } else {
                element.innerText = currentValue.toFixed(1) + suffix;
            }

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        };

        requestAnimationFrame(update);
    };

    const metricObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                countUp(entry.target);
                metricObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.metric-value').forEach(metric => {
        metricObserver.observe(metric);
    });
});
