/* =============================================================================
   SCRIPT: TYPEWRITER DOCUMENT LOGIC
   ============================================================================= */

document.addEventListener('DOMContentLoaded', () => {
    console.log('■ SYSTEM READY ■');

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
