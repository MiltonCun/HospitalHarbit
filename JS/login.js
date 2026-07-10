// ==================== VALIDACIÓN Y SEGURIDAD EN LOGIN ====================

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const usernameField = document.getElementById('username');
    const passwordField = document.getElementById('password');
    const submitBtn = document.getElementById('submitBtn');
    const errorMessage = document.getElementById('error-message');
    
    // Máximo de intentos fallidos
    const MAX_ATTEMPTS = 5;
    const LOCKOUT_TIME = 15 * 60 * 1000; // 15 minutos

    // ==================== CREDENCIALES LOCALES ====================
    const LOCAL_USERS = {
        'admin': 'admin123',
        'doctor': 'doc1234',
        'enfermera': 'enf1234',
        'paciente': 'pac1234'
    };

    // ==================== VALIDACIÓN EN TIEMPO REAL ====================
    
    usernameField.addEventListener('blur', function() {
        validateUsername();
    });

    passwordField.addEventListener('blur', function() {
        validatePassword();
    });

    // ==================== VALIDACIÓN DE USUARIO ====================
    function validateUsername() {
        const username = usernameField.value.trim();
        const usernameError = document.getElementById('username-error');
        
        // Limpiar error anterior
        usernameError.textContent = '';
        
        if (username.length === 0) {
            usernameError.textContent = 'El usuario es requerido';
            return false;
        }
        
        if (username.length < 3) {
            usernameError.textContent = 'El usuario debe tener al menos 3 caracteres';
            return false;
        }
        
        // Permitir solo alfanuméricos, guiones y puntos
        if (!/^[a-zA-Z0-9._-]+$/.test(username)) {
            usernameError.textContent = 'El usuario contiene caracteres no permitidos';
            return false;
        }
        
        return true;
    }

    // ==================== VALIDACIÓN DE CONTRASEÑA ====================
    function validatePassword() {
        const password = passwordField.value;
        const passwordError = document.getElementById('password-error');
        
        passwordError.textContent = '';
        
        if (password.length === 0) {
            passwordError.textContent = 'La contraseña es requerida';
            return false;
        }
        
        if (password.length < 6) {
            passwordError.textContent = 'La contraseña debe tener al menos 6 caracteres';
            return false;
        }
        
        return true;
    }

    // ==================== ENVÍO DEL FORMULARIO ====================
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Verificar si está bloqueado
        if (isAccountLocked()) {
            showError('Demasiados intentos fallidos. Intente más tarde.');
            submitBtn.disabled = true;
            return;
        }
        
        // Validar antes de enviar
        if (!validateUsername() || !validatePassword()) {
            showError('Por favor complete todos los campos correctamente');
            return;
        }
        
        // Procesar login
        processLogin();
    });

    // ==================== PROCESAR LOGIN ====================
    function processLogin() {
        const username = sanitizeInput(usernameField.value);
        const password = passwordField.value;
        
        // Deshabilitar botón mientras se procesa
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Cargando...';
        
        // Simular delay de red (mejor UX)
        setTimeout(() => {
            try {
                const response = validateLocalCredentials(username, password);
                
                if (response.success) {
                    // Limpiar intentos fallidos
                    localStorage.removeItem('loginAttempts');
                    localStorage.removeItem('lastAttemptTime');
                    
                    // Guardar información del usuario en sesión
                    sessionStorage.setItem('user', username);
                    sessionStorage.setItem('userRole', response.role);
                    
                    console.log('✓ Login exitoso para:', username);
                    
                    // Redirigir a dashboard
                    window.location.href = './inicioF.html';
                } else {
                    recordFailedAttempt();
                    showError(response.message || 'Usuario o contraseña incorrectos');
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = 'ACCEDER';
                }
            } catch (error) {
                console.error('Error en login:', error);
                recordFailedAttempt();
                showError('Error al procesar el login. Intente nuevamente.');
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'ACCEDER';
            }
        }, 500);
    }

    // ==================== VALIDACIÓN LOCAL ====================
    function validateLocalCredentials(username, password) {
        if (LOCAL_USERS[username] && LOCAL_USERS[username] === password) {
            return {
                success: true,
                message: 'Login exitoso',
                role: getRoleFromUsername(username)
            };
        } else {
            return {
                success: false,
                message: 'Usuario o contraseña incorrectos'
            };
        }
    }

    // ==================== OBTENER ROL DEL USUARIO ====================
    function getRoleFromUsername(username) {
        const roles = {
            'admin': 'administrador',
            'doctor': 'medico',
            'enfermera': 'enfermeria',
            'paciente': 'paciente'
        };
        return roles[username] || 'usuario';
    }

    // ==================== SANITIZACIÓN ====================
    function sanitizeInput(input) {
        const div = document.createElement('div');
        div.textContent = input;
        return div.innerHTML;
    }

    // ==================== CONTROL DE INTENTOS ====================
    function recordFailedAttempt() {
        const currentAttempts = parseInt(localStorage.getItem('loginAttempts') || '0') + 1;
        const lastAttemptTime = Date.now();
        localStorage.setItem('loginAttempts', currentAttempts);
        localStorage.setItem('lastAttemptTime', lastAttemptTime);
    }

    function isAccountLocked() {
        const storedAttempts = parseInt(localStorage.getItem('loginAttempts') || '0');
        const storedLastTime = parseInt(localStorage.getItem('lastAttemptTime') || '0');
        const currentTime = Date.now();
        
        if (currentTime - storedLastTime > LOCKOUT_TIME) {
            localStorage.removeItem('loginAttempts');
            localStorage.removeItem('lastAttemptTime');
            return false;
        }
        
        return storedAttempts >= MAX_ATTEMPTS;
    }

    // ==================== MOSTRAR ERRORES ====================
    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
        
        setTimeout(() => {
            errorMessage.style.display = 'none';
        }, 5000);
    }

    // ==================== LIMPIAR AL SALIR ====================
    window.addEventListener('beforeunload', function() {
        passwordField.value = '';
    });
});
