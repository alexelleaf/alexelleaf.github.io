/**
 * =============================================================================
 * ТОЧКА ВХОДА ПРИЛОЖЕНИЯ
 * =============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
    console.log('=== DANAYI_CARDS INITIALIZED ===');
    console.log('Style: NOIR_BRUTALISM_MINIMAL');

    // === Инициализация темы ===
    window.themeManager.init();

    // === Инициализация компонентов ===
    const dataLoader = window.dataLoader;
    const uiManager = new UIManager(dataLoader, null);
    const cardManager = new CardManager(dataLoader, uiManager);

    // === Связывание менеджеров ===
    uiManager.cardManager = cardManager;

    // === Инициализация UI ===
    uiManager.init();

    // === Инициализация карточек ===
    cardManager.init();

    // === Глобальный доступ ===
    window.danayiApp = {
        dataLoader,
        uiManager,
        cardManager,
        themeManager,
        config: DANAYI_CONFIG
    };

    console.log('=== READY ===');
});
