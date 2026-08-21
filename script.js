const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

menuToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', isOpen);
});

document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
    });
});

const quoteForm = document.getElementById('quoteForm');
const emailQuoteBtn = document.getElementById('emailQuoteBtn');
const whatsappQuoteBtn = document.getElementById('whatsappQuoteBtn');
const formStatus = document.getElementById('formStatus');

const BUSINESS_EMAIL = 'Xolaninombiba@gmail.com';
const WHATSAPP_NUMBER = '27691930812';

function getQuoteDetails() {
    return {
        name: quoteForm.name.value.trim(),
        email: quoteForm.email.value.trim(),
        model: quoteForm.model.value.trim(),
        message: quoteForm.message.value.trim()
    };
}

function validateQuote(details) {
    if (!details.name || !details.email || !details.model || !details.message) {
        formStatus.textContent = 'Please complete all the fields before sending your quote request.';
        return false;
    }
    return true;
}

emailQuoteBtn.addEventListener('click', async () => {
    const details = getQuoteDetails();
    if (!validateQuote(details)) return;

    emailQuoteBtn.disabled = true;
    whatsappQuoteBtn.disabled = true;
    formStatus.textContent = 'Sending your quote request...';

    try {
        const response = await fetch(`https://formsubmit.co/ajax/${BUSINESS_EMAIL}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                name: details.name,
                email: details.email,
                model: details.model,
                message: details.message,
                _subject: `New iPhone Repair Quote - ${details.model}`,
                _template: 'table'
            })
        });

        const result = await response.json();

        if (response.ok && result.success) {
            formStatus.textContent = `Quote sent successfully to ${BUSINESS_EMAIL}. We'll get back to you soon.`;
            quoteForm.reset();
        } else {
            throw new Error(result.message || 'Unable to send the quote.');
        }
    } catch (error) {
        console.error(error);
        formStatus.textContent = 'We could not send the email right now. Please use WhatsApp instead.';
    } finally {
        emailQuoteBtn.disabled = false;
        whatsappQuoteBtn.disabled = false;
    }
});

whatsappQuoteBtn.addEventListener('click', () => {
    const details = getQuoteDetails();
    if (!validateQuote(details)) return;

    const text = `Hi Funky Repairs!%0A%0AMy name is ${details.name}.%0AEmail: ${details.email}%0AiPhone model: ${details.model}%0A%0AProblem:%0A${details.message}%0A%0APlease can you provide me with a repair quote?`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, '_blank', 'noopener');
    formStatus.textContent = 'WhatsApp has been opened with your quote request.';
});
