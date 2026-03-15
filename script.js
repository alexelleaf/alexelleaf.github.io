/* =============================================================================
SCRIPT: THEME TOGGLE + MOBILE PROJECTS LIST + MODAL
============================================================================= */
document.addEventListener('DOMContentLoaded', function () {
    console.log('SYSTEM READY: PORTFOLIO MODE');

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
        themeToggle.addEventListener('click', function () {
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

    // Генерация мобильного списка проектов
    function generateMobileProjectsList() {
        var caseCards = document.querySelectorAll('.case-card');
        var mobileList = document.getElementById('mobile-projects-list');

        if (!mobileList || caseCards.length === 0) return;

        mobileList.innerHTML = '';

        caseCards.forEach(function (card) {
            var projectName = card.getAttribute('data-project') || 'БЕЗ НАЗВАНИЯ';
            var projectDate = card.getAttribute('data-date') || '';
            var projectStatus = card.getAttribute('data-status') || '';

            var item = document.createElement('div');
            item.className = 'mobile-project-item';
            item.innerHTML =
                '<div class="mobile-project-name">' + projectName + '</div>' +
                '<div class="mobile-project-meta">' +
                '<div class="mobile-project-date">' + projectDate + '</div>' +
                '<div class="mobile-project-status">' + projectStatus + '</div>' +
                '</div>';

            mobileList.appendChild(item);
        });
    }

    generateMobileProjectsList();

    // Observer для анимации
    var observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -20px 0px'
    };

    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    var sections = document.querySelectorAll('.content-section');
    sections.forEach(function (section) {
        observer.observe(section);
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

document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
        closeContactModal();
    }
});

var contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();
        alert('ЗАПРОС ПРИНЯТ. КОНТАКТ БУДЕТ УСТАНОВЛЕН В БЛИЖАЙШЕЕ ВРЕМЯ.');
        closeContactModal();
    });

    /* =============================================================================
    SCRIPT: THEME TOGGLE + MOBILE PROJECTS LIST + MODAL + IMAGE CLONING
    ============================================================================= */
    document.addEventListener('DOMContentLoaded', function () {
        // ... существующий код темы ...

        // Клонирование изображения для мобильной версии
        var desktopImageContainer = document.querySelector('.about-image');
        var mobileImageContainer = document.querySelector('.about-image-mobile');

        if (desktopImageContainer && mobileImageContainer) {
            mobileImageContainer.innerHTML = desktopImageContainer.innerHTML;
        }

    
    });

    document.querySelector('.resume-btn').addEventListener('click', function() {
    window.open('ТАН.pdf', '_blank', 'noopener,noreferrer');
});
}
