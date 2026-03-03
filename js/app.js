/**
 * =============================================================================
 * ТОЧКА ВХОДА ПРИЛОЖЕНИЯ
 * Инициализация всех компонентов
 * =============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
    console.log('=== DANAYI_CARDS INITIALIZED ===');
    console.log('Style: NOIR_BRUTALISM');
    console.log('Language: ' + DANAYI_CONFIG.defaultLanguage);

    // === Инициализация компонентов ===
    const dataLoader = window.dataLoader;
    const uiManager = new UIManager(dataLoader, null);  // cardManager будет установлен ниже
    const cardManager = new CardManager(dataLoader, uiManager);
    
    // === Связывание менеджеров ===
    uiManager.cardManager = cardManager;

    // === Инициализация UI ===
    uiManager.init();

    // === Инициализация всех блоков карточек ===
    const blocks = document.querySelectorAll('.card-block');
    blocks.forEach(block => {
        const blockId = block.getAttribute('data-block-id');
        console.log(`Initializing block: ${blockId}`);
        cardManager.initBlock(blockId);
    });

    // === Глобальный доступ для отладки ===
    window.danayiApp = {
        dataLoader,
        uiManager,
        cardManager,
        config: DANAYI_CONFIG
    };

    console.log('=== READY ===');
});
