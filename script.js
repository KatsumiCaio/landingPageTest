function toggleNav() {
    const nav = document.querySelector('nav');
    const overlay = document.getElementById('menuOverlay');
    const toggleBtn = document.getElementById('mobileToggle');
    if (!nav) return;
    const isOpen = nav.classList.toggle('nav-open');
    if (isOpen) {
        overlay.classList.add('visible');
        toggleBtn.setAttribute('aria-label', 'Fechar menu');
    } else {
        overlay.classList.remove('visible');
        toggleBtn.setAttribute('aria-label', 'Abrir menu');
    }
}
document.getElementById('menuOverlay').addEventListener('click', function () {
    toggleNav();
});

// Modal Carrossel do Portfólio
class ModalCarousel {
    constructor() {
        this.track = document.getElementById('modalCarouselTrack');
        this.slides = document.querySelectorAll('.modal-carousel-slide');
        this.prevBtn = document.getElementById('modalPrevBtn');
        this.nextBtn = document.getElementById('modalNextBtn');
        this.indicators = document.querySelectorAll('.modal-indicator');
        this.currentSlide = 0;
        this.totalSlides = this.slides.length;
        this.isTransitioning = false;
        this.modal = document.getElementById('modal');

        this.init();
    }

    init() {
        // Event listeners para botões
        this.prevBtn.addEventListener('click', () => this.prevSlide());
        this.nextBtn.addEventListener('click', () => this.nextSlide());

        // Event listeners para indicadores
        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => this.goToSlide(index));
        });

        // Touch events para mobile
        this.addTouchEvents();

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (this.modal.classList.contains('open')) {
                if (e.key === 'ArrowLeft') this.prevSlide();
                if (e.key === 'ArrowRight') this.nextSlide();
                if (e.key === 'Escape') closeModal();
            }
        });
    }

    addTouchEvents() {
        let startX = 0;
        let startY = 0;
        let distX = 0;
        let distY = 0;
        let threshold = 50;

        this.track.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        });

        this.track.addEventListener('touchmove', (e) => {
            if (!startX || !startY) return;

            distX = e.touches[0].clientX - startX;
            distY = e.touches[0].clientY - startY;

            if (Math.abs(distX) > Math.abs(distY)) {
                e.preventDefault();
            }
        });

        this.track.addEventListener('touchend', (e) => {
            if (!startX || !startY) return;

            if (Math.abs(distX) > threshold && Math.abs(distX) > Math.abs(distY)) {
                if (distX > 0) {
                    this.prevSlide();
                } else {
                    this.nextSlide();
                }
            }

            startX = 0;
            startY = 0;
            distX = 0;
            distY = 0;
        });
    }

    updateSlide() {
        const translateX = -this.currentSlide * 100;
        this.track.style.transform = `translateX(${translateX}%)`;

        // Atualizar indicadores
        this.indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === this.currentSlide);
        });
    }

    nextSlide() {
        if (this.isTransitioning) return;
        this.isTransitioning = true;

        this.currentSlide = (this.currentSlide + 1) % this.totalSlides;
        this.updateSlide();

        setTimeout(() => {
            this.isTransitioning = false;
        }, 300);
    }

    prevSlide() {
        if (this.isTransitioning) return;
        this.isTransitioning = true;

        this.currentSlide = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
        this.updateSlide();

        setTimeout(() => {
            this.isTransitioning = false;
        }, 300);
    }

    goToSlide(index) {
        if (this.isTransitioning || index === this.currentSlide) return;
        this.isTransitioning = true;

        this.currentSlide = index;
        this.updateSlide();

        setTimeout(() => {
            this.isTransitioning = false;
        }, 300);
    }

    openModal(startIndex = 0) {
        this.currentSlide = startIndex;
        this.updateSlide();
        this.modal.classList.add('open');
    }
}

// Inicializar modal carrossel
const modalCarousel = new ModalCarousel();

// Event listeners para imagens do grid
document.querySelectorAll('#gallery img').forEach(img => {
    img.addEventListener('click', () => {
        const index = parseInt(img.getAttribute('data-index'));
        modalCarousel.openModal(index);
    });
});
function closeModal() { document.getElementById('modal').classList.remove('open') }
document.getElementById('modal').addEventListener('click', (e) => { if (e.target.id === 'modal') closeModal() })

function handleBooking(e) {
    e.preventDefault();
    const f = e.target;
    // coletar dados — aqui você pode integrar com backend ou serviço de email
    const data = Object.fromEntries(new FormData(f).entries());
    // simples feedback visual
    alert('Obrigado, ' + (data.nome || '') + '! Recebemos sua solicitação e vamos responder em breve.');
    f.reset();
    return false;
}

