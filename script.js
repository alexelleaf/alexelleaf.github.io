/* =============================================================================
SCRIPT: NOIR DOCUMENT LOGIC + THEME TOGGLE (FIXED)
============================================================================= */
document.addEventListener('DOMContentLoaded', () => {
    console.log('■ SYSTEM READY ■');

    /* ---------------------------------------------------------------------
       THEME TOGGLE - DARK DEFAULT ONLY
       --------------------------------------------------------------------- */
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    // Force dark theme on load, ignore system preference
    if (!body.classList.contains('dark-theme') && !body.classList.contains('light-theme')) {
        body.classList.add('dark-theme');
    }

    const updateToggleText = () => {
        const isLight = body.classList.contains('light-theme');
        themeToggle.textContent = isLight ? 'В ТЬМУ' : 'НА СВЕТ';
    };

    updateToggleText();

    themeToggle.addEventListener('click', () => {
        if (body.classList.contains('light-theme')) {
            body.classList.remove('light-theme');
            body.classList.add('dark-theme');
        } else {
            body.classList.remove('dark-theme');
            body.classList.add('light-theme');
        }
        updateToggleText();
    });

    /* ---------------------------------------------------------------------
       CASE FILE ACCORDION (PROFILE SECTION)
       --------------------------------------------------------------------- */
    const caseFileHeaders = document.querySelectorAll('.case-file-header');
    
    caseFileHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const file = header.parentElement;
            const isExpanded = file.classList.contains('expanded');
            
            // Close all others (optional - remove if you want multiple open)
            document.querySelectorAll('.case-file').forEach(f => {
                if (f !== file) f.classList.remove('expanded');
            });
            
            // Toggle current
            file.classList.toggle('expanded', !isExpanded);
        });
        
        // Keyboard support
        header.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                header.click();
            }
        });
    });

    /* ---------------------------------------------------------------------
       NEWSPAPER STACK INTERACTION (TRANSCRIPTS)
       --------------------------------------------------------------------- */
    const newspapers = document.querySelectorAll('.newspaper');
    
    newspapers.forEach(paper => {
        paper.addEventListener('click', (e) => {
            // Prevent toggle if clicking on interactive elements inside
            if (e.target.closest('a') || e.target.closest('.redacted')) return;
            
            const isExpanded = paper.dataset.expanded === 'true';
            
            // Close others for "stack" effect
            newspapers.forEach(p => {
                p.dataset.expanded = 'false';
            });
            
            // Toggle current
            paper.dataset.expanded = isExpanded ? 'false' : 'true';
        });
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
        '.case-file, .text-block, .section-title, .press-clipping, .work-entry, .timeline-item'
    );

    animatedElements.forEach(el => {
        observer.observe(el);
    });
});
