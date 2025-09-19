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

export function initMenu() {
    document.getElementById('mobileToggle').addEventListener('click', toggleNav);
    document.getElementById('menuOverlay').addEventListener('click', function () {
        toggleNav();
    });
    Array.from(document.querySelectorAll('nav a')).forEach(link => {
        link.addEventListener('click', handleNavLinkClick);
    });
}