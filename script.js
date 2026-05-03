document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

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
            setTimeout(() => { isUserInteracting = false; startLoop(); }, 8000);
        }

        currentPhase = phase;
        const cards = document.querySelectorAll('[data-phase]');
        const statusDisplay = document.getElementById('phase-status');
        const subtextDisplay = document.getElementById('phase-subtext');
        const iconContainer = document.getElementById('phase-icon-container');
        const backboneProgress = document.getElementById('backbone-progress');

        if (!statusDisplay || !subtextDisplay || !iconContainer) return;

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

    document.querySelectorAll('[data-phase]').forEach(card => {
        card.addEventListener('click', () => {
            const phase = parseInt(card.getAttribute('data-phase'));
            updatePhase(phase, true);
        });
    });

    const deliverySection = document.getElementById('how-i-work');
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

    // --- STRATEGIC FAQ ACCORDION ---
    const faqTriggers = document.querySelectorAll('.faq-trigger');
    faqTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const content = trigger.nextElementSibling;
            const icon = trigger.querySelector('i');
            
            const isHidden = content.classList.contains('hidden');
            
            document.querySelectorAll('.faq-content').forEach(c => c.classList.add('hidden'));
            document.querySelectorAll('.faq-trigger i').forEach(i => i.style.transform = 'rotate(0deg)');
            
            if (isHidden) {
                content.classList.remove('hidden');
                icon.style.transform = 'rotate(180deg)';
            }
        });
    });

    // --- GLOBAL RESOURCE GATE LOGIC ---
    const gateModal = document.getElementById('resource-gate-modal');
    const gateForm = document.getElementById('gate-form');
    const gateSuccess = document.getElementById('gate-success');
    let pendingResourcePath = '';

    window.openResourceGate = function(pdfPath) {
        pendingResourcePath = pdfPath;
        if (gateModal) {
            gateModal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        }
    };

    const closeGateBtn = document.getElementById('close-gate-modal');
    if (closeGateBtn && gateModal) {
        closeGateBtn.addEventListener('click', () => {
            gateModal.classList.add('hidden');
            document.body.style.overflow = '';
        });
    }

    if (gateForm) {
        gateForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = gateForm.querySelector('button');
            const originalText = submitBtn.innerHTML;
            
            submitBtn.innerHTML = '<span class="flex items-center justify-center gap-2"><i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i> Authorizing...</span>';
            submitBtn.disabled = true;
            if (typeof lucide !== 'undefined') lucide.createIcons();

            const formData = new FormData(gateForm);
            const data = Object.fromEntries(formData.entries());

            try {
                // --- GOOGLE APPS SCRIPT INTEGRATION ---
                // Replace the URL below with your actual Deployment URL
                const WEBHOOK_URL = 'YOUR_GOOGLE_SCRIPT_URL_HERE'; 
                
                if (WEBHOOK_URL !== 'YOUR_GOOGLE_SCRIPT_URL_HERE') {
                    await fetch(WEBHOOK_URL, {
                        method: 'POST',
                        mode: 'no-cors',
                        body: JSON.stringify(data)
                    });
                } else {
                    // Simulation for local testing
                    await new Promise(resolve => setTimeout(resolve, 1500));
                }
                
                gateForm.classList.add('hidden');
                gateSuccess.classList.remove('hidden');
                
                setTimeout(() => {
                    gateModal.classList.add('hidden');
                    document.body.style.overflow = '';
                    
                    // Open the requested PDF
                    if (pendingResourcePath) {
                        window.open(pendingResourcePath, '_blank');
                    }
                    
                    // Reset form for next time
                    setTimeout(() => {
                        gateForm.classList.remove('hidden');
                        gateSuccess.classList.add('hidden');
                        gateForm.reset();
                        submitBtn.innerHTML = originalText;
                        submitBtn.disabled = false;
                    }, 500);
                }, 2000);
            } catch (error) {
                console.error('Vault Access Error:', error);
                submitBtn.innerHTML = 'Error. Try Again.';
                submitBtn.disabled = false;
            }
        });
    }

    // --- AUDIT FORM SUBMISSION ---
    const auditForm = document.getElementById('audit-form');
    const submitBtn = document.getElementById('submit-btn');

    if (auditForm) {
        auditForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = 'Processing...';
            submitBtn.disabled = true;

            const formData = new FormData(auditForm);
            const data = Object.fromEntries(formData.entries());

            try {
                await new Promise(resolve => setTimeout(resolve, 1500));
                window.location.href = 'thank-you.html';
            } catch (error) {
                alert('System Error: Please try again.');
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
            }
        });
    }

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
    updateThemeIcons();

    // --- SYSTEMS CONCIERGE LOGIC ---
    const conciergeBtn = document.getElementById('concierge-btn');
    const conciergeMenu = document.getElementById('concierge-menu');

    if (conciergeBtn && conciergeMenu) {
        conciergeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            conciergeMenu.classList.toggle('active');
            const icon = conciergeBtn.querySelector('i');
            if (conciergeMenu.classList.contains('active')) {
                icon.setAttribute('data-lucide', 'x');
            } else {
                icon.setAttribute('data-lucide', 'message-square-more');
            }
            if (typeof lucide !== 'undefined') lucide.createIcons();
        });

        document.addEventListener('click', (e) => {
            if (!conciergeBtn.contains(e.target) && !conciergeMenu.contains(e.target)) {
                conciergeMenu.classList.remove('active');
                const icon = conciergeBtn.querySelector('i');
                icon.setAttribute('data-lucide', 'message-square-more');
                if (typeof lucide !== 'undefined') lucide.createIcons();
            }
        });
    }

    // --- NAVBAR SCROLL ACTIVATION ---
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            navbar.classList.add('navbar-scrolled');
        } else {
            navbar.classList.remove('navbar-scrolled');
        }
    }, { passive: true });
});