// Fecha o menu e faz scroll suave ao clicar em um link do menu mobile
function handleNavLinkClick(e) {
    const nav = document.querySelector('nav');
    const overlay = document.getElementById('menuOverlay');
    if (window.innerWidth <= 900) {
        toggleNav(); // Fecha o menu e o overlay
        // Scroll suave para o destino
        const href = e.currentTarget.getAttribute('href');
        if (href && href.startsWith('#')) {
            const target = document.querySelector(href);
            if (target) {
                setTimeout(() => {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 180); // espera o menu fechar
            }
        }
        e.preventDefault();
    }
}
// Adiciona evento aos links do menu
Array.from(document.querySelectorAll('nav a')).forEach(link => {
    link.addEventListener('click', handleNavLinkClick);
});

// FAQ Accordion
function initFAQ() {
    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const faqId = question.getAttribute('data-faq');
            const answer = document.getElementById(`faq-${faqId}`);
            const isOpen = answer.classList.contains('open');

            // Fechar todas as outras perguntas
            document.querySelectorAll('.faq-answer.open').forEach(openAnswer => {
                if (openAnswer !== answer) {
                    openAnswer.classList.remove('open');
                    const qId = openAnswer.id.replace('faq-', '');
                    document.querySelector(`[data-faq="${qId}"]`).classList.remove('active');
                }
            });

            // Toggle da pergunta clicada
            if (!isOpen) {
                question.classList.add('active');
                answer.classList.add('open');
            } else {
                question.classList.remove('active');
                answer.classList.remove('open');
            }
        });
    });
}

// Inicializar FAQ quando a página carregar
document.addEventListener('DOMContentLoaded', initFAQ);

// Sistema de Temas
class ThemeManager {
    constructor() {
        this.themeToggle = document.getElementById('themeToggle');
        this.themeIcon = this.themeToggle.querySelector('.theme-icon');
        this.currentTheme = this.getStoredTheme() || 'dark';

        this.init();
    }

    init() {
        // Aplicar tema salvo
        this.applyTheme(this.currentTheme);

        // Event listener para o botão
        this.themeToggle.addEventListener('click', () => this.toggleTheme());

        // Detectar preferência do sistema
        this.detectSystemPreference();
    }

    getStoredTheme() {
        return localStorage.getItem('theme');
    }

    setStoredTheme(theme) {
        localStorage.setItem('theme', theme);
    }

    detectSystemPreference() {
        // Se não há tema salvo, usar preferência do sistema
        if (!this.getStoredTheme()) {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            this.currentTheme = prefersDark ? 'dark' : 'light';
            this.applyTheme(this.currentTheme);
        }
    }

    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        this.updateIcon(theme);
        this.setStoredTheme(theme);
        this.currentTheme = theme;
    }

    updateIcon(theme) {
        this.themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.applyTheme(newTheme);

        // Animação suave do botão
        this.themeToggle.style.transform = 'scale(0.9)';
        setTimeout(() => {
            this.themeToggle.style.transform = 'scale(1)';
        }, 150);
    }
}

// Inicializar gerenciador de temas
const themeManager = new ThemeManager();

// -------- Agenda --------
const AGENDA_KEY = 'agenda-items-v2';
const DIAS = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'];
let selectedDiaMobile = null;

