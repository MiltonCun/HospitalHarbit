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
    let loginAttempts = 0;
    let lastAttemptTime = 0;

    // ==================== CREDENCIALES LOCALES (LABORATORIO) ====================
    // En producción: NUNCA guardar credenciales en el cliente
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
    async function processLogin() {
        const username = sanitizeInput(usernameField.value);
        const password = passwordField.value;
        
        // Deshabilitar botón mientras se procesa
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Cargando...';
        
        try {
            // Llamar a la función que valida según el modo
            const response = await validateCredentials(username, password);
            
            if (response.success) {
                // Limpiar intentos fallidos
                loginAttempts = 0;
                localStorage.removeItem('loginAttempts');
                localStorage.removeItem('lastAttemptTime');
                
                // Guardar información del usuario en sesión
                sessionStorage.setItem('user', username);
                sessionStorage.setItem('userRole', response.role);
                
                // Redirigir a dashboard
                window.location.href = './inicioF.html';
            } else {
                recordFailedAttempt();
                showError(response.message || 'Usuario o contraseña incorrectos');
            }
        } catch (error) {
            console.error('Error en login:', error);
            recordFailedAttempt();
            showError('Error al procesar el login. Intente nuevamente.');
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'ACCEDER';
        }
    }

    // ==================== VALIDACIÓN DE CREDENCIALES ====================
    // Esta función detecta automáticamente si usar local o API
    async function validateCredentials(username, password) {
        // Cambiar USE_LOCAL_AUTH a false cuando tengas API lista
        const USE_LOCAL_AUTH = true;
        
        if (USE_LOCAL_AUTH) {
            // MODO LOCAL (Laboratorio)
            return validateLocalCredentials(username, password);
        } else {
            // MODO API (Producción)
            return await sendCredentialsSecurely(username, password);
        }
    }

    // ==================== VALIDACIÓN LOCAL (LABORATORIO) ====================
    function validateLocalCredentials(username, password) {
        console.log('🧪 Usando autenticación LOCAL (modo laboratorio)');
        
        // Simular delay de red (mejor UX)
        return new Promise((resolve) => {
            setTimeout(() => {
                if (LOCAL_USERS[username] && LOCAL_USERS[username] === password) {
                    resolve({
                        success: true,
                        message: 'Login exitoso',
                        role: getRoleFromUsername(username)
                    });
                } else {
                    resolve({
                        success: false,
                        message: 'Usuario o contraseña incorrectos'
                    });
                }
            }, 500);
        });
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

    // ==================== ENVÍO SEGURO DE CREDENCIALES (API) ====================
    async function sendCredentialsSecurely(username, password) {
        console.log('🔐 Usando autenticación API (modo producción)');
        
        try {
            const response = await fetch('https://api.example.com/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                credentials: 'same-origin',
                body: JSON.stringify({
                    username: username,
                    password: password
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            // Guardar token JWT si la API lo devuelve
            if (data.token) {
                localStorage.setItem('authToken', data.token);
            }
            
            return data;
            
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    }

    // ==================== SANITIZACIÓN ====================
    function sanitizeInput(input) {
        const div = document.createElement('div');
        div.textContent = input;
        return div.innerHTML;
    }

    // ==================== CONTROL DE INTENTOS ====================
    function recordFailedAttempt() {
        loginAttempts++;
        lastAttemptTime = Date.now();
        localStorage.setItem('loginAttempts', loginAttempts);
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
