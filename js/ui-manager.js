/**
 * =============================================================================
 * МЕНЕДЖЕР ИНТЕРФЕЙСА
 * Модальные окна, контекстное меню, уведомления, переключение языков
 * =============================================================================
 */

class UIManager {
    constructor(dataLoader, cardManager) {
        this.dataLoader = dataLoader;
        this.cardManager = cardManager;
        this.currentBlockId = null;
        this.currentCardIndex = null;
        this.modalMode = null;  // 'add' или 'edit'
    }

    /**
     * Инициализация UI
     */
    init() {
        this.attachGlobalListeners();
        this.initLanguageSwitcher();
    }

    /**
     * Глобальные слушатели
     */
    attachGlobalListeners() {
        // Закрытие контекстного меню
        document.addEventListener('click', (e) => {
            const menu = document.getElementById('context-menu');
            if (menu && !menu.contains(e.target)) {
                menu.classList.add('hidden');
            }
        });

        // Закрытие модального окна
        document.getElementById('modal-close').addEventListener('click', () => {
            this.closeModal();
        });

        document.getElementById('modal-overlay').addEventListener('click', (e) => {
            if (e.target.id === 'modal-overlay') {
                this.closeModal();
            }
        });

        // Кнопки добавления карточек
        document.querySelectorAll('.danayi-add-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const blockId = e.target.getAttribute('data-block-id');
                this.openAddModal(blockId);
            });
        });
    }

    /**
     * Инициализация переключателя языков
     */
    initLanguageSwitcher() {
        const currentLang = this.dataLoader.getLanguage();
        this.updateLanguageButtons(currentLang);

        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const lang = btn.getAttribute('data-lang');
                if (btn.classList.contains('disabled')) return;
                
                if (this.dataLoader.setLanguage(lang)) {
                    this.updateLanguageButtons(lang);
                    this.refreshAllBlocks();
                }
            });
        });
    }

    /**
     * Обновление кнопок языков
     */
    updateLanguageButtons(activeLang) {
        document.querySelectorAll('.lang-btn').forEach(btn => {
            const lang = btn.getAttribute('data-lang');
            btn.classList.toggle('active', lang === activeLang);
        });
    }

    /**
     * Обновление всех блоков при смене языка
     */
    async refreshAllBlocks() {
        const blocks = document.querySelectorAll('.card-block');
        blocks.forEach(block => {
            const blockId = block.getAttribute('data-block-id');
            this.cardManager.initBlock(blockId);
        });
        
        // Обновление текстов интерфейса
        this.updateInterfaceTexts();
    }

    /**
     * Обновление текстов интерфейса
     */
    updateInterfaceTexts() {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            el.textContent = this.dataLoader.t(key);
        });

        document.querySelectorAll('.danayi-add-btn .btn-text').forEach(btn => {
            btn.textContent = this.dataLoader.t('add_card');
        });
    }

    /**
     * Показ контекстного меню
     */
    showContextMenu(e, index, blockId) {
        const menu = document.getElementById('context-menu');
        menu.innerHTML = '';
        menu.classList.remove('hidden');
        
        // Позиционирование
        const x = e.pageX;
        const y = e.pageY;
        menu.style.left = `${x}px`;
        menu.style.top = `${y}px`;

        // Предотвращение выхода за пределы экрана
        const rect = menu.getBoundingClientRect();
        if (x + rect.width > window.innerWidth) {
            menu.style.left = `${window.innerWidth - rect.width - 10}px`;
        }
        if (y + rect.height > window.innerHeight) {
            menu.style.top = `${window.innerHeight - rect.height - 10}px`;
        }

        const createItem = (text, onClick) => {
            const item = document.createElement('div');
            item.className = 'context-menu-item';
            item.textContent = text;
            item.addEventListener('click', () => {
                menu.classList.add('hidden');
                onClick();
            });
            return item;
        };

        const createSeparator = () => {
            const sep = document.createElement('div');
            sep.className = 'context-menu-separator';
            return sep;
        };

        // Пункты меню
        menu.appendChild(createItem(this.dataLoader.t('move_left'), () => {
            this.cardManager.moveCard(blockId, index, index - 1);
        }));

        menu.appendChild(createItem(this.dataLoader.t('move_right'), () => {
            this.cardManager.moveCard(blockId, index, index + 1);
        }));

        menu.appendChild(createSeparator());

        menu.appendChild(createItem(this.dataLoader.t('edit'), () => {
            this.openEditModal(blockId, index);
        }));

        menu.appendChild(createSeparator());

        // Типы карточек
        DANAYI_CONFIG.cardTypes.forEach(type => {
            menu.appendChild(createItem(type.label, () => {
                this.cardManager.changeCardType(blockId, index, type.id);
            }));
        });

        menu.appendChild(createSeparator());

        menu.appendChild(createItem(this.dataLoader.t('delete'), () => {
            this.cardManager.deleteCard(blockId, index);
        }));
    }

    /**
     * Открытие модального окна добавления
     */
    openAddModal(blockId) {
        this.currentBlockId = blockId;
        this.modalMode = 'add';
        
        const html = `
            <div class="danayi-modal-row">
                <label>${this.dataLoader.t('card_type')}</label>
                <div class="danayi-type-options">
                    ${DANAYI_CONFIG.cardTypes.map((t, i) => `
                        <button class="danayi-type-btn ${i === 0 ? 'active' : ''}" 
                                data-type="${t.id}">${t.label}</button>
                    `).join('')}
                </div>
            </div>
            <div class="danayi-modal-row">
                <label>${this.dataLoader.t('side1_label')}</label>
                <textarea class="danayi-modal-input" id="input-side1" rows="3"></textarea>
            </div>
            <div class="danayi-modal-row">
                <label>${this.dataLoader.t('side2_label')}</label>
                <textarea class="danayi-modal-input" id="input-side2" rows="3"></textarea>
            </div>
            <div class="danayi-modal-buttons">
                <button id="modal-save">${this.dataLoader.t('save')}</button>
                <button id="modal-cancel">${this.dataLoader.t('cancel')}</button>
            </div>
        `;

        document.getElementById('modal-title').textContent = this.dataLoader.t('new_card');
        document.getElementById('modal-body').innerHTML = html;
        document.getElementById('modal-overlay').classList.remove('hidden');

        this.attachModalListeners();
    }

    /**
     * Открытие модального окна редактирования
     */
    async openEditModal(blockId, index) {
        this.currentBlockId = blockId;
        this.currentCardIndex = index;
        this.modalMode = 'edit';

        const cards = await this.dataLoader.loadCards(blockId);
        const card = cards[index];

        const html = `
            <div class="danayi-modal-row">
                <label>${this.dataLoader.t('card_type')}</label>
                <div class="danayi-type-options">
                    ${DANAYI_CONFIG.cardTypes.map(t => `
                        <button class="danayi-type-btn ${card.type === t.id ? 'active' : ''}" 
                                data-type="${t.id}">${t.label}</button>
                    `).join('')}
                </div>
            </div>
            <div class="danayi-modal-row">
                <label>${this.dataLoader.t('side1_label')}</label>
                <textarea class="danayi-modal-input" id="input-side1" rows="3">${card.side1 || ''}</textarea>
            </div>
            <div class="danayi-modal-row">
                <label>${this.dataLoader.t('side2_label')}</label>
                <textarea class="danayi-modal-input" id="input-side2" rows="3">${card.side2 || ''}</textarea>
            </div>
            <div class="danayi-modal-buttons">
                <button id="modal-save">${this.dataLoader.t('save')}</button>
                <button id="modal-cancel">${this.dataLoader.t('cancel')}</button>
            </div>
        `;

        document.getElementById('modal-title').textContent = this.dataLoader.t('edit_card');
        document.getElementById('modal-body').innerHTML = html;
        document.getElementById('modal-overlay').classList.remove('hidden');

        this.attachModalListeners();
    }

    /**
     * Слушатели модального окна
     */
    attachModalListeners() {
        const overlay = document.getElementById('modal-overlay');
        const typeBtns = overlay.querySelectorAll('.danayi-type-btn');
        let selectedType = DANAYI_CONFIG.cardTypes[0].id;

        typeBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                typeBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                selectedType = btn.getAttribute('data-type');
            });
            if (btn.classList.contains('active')) {
                selectedType = btn.getAttribute('data-type');
            }
        });

        document.getElementById('modal-cancel').addEventListener('click', () => {
            this.closeModal();
        });

        document.getElementById('modal-save').addEventListener('click', () => {
            const side1 = document.getElementById('input-side1').value.trim();
            const side2 = document.getElementById('input-side2').value.trim();

            if (!side1) {
                this.showNotice(this.dataLoader.t('fill_front'));
                return;
            }

            if (this.modalMode === 'add') {
                this.cardManager.addCard(this.currentBlockId, side1, side2, selectedType);
            } else if (this.modalMode === 'edit') {
                this.cardManager.updateCard(this.currentBlockId, this.currentCardIndex, side1, side2, selectedType);
            }

            this.closeModal();
        });
    }

    /**
     * Закрытие модального окна
     */
    closeModal() {
        document.getElementById('modal-overlay').classList.add('hidden');
        this.currentBlockId = null;
        this.currentCardIndex = null;
        this.modalMode = null;
    }

    /**
     * Показ уведомления
     */
    showNotice(message) {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        container.appendChild(toast);
        
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
}
