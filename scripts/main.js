document.documentElement.classList.replace('no-js', 'js');

import { initNav, initActiveSection } from './nav.js';
import { initReveal } from './reveal.js';

initNav();
initActiveSection();
initReveal();