function carregarAgenda() {
    try {
        const rawV2 = localStorage.getItem(AGENDA_KEY);
        if (rawV2) return JSON.parse(rawV2);
        // tentativa de migração a partir da versão v1 (campo 'hora')
        const rawV1 = localStorage.getItem('agenda-items-v1');
        if (!rawV1) return [];
        const v1 = JSON.parse(rawV1);
        const migrado = v1.map(it => {
            const inicio = it.hora || '10:00';
            const [hh, mm] = inicio.split(':').map(Number);
            const endH = Math.min(hh + 1, 19);
            const fim = `${String(endH).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
            return { dia: it.dia, inicio, fim, cliente: it.cliente, descricao: it.descricao };
        });
        salvarAgenda(migrado);
        return migrado;
    } catch { return []; }
}
function salvarAgenda(items) {
    localStorage.setItem(AGENDA_KEY, JSON.stringify(items));
}

function gerarExemplosSeVazio() {
    let items = carregarAgenda();
    if (items.length) return;
    items = [
        { dia: 'Segunda', inicio: '10:30', fim: '11:30', cliente: 'Ana P.', descricao: 'Avaliação — fineline' },
        { dia: 'Terça', inicio: '14:00', fim: '16:00', cliente: 'Lucas M.', descricao: 'Realismo braço — sessão 2' },
        { dia: 'Quarta', inicio: '11:15', fim: '12:15', cliente: 'Juliana', descricao: 'Minimalista — coração' },
        { dia: 'Quinta', inicio: '16:00', fim: '17:00', cliente: 'Bruno', descricao: 'Fechamento de orçamento' },
        { dia: 'Sexta', inicio: '18:00', fim: '19:00', cliente: 'Camila', descricao: 'Retoque' }
    ];
    salvarAgenda(items);
}

function hmToMinutes(hm) {
    const [h, m] = hm.split(':').map(Number);
    return h * 60 + m;
}

function renderizarAgenda() {
    const grid = document.getElementById('agendaGrid');
    if (!grid) return;
    const items = carregarAgenda();

    // Construir estrutura por dia
    const porDia = Object.fromEntries(DIAS.map(d => [d, []]));
    for (const it of items) {
        if (porDia[it.dia]) porDia[it.dia].push(it);
    }
    DIAS.forEach(d => porDia[d].sort((a, b) => (a.inicio || '').localeCompare(b.inicio || '')));

    const isMobile = window.innerWidth <= 700;
    const diasParaMostrar = isMobile && selectedDiaMobile ? [selectedDiaMobile] : DIAS;

    // Gerar HTML
    grid.innerHTML = diasParaMostrar.map(dia => {
        const slots = [];
        for (let h = 10; h <= 19; h++) {
            const hh = String(h).padStart(2, '0') + ':00';
            const slotStartMin = hmToMinutes(hh);
            const slotEndMin = hmToMinutes(String(h + 1).padStart(2, '0') + ':00');
            const covering = porDia[dia].find(it => {
                if (!it.inicio || !it.fim) return false;
                const ini = hmToMinutes(it.inicio);
                const end = hmToMinutes(it.fim);
                return slotStartMin < end && slotEndMin > ini;
            }) || null;

            let classe = '';
            let conteudo = `<div class="livre">Livre</div>`;
            if (covering) {
                const ini = hmToMinutes(covering.inicio);
                const end = hmToMinutes(covering.fim);
                const isStart = ini >= slotStartMin && ini < slotEndMin;
                const isEnd = end > slotStartMin && end <= slotEndMin;
                classe = `ocupado ${isStart ? 'start' : isEnd ? 'end' : 'middle'}`;
                if (isStart) {
                    conteudo = `<div class="sessao"><div class="cliente">${covering.cliente}</div><div class="desc">${covering.descricao || ''}</div><div class="intervalo">${covering.inicio}–${covering.fim}</div></div>`;
                } else {
                    conteudo = `<div class="sessao-cont"></div>`;
                }
            } else {
                // marca livre para conectar blocos livres visualmente
                classe = 'livre middle';
            }

            slots.push(`
                        <div class="agenda-slot ${classe}">
                            <div class="hora">${hh}</div>
                            ${conteudo}
                        </div>
                    `);
        }
        return `
                    <div class="agenda-col">
                        <div class="agenda-dia">${dia}</div>
                        ${slots.join('')}
                    </div>
                `;
    }).join('');
}

function initAgenda() {
    const diaMobileSel = document.getElementById('agendaDiaMobile');

    // Seleciona dia atual por padrão (seg-sex). Sabado/Domingo => Segunda
    const hoje = new Date();
    const dow = hoje.getDay(); // 0=Dom,1=Seg..6=Sab
    const mapDow = { 1: 'Segunda', 2: 'Terça', 3: 'Quarta', 4: 'Quinta', 5: 'Sexta' };
    selectedDiaMobile = mapDow[dow] || 'Segunda';
    if (diaMobileSel) {
        diaMobileSel.value = selectedDiaMobile;
        diaMobileSel.addEventListener('change', (e) => {
            selectedDiaMobile = e.target.value;
            renderizarAgenda();
        });
    }
    // Re-render em resize para alternar entre mobile/desktop
    window.addEventListener('resize', () => {
        renderizarAgenda();
    });
    gerarExemplosSeVazio();
    renderizarAgenda();
}

document.addEventListener('DOMContentLoaded', initAgenda);

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
        } else {
            entry.target.classList.remove('show');
        }
    });
});

const hiddenElements = document.querySelectorAll('.hidden');
hiddenElements.forEach((el) => observer.observe(el));