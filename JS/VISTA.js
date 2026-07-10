// DOMContentLoaded - Mejor manejo de eventos
document.addEventListener('DOMContentLoaded', function() {
    
    // ==================== TOGGLE SIDEBAR ====================
    const toggleBtn = document.getElementById('toggle-btn');
    const sidebar = document.getElementById('sidebar');
    
    if (toggleBtn) {
        toggleBtn.addEventListener('click', function() {
            const isSmallScreen = window.innerWidth <= 767.98;
            
            if (isSmallScreen) {
                sidebar.classList.toggle('open');
                toggleBtn.setAttribute('aria-expanded', sidebar.classList.contains('open'));
            } else {
                sidebar.classList.toggle('collapsed');
            }
        });
    }
    
    // Cerrar sidebar al hacer clic fuera
    document.addEventListener('click', function(event) {
        if (window.innerWidth <= 767.98) {
            const isClickInsideSidebar = sidebar.contains(event.target);
            const isClickOnToggleBtn = event.target === toggleBtn || toggleBtn.contains(event.target);
            
            if (!isClickInsideSidebar && !isClickOnToggleBtn) {
                sidebar.classList.remove('open');
                toggleBtn.setAttribute('aria-expanded', 'false');
            }
        }
    });

    // ==================== NAVEGACIÓN DE SECCIONES ====================
    const navButtons = document.querySelectorAll('.nav-item');
    
    navButtons.forEach(button => {
        button.addEventListener('click', function() {
            const sectionId = this.getAttribute('data-section');
            showSection(sectionId);
            
            // Cerrar sidebar en móvil después de hacer clic
            if (window.innerWidth <= 767.98) {
                sidebar.classList.remove('open');
                toggleBtn.setAttribute('aria-expanded', 'false');
            }
        });
    });

    // Botón de login
    const loginButton = document.querySelector('.login-button button');
    if (loginButton) {
        loginButton.addEventListener('click', function() {
            window.location.href = 'login.html';
        });
    }

    // Mostrar la sección de inicio por defecto
    showSection('contenedorInicio');
});

// ==================== FUNCIÓN PARA MOSTRAR SECCIONES ====================
function showSection(sectionId) {
    // Ocultar todas las secciones
    const allSections = document.querySelectorAll('.section');
    allSections.forEach(section => {
        section.classList.remove('active');
    });
    
    // Mostrar la sección seleccionada
    const selectedSection = document.getElementById(sectionId);
    if (selectedSection) {
        selectedSection.classList.add('active');
        // Scroll suave hacia la sección en móvil
        if (window.innerWidth <= 767.98) {
            selectedSection.scrollIntoView({ behavior: 'smooth' });
        }
    }
}

// ==================== FUNCIONES PARA OTRAS PÁGINAS ====================
function ConsultaCama(valor) {
    const contenedorAsignarCama = document.getElementById('contenedorAsignarCama');
    
    if (contenedorAsignarCama) {
        showSection('contenedorAsignarCama');
        
        const sanitizedValor = String(valor).trim();
        
        if (sanitizedValor === '1') {
            if (typeof entradaConsultaMedica === 'function') {
                entradaConsultaMedica();
            }
        } else {
            if (typeof entradaUrgencias === 'function') {
                entradaUrgencias();
            }
        }
    }
}

function ConfirmacionCama() {
    const confirmacionCama = document.getElementById('ConfirmacionCama');
    if (confirmacionCama) {
        showSection('ConfirmacionCama');
    }
}

// ==================== MANEJADOR DE REDIMENSIONAMIENTO ====================
let resizeTimeout;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(function() {
        const sidebar = document.getElementById('sidebar');
        
        if (window.innerWidth > 767.98) {
            sidebar.classList.remove('open');
        }
    }, 250);
});