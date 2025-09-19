function validateEmail(email) {
    const re = /^(([^<>()[\\]\\.,;:\\s@\"]+(\\.[^<>()[\\]\\.,;:\\s@\"]+)*)|(\".+\"))@((\\[[0-9]{1,3}\\.`1`{1,3}\\.`1`{1,3}\\.`1`{1,3}\\])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

async function handleFormSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const feedbackEl = document.getElementById('form-feedback');
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // Validation
    if (!data.name || !data.email || !data.message) {
        feedbackEl.textContent = 'Por favor, preencha todos os campos.';
        feedbackEl.className = 'visible error';
        return;
    }

    if (!validateEmail(data.email)) {
        feedbackEl.textContent = 'Por favor, insira um email válido.';
        feedbackEl.className = 'visible error';
        return;
    }

    feedbackEl.textContent = 'Enviando...';
    feedbackEl.className = 'visible sending';

    try {
        const response = await fetch(form.action, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (result.success) {
            feedbackEl.textContent = 'Obrigado! Sua mensagem foi enviada com sucesso.';
            feedbackEl.className = 'visible success';
            form.reset();
        } else {
            throw new Error(result.message || 'Ocorreu um erro.');
        }
    } catch (error) {
        feedbackEl.textContent = 'Erro ao enviar a mensagem. Tente novamente mais tarde.';
        feedbackEl.className = 'visible error';
    } finally {
        setTimeout(() => {
            feedbackEl.className = '';
        }, 5000); // Esconde a mensagem após 5 segundos
    }
}

export function initForm() {
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
    }
}