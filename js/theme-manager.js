/**
 * =============================================================================
 * МЕНЕДЖЕР ТЕМ
 * Переключение между светлой и тёмной темой
 * =============================================================================
 */

class ThemeManager {
    constructor() {
        this.currentTheme = DANAYI_CONFIG.defaultTheme;
    }

    init() {
        const stored = localStorage.getItem(DANAYI_CONFIG.themeStorageKey);
        if (stored) {
            this.currentTheme = stored;
        }
        this.applyTheme();
        this.attachListeners();
    }

    applyTheme() {
        document.documentElement.setAttribute('data-theme', this.currentTheme);
    }

    toggle() {
        this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        localStorage.setItem(DANAYI_CONFIG.themeStorageKey, this.currentTheme);
        this.applyTheme();
    }

    attachListeners() {
        const toggle = document.getElementById('theme-toggle');
        if (toggle) {
            toggle.addEventListener('click', () => this.toggle());
        }
    }
}

window.themeManager = new ThemeManager();
