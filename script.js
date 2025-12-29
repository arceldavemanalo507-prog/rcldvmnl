document.addEventListener('DOMContentLoaded', () => {
    
    // --- 0. PAGE TRANSITION (PRELOADER) ---
    const preloader = document.querySelector('.preloader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.classList.add('fade-out');
        }, 1500); 
    });

    // --- 1. CUSTOM CURSOR ---
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    const navLinks = document.querySelectorAll('.nav-link, .mobile-link'); // Added mobile links
    
    let mouse = { x: 0, y: 0 };
    let cursor = { x: 0, y: 0 };
    
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        cursorDot.style.left = `${mouse.x}px`;
        cursorDot.style.top = `${mouse.y}px`;
    });

    const speed = 0.15; 
    const animateCursor = () => {
        cursor.x += (mouse.x - cursor.x) * speed;
        cursor.y += (mouse.y - cursor.y) * speed;
        cursorOutline.style.left = `${cursor.x}px`;
        cursorOutline.style.top = `${cursor.y}px`;
        requestAnimationFrame(animateCursor);
    };
    animateCursor();

    const hoverTargets = document.querySelectorAll('.hover-target');
    hoverTargets.forEach(el => {
        el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
    });

    navLinks.forEach(link => {
        link.addEventListener('mouseenter', () => document.body.classList.add('nav-hovered'));
        link.addEventListener('mouseleave', () => document.body.classList.remove('nav-hovered'));
    });


    // --- 2. MOBILE NAVIGATION LOGIC (NEW) ---
    const hamburger = document.getElementById('hamburger-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            document.body.classList.toggle('no-scroll');
        });

        // Close menu when a link is clicked
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.classList.remove('no-scroll');
            });
        });
    }


    // --- 3. NAV COLOR & STRICT HIGHLIGHT (FIXED - INTERSECTION OBSERVER) ---
    const nav = document.getElementById('main-nav');
    
    // A. Header Background Style on Scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > window.innerHeight - 50) {
            nav.classList.add('scrolled'); 
        } else {
            nav.classList.remove('scrolled'); 
        }
    });

    // B. Strict Section Highlighting
    // We utilize IntersectionObserver to only highlight if the section is truly on screen
    const sections = document.querySelectorAll('section, footer');
    const desktopLinks = document.querySelectorAll('.desktop-menu .nav-link');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        // Threshold 0.55 means 55% of the section must be visible to trigger
        threshold: 0.55 
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // Remove active class from all links first? 
            // Better approach: When a section enters, light it up. When it leaves, dim it.
            
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                // Remove active from all
                desktopLinks.forEach(link => link.classList.remove('active'));
                // Add to current
                const activeLink = document.querySelector(`.desktop-menu .nav-link[href="#${id}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            } else {
                // Check if we need to remove active class when leaving
                // If we are leaving the view, we can check if any other is active.
                // But generally, the 'enter' event of the next section handles the switch.
                // However, if we scroll back to Hero (which might not have a link sometimes or if we are in between)
                // This logic ensures exact highlighting.
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        sectionObserver.observe(section);
    });
    
    // Extra fix: If we are at the very top, ensure hero is active (or nothing if strict)
    // Actually, the IntersectionObserver handles the top well.


    // --- 4. SCROLL ANIMATIONS ---
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
            }
        });
    }, { threshold: 0.15 });
    document.querySelectorAll('.reveal-text, .reveal-up').forEach(el => revealObserver.observe(el));


    // --- 5. FLOATING PREVIEW (GALLERY) ---
    const workSection = document.getElementById('gallery');
    const previewContainer = document.getElementById('work-preview');
    const previewImg = document.getElementById('work-preview-img');
    const projectItems = document.querySelectorAll('.project-item');

    if (workSection && previewContainer) {
        projectItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                const imgSrc = item.getAttribute('data-img');
                previewImg.src = imgSrc;
                previewContainer.classList.add('active');
            });
            item.addEventListener('mouseleave', () => {
                previewContainer.classList.remove('active');
            });
            item.addEventListener('click', () => openUniversalModal(item));
        });
        workSection.addEventListener('mousemove', (e) => {
            const x = e.clientX + 20; 
            const y = e.clientY + 20;
            previewContainer.style.transform = `translate(${x}px, ${y}px)`;
        });
    }


    // --- 6. UNIVERSAL MODAL (WITH OPEN/CLOSE ANIMATION) ---
    const universalModal = document.getElementById('universal-modal');
    const modalImg = document.getElementById('modal-img');
    const modalTitle = document.getElementById('modal-title');
    const modalDesc = document.getElementById('modal-desc');
    const closeUnivModalBtn = document.querySelector('.modal-close');
    const bentoCards = document.querySelectorAll('.bento-card');

    function openUniversalModal(element) {
        const img = element.getAttribute('data-img');
        const title = element.getAttribute('data-title') || element.querySelector('.p-name').innerText;
        const desc = element.getAttribute('data-desc');
        
        modalImg.src = img;
        modalTitle.innerText = title;
        modalDesc.innerText = desc;
        
        universalModal.classList.remove('closing');
        universalModal.classList.add('open');
        document.body.classList.add('no-scroll');
    }

    function closeUniversalModal() {
        universalModal.classList.add('closing'); // Trigger exit animation
        setTimeout(() => {
            universalModal.classList.remove('open');
            universalModal.classList.remove('closing');
            document.body.classList.remove('no-scroll');
        }, 400); // Matches CSS animation duration
    }

    bentoCards.forEach(card => card.addEventListener('click', () => openUniversalModal(card)));
    
    if (closeUnivModalBtn) {
        closeUnivModalBtn.addEventListener('click', closeUniversalModal);
    }
    if (universalModal) {
        universalModal.addEventListener('click', (e) => { 
            if(e.target === universalModal) closeUniversalModal();
        });
    }


    // --- 7. PERSONAL DETAILS MODAL (WITH INTERACTIVE ANIMATION) ---
    const detailsBtn = document.getElementById('open-personal-details');
    const closeDetailsBtn = document.getElementById('close-details');
    const detailsModal = document.getElementById('personal-details-modal');
    
    if(detailsBtn && detailsModal) {
        detailsBtn.addEventListener('click', () => {
            detailsModal.classList.remove('closing');
            detailsModal.classList.add('active');
            document.body.classList.add('no-scroll');
        });
    }
    if(closeDetailsBtn) {
        closeDetailsBtn.addEventListener('click', () => {
            detailsModal.classList.add('closing'); // Trigger exit animation
            setTimeout(() => {
                detailsModal.classList.remove('active');
                detailsModal.classList.remove('closing');
                document.body.classList.remove('no-scroll');
            }, 400); 
        });
    }


    // --- 8. TIME CLOCK ---
    function updateClock() {
        const now = new Date();
        const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const clock = document.getElementById('clock');
        if (clock) clock.innerText = timeString;
    }
    setInterval(updateClock, 1000);
    updateClock();

    // --- 9. SKILLS CLICK ANIMATION ---
    const skillCards = document.querySelectorAll('.color-card');
    skillCards.forEach(card => {
        card.addEventListener('click', () => {
            card.classList.add('skill-pop');
            setTimeout(() => {
                card.classList.remove('skill-pop');
            }, 600); 
        });
    });
    // --- 10. LOAD BENTO IMAGES (NEW) ---
    const bentoCardsBg = document.querySelectorAll('.bento-card');
    bentoCardsBg.forEach(card => {
        const img = card.getAttribute('data-img');
        const bgDiv = card.querySelector('.bento-bg');
        if (img && bgDiv) {
            bgDiv.style.backgroundImage = `url(${img})`;
            bgDiv.style.backgroundSize = 'cover';
            bgDiv.style.backgroundPosition = 'center';
        }
    });
});