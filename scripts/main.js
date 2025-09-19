import { initThemeManager } from './theme.js';
import { initMenu } from './menu.js';
import { initModal } from './modal.js';
import { initFAQ } from './faq.js';
import { initForm } from './form.js';
import { initAgenda } from './agenda.js';
import { initAnimations } from './animations.js';

document.addEventListener('DOMContentLoaded', () => {
    initThemeManager();
    initMenu();
    initModal();
    initFAQ();
    initForm();
    initAgenda();
    initAnimations();
});