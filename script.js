document.addEventListener('DOMContentLoaded', function() {
    const sections = document.querySelectorAll('.sys-section');
    const navLinks = document.querySelectorAll('.sidebar-link');
    const currentSectionTitle = document.getElementById('currentSectionTitle');
    const systemSidebar = document.getElementById('systemSidebar');
    const mobileToggleBtn = document.getElementById('mobileToggleBtn');
    const viewport = document.querySelector('.content-viewport');

    // 1. Accordion Slider Interativo no Início (se houver no hero)
    const accordionCards = document.querySelectorAll('.accordion-card');
    if (accordionCards.length > 0) {
        accordionCards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                accordionCards.forEach(c => c.classList.remove('active'));
                this.classList.add('active');
            });

            card.addEventListener('click', function() {
                accordionCards.forEach(c => c.classList.remove('active'));
                this.classList.add('active');
            });
        });

        let currentIndex = 0;
        setInterval(() => {
            if (!document.hidden) {
                accordionCards.forEach(c => c.classList.remove('active'));
                currentIndex = (currentIndex + 1) % accordionCards.length;
                accordionCards[currentIndex].classList.add('active');
            }
        }, 5000);
    }

    // Flag para evitar que o IntersectionObserver sobrescreva o clique durante o scroll manual
    let isClickScrolling = false;
    let scrollTimeout = null;

    // Função para atualizar a classe ativa no menu lateral e no breadcrumb
    function setActiveLink(id) {
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === `#${id}`) {
                link.classList.add('active');
                if (currentSectionTitle) {
                    const labelText = link.querySelector('span')?.textContent || link.textContent;
                    currentSectionTitle.textContent = labelText.trim();
                }
            } else {
                link.classList.remove('active');
            }
        });
    }

    // 2. Evento de Clique nos Links do Menu (Precisão Exata)
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href').replace('#', '');
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                e.preventDefault();
                isClickScrolling = true;

                // Destaca imediatamente o item clicado no menu
                setActiveLink(targetId);

                // Rola o container até a seção correta
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });

                // Reativa a observação automática após o fim da rolagem suave (600ms)
                clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(() => {
                    isClickScrolling = false;
                }, 600);

                // Fecha a sidebar no mobile se estiver aberta
                if (systemSidebar && systemSidebar.classList.contains('mobile-open')) {
                    systemSidebar.classList.remove('mobile-open');
                }
            }
        });
    });

    // 3. IntersectionObserver Otimizado para Rolagem Manual
    // Configurado para focar na seção visível no topo da tela (rootMargin ajustado)
    const observerOptions = {
        root: viewport,
        rootMargin: '-10% 0px -70% 0px', // Foca no topo da área visível
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        if (isClickScrolling) return; // Ignora eventos do observer durante o clique

        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                setActiveLink(id);
            }
        });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));

    // 4. Toggle do Menu Mobile
    if (mobileToggleBtn && systemSidebar) {
        mobileToggleBtn.addEventListener('click', () => {
            systemSidebar.classList.toggle('mobile-open');
        });
    }
});