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

function closeModal() { document.getElementById('modal').classList.remove('open') }

export function initModal() {
    const modalCarousel = new ModalCarousel();

    document.querySelectorAll('#gallery img').forEach(img => {
        img.addEventListener('click', () => {
            const index = parseInt(img.getAttribute('data-index'));
            modalCarousel.openModal(index);
        });
    });
    document.getElementById('modal').addEventListener('click', (e) => { if (e.target.id === 'modal') closeModal() });
    document.querySelector('.modal .close').addEventListener('click', closeModal);
}