/* =============================================================================
   SCRIPT: TYPEWRITER DOCUMENT LOGIC + THEME TOGGLE
   ============================================================================= */

document.addEventListener('DOMContentLoaded', () => {
    console.log('■ SYSTEM READY ■');

    /* ---------------------------------------------------------------------
       THEME TOGGLE FUNCTIONALITY
       --------------------------------------------------------------------- */
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    // Check for saved theme preference or default to system preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;

    // Apply saved theme or system preference
    if (savedTheme === 'light') {
        body.classList.add('light-theme');
        body.classList.remove('dark-theme');
    } else if (savedTheme === 'dark') {
        body.classList.add('dark-theme');
        body.classList.remove('light-theme');
    }

    // Update toggle button text based on current theme
    const updateToggleText = () => {
        const isLight = body.classList.contains('light-theme') || 
                       (!body.classList.contains('dark-theme') && systemPrefersLight);
        themeToggle.textContent = isLight ? 'go to dark' : 'go to light';
    };

    // Initialize toggle text
    updateToggleText();

    // Toggle theme on click
    themeToggle.addEventListener('click', () => {
        if (body.classList.contains('light-theme')) {
            body.classList.remove('light-theme');
            body.classList.add('dark-theme');
            localStorage.setItem('theme', 'dark');
        } else {
            body.classList.remove('dark-theme');
            body.classList.add('light-theme');
            localStorage.setItem('theme', 'light');
        }
        updateToggleText();
    });

    // Listen for system theme changes (if no manual override)
    window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            updateToggleText();
        }
    });

    /* ---------------------------------------------------------------------
       TYPEWRITER EFFECT FOR TITLE
       --------------------------------------------------------------------- */
    const titleElement = document.querySelector('.typewriter-target');
    if (titleElement) {
        const originalText = titleElement.textContent;
        titleElement.textContent = '';
        let charIndex = 0;

        const typeWriter = () => {
            if (charIndex < originalText.length) {
                titleElement.textContent += originalText.charAt(charIndex);
                charIndex++;
                setTimeout(typeWriter, 100);
            }
        };

        setTimeout(typeWriter, 500);
    }

    /* ---------------------------------------------------------------------
       SMOOTH SCROLL FOR ANCHORS
       --------------------------------------------------------------------- */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const target = document.querySelector(targetId);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    /* ---------------------------------------------------------------------
       SCROLL REVEAL ANIMATION
       --------------------------------------------------------------------- */
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -20px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll(
        '.text-block, .section-title, .quest-item, .work-entry, .timeline-item'
    );
    
    animatedElements.forEach(el => {
        observer.observe(el);
    });
});
