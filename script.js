/* =============================================================================
SCRIPT: THEME TOGGLE + INFO TABS + MODAL
============================================================================= */
document.addEventListener('DOMContentLoaded', function() {
    console.log('SYSTEM READY: BUREAU MODE');
    var themeToggle = document.getElementById('theme-toggle');
    var body = document.body;

    function applySmartTheme() {
        var isDesktop = window.matchMedia('(min-width: 769px)').matches;
        var now = new Date();
        var dayOfWeek = now.getDay();
        var currentHour = now.getHours();
        var currentMinutes = now.getMinutes();
        var currentTimeInMinutes = currentHour * 60 + currentMinutes;
        var workStart = 9 * 60;
        var workEnd = 18 * 60;
        var isWorkHours = currentTimeInMinutes >= workStart && currentTimeInMinutes < workEnd;
        var isWeekday = dayOfWeek >= 1 && dayOfWeek <= 5;
        
        if (isDesktop && isWeekday && isWorkHours) {
            body.classList.add('light-theme');
            body.classList.remove('dark-theme');
        } else {
            body.classList.add('dark-theme');
            body.classList.remove('light-theme');
        }
        updateToggleText();
    }

    function updateToggleText() {
        var isLight = body.classList.contains('light-theme');
        themeToggle.textContent = isLight ? 'ВО ТЬМУ' : 'НА СВЕТ';
    }

    applySmartTheme();

    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            if (body.classList.contains('light-theme')) {  
                body.classList.remove('light-theme');
                body.classList.add('dark-theme');
            } else {
                body.classList.remove('dark-theme');
                body.classList.add('light-theme');
            }
            updateToggleText();
        });
    }

    var tabButtons = document.querySelectorAll('.tab-btn');
    var textModules = document.querySelectorAll('.text-module');

    tabButtons.forEach(function(btn) {
        btn.addEventListener('click', function() {
            var targetTab = this.dataset.tab;
            
            tabButtons.forEach(function(b) {
                b.classList.remove('active');
            });
            
            textModules.forEach(function(mod) {
                mod.classList.remove('active');
            });
             
            this.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
        });
    });

    var observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -20px 0px'
    };

    var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    var animatedElements = document.querySelectorAll('.section-title, .case-card, .about-layout, .text-module');
    animatedElements.forEach(function(el) {
        el.style.opacity = '0';
        el.style.transform = 'translateY(10px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

/* =============================================================================
MODAL FUNCTIONALITY
============================================================================= */
function showContactModal() {
    var modal = document.getElementById('contactModal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeContactModal() {
    var modal = document.getElementById('contactModal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeContactModal();
    }
});

var contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Запрос принят. Контакт будет установлен в ближайшее время.');
        closeContactModal();
    });
}
