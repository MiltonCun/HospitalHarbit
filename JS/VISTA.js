// DOMContentLoaded - Mejor manejo de eventos
document.addEventListener('DOMContentLoaded', function() {
    
    // ==================== VERIFICAR ROL DEL USUARIO ====================
    const userRole = sessionStorage.getItem('userRole');
    const username = sessionStorage.getItem('user');
    
    console.log('🔐 Usuario:', username);
    console.log('👤 Rol:', userRole);
    
    if (!userRole) {
        console.warn('⚠️ No hay rol de usuario. Redirigiendo a login...');
        window.location.href = './login.html';
        return;
    }
    
    // ==================== CONFIGURACIÓN DE ROLES ====================
    const roleConfig = {
        'medico': {
            visibleSections: ['contenedorInicioF', 'contenedorUrgencias', 'contenedorConsulta', 'contenedorAsignarCama', 'ConfirmacionCama'],
            visibleNavItems: ['urgencias', 'consulta'],
            defaultSection: 'contenedorInicioF'
        },
        'enfermeria': {
            visibleSections: ['contenedorInicioF', 'contenedorUrgencias', 'contenedorAsignarCama', 'ConfirmacionCama'],
            visibleNavItems: ['urgencias'],
            defaultSection: 'contenedorInicioF'
        },
        'administrador': {
            visibleSections: ['contenedorInicioF', 'contenedorUrgencias', 'contenedorConsulta', 'contenedorAsignarCama', 'ConfirmacionCama', 'contenedorFarmacia'],
            visibleNavItems: ['urgencias', 'consulta', 'farmacia'],
            defaultSection: 'contenedorInicioF'
        },
        'paciente': {
            visibleSections: ['contenedorInicioF'],
            visibleNavItems: [],
            defaultSection: 'contenedorInicioF'
        }
    };
    
    // ==================== APLICAR CONTROL DE ACCESO POR ROL ====================
    const config = roleConfig[userRole];
    
    if (!config) {
        console.error('⚠️ Rol no reconocido:', userRole);
        window.location.href = './login.html';
        return;
    }
    
    // Ocultar todas las secciones inicialmente
    const allSections = document.querySelectorAll('.section');
    allSections.forEach(section => {
        section.style.display = 'none';
    });
    
    // Mostrar solo las secciones permitidas para este rol
    config.visibleSections.forEach(sectionId => {
        const section = document.getElementById(sectionId);
        if (section) {
            section.style.display = 'flex';
        }
    });
    
    // Filtrar elementos de navegación según el rol
    const allNavItems = document.querySelectorAll('.nav-item');
    allNavItems.forEach(navItem => {
        const itemId = navItem.getAttribute('id');
        if (!config.visibleNavItems.includes(itemId)) {
            navItem.style.display = 'none';
        }
    });
    
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
            const itemId = this.getAttribute('id');
            
            // Mapear ID del nav-item a sectionId
            const sectionMap = {
                'urgencias': 'contenedorUrgencias',
                'consulta': 'contenedorConsulta',
                'farmacia': 'contenedorFarmacia'
            };
            
            const sectionId = sectionMap[itemId];
            if (sectionId) {
                showSection(sectionId);
                
                // Cerrar sidebar en móvil después de hacer clic
                if (window.innerWidth <= 767.98) {
                    sidebar.classList.remove('open');
                    toggleBtn.setAttribute('aria-expanded', 'false');
                }
            }
        });
    });

    // Mostrar la sección de inicio por defecto
    showSection(config.defaultSection);
    
    // ==================== BOTÓN LOGOUT ====================
    const logoutButton = document.getElementById('logout-btn');
    if (logoutButton) {
        logoutButton.addEventListener('click', function(e) {
            e.preventDefault();
            sessionStorage.removeItem('user');
            sessionStorage.removeItem('userRole');
            window.location.href = './login.html';
        });
    }
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
