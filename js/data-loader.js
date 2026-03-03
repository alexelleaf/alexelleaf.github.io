/**
 * =============================================================================
 * ЗАГРУЗЧИК ДАННЫХ
 * Управление загрузкой JSON файлов и localStorage
 * =============================================================================
 */

class DataLoader {
    constructor() {
        this.currentLanguage = DANAYI_CONFIG.defaultLanguage;
        this.cardsData = {};
    }

    /**
     * Установка текущего языка
     */
    setLanguage(lang) {
        if (DANAYI_CONFIG.languages[lang] && DANAYI_CONFIG.languages[lang].enabled) {
            this.currentLanguage = lang;
            localStorage.setItem('danayi_language', lang);
            return true;
        }
        return false;
    }

    /**
     * Получение текущего языка
     */
    getLanguage() {
        const stored = localStorage.getItem('danayi_language');
        if (stored && DANAYI_CONFIG.languages[stored]?.enabled) {
            return stored;
        }
        return DANAYI_CONFIG.defaultLanguage;
    }

    /**
     * Загрузка данных карточек
     * Приоритет: localStorage > JSON файл
     */
    async loadCards(blockId) {
        const storageKey = `${DANAYI_CONFIG.storageKey}_${blockId}_${this.currentLanguage}`;
        
        // Проверяем localStorage
        const stored = localStorage.getItem(storageKey);
        if (stored) {
            try {
                return JSON.parse(stored);
            } catch (e) {
                console.error('Ошибка парсинга localStorage', e);
            }
        }

        // Загружаем из JSON файла
        try {
            const langConfig = DANAYI_CONFIG.languages[this.currentLanguage];
            const response = await fetch(langConfig.dataFile);
            if (response.ok) {
                const data = await response.json();
                return data[blockId] || [];
            }
        } catch (e) {
            console.error('Ошибка загрузки JSON', e);
        }

        return [];
    }

    /**
     * Сохранение данных в localStorage
     */
    saveCards(blockId, cards) {
        const storageKey = `${DANAYI_CONFIG.storageKey}_${blockId}_${this.currentLanguage}`;
        localStorage.setItem(storageKey, JSON.stringify(cards));
    }

    /**
     * Получение перевода
     */
    t(key) {
        const translations = DANAYI_CONFIG.translations[this.currentLanguage];
        return translations[key] || DANAYI_CONFIG.translations['en'][key] || key;
    }

    /**
     * Очистка данных блока
     */
    clearBlock(blockId) {
        const storageKey = `${DANAYI_CONFIG.storageKey}_${blockId}_${this.currentLanguage}`;
        localStorage.removeItem(storageKey);
    }
}

// Глобальный экземпляр
window.dataLoader = new DataLoader();
