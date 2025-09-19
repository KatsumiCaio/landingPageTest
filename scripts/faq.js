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

export { initFAQ };