# 🔒 GUÍA DE SEGURIDAD - HOSPITAL HARBIT

## 📋 Resumen Ejecutivo

Este documento detalla las mejoras de seguridad implementadas en el sitio web de Hospital Harbit y especifica qué falta por hacer en el backend.

---

## ✅ MEJORAS IMPLEMENTADAS EN FRONTEND

### 1. **Content Security Policy (CSP)**
Implementado en meta tags para prevenir inyecciones XSS:
```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' https://code.jquery.com https://cdn.jsdelivr.net;
               style-src 'self' https://cdn.jsdelivr.net 'unsafe-inline';
               img-src 'self' data:;">
```

### 2. **Headers de Seguridad**
- ✅ `X-Frame-Options: SAMEORIGIN` - Previene clickjacking
- ✅ `X-Content-Type-Options: nosniff` - Previene MIME sniffing
- ✅ `Referrer-Policy: strict-origin-when-cross-origin` - Controla referrer

### 3. **Validación de Formularios**
- ✅ Validación en tiempo real (blur events)
- ✅ Validación regex para usuario: `^[a-zA-Z0-9._-]+$`
- ✅ Restricción de longitud (3-50 caracteres usuario, 6-100 contraseña)
- ✅ Mensajes de error accesibles

### 4. **Rate Limiting en Cliente**
- ✅ Máximo 5 intentos fallidos
- ✅ Bloqueo de 15 minutos
- ✅ Almacenamiento en localStorage

### 5. **Sanitización de Entrada**
- ✅ Escapado de caracteres especiales
- ✅ Trim de espacios en blanco
- ✅ Validación de tipo de dato

### 6. **Accesibilidad (WCAG 2.1)**
- ✅ Aria labels en botones
- ✅ Role attributes semánticos
- ✅ Focus management
- ✅ Error messages accesibles
- ✅ Color contrast adecuado

### 7. **Mejoras de Código**
- ✅ Eliminación de jQuery (Vanilla JavaScript)
- ✅ Event listeners modernos
- ✅ Uso de `const` y `let` (no `var`)
- ✅ Arrow functions

### 8. **Responsive Design**
- ✅ Mobile-first approach
- ✅ Media queries para tablet y móvil
- ✅ Modo oscuro soportado
- ✅ Prefers-reduced-motion para accesibilidad

---

## ⚠️ CRÍTICO - LO QUE FALTA EN BACKEND

### 🔴 AUTENTICACIÓN
**NUNCA implementar así:**
```javascript
// ❌ INCORRECTO - NUNCA HACER ESTO
if (username === "admin" && password === "123456") {
    loggedIn = true; // ¡¡¡INSEGURO!!!
}
```

**SIEMPRE implementar con:**
```javascript
// ✅ CORRECTO - Usar en backend con HTTPS
const bcrypt = require('bcrypt');
const passwordHash = await bcrypt.hash(password, 12);
const isValid = await bcrypt.compare(password, storedHash);
```

### 🔴 CONTRASEÑAS
- [ ] Hash con **bcrypt** (costo mínimo 12) o **argon2**
- [ ] NUNCA almacenar en texto plano
- [ ] NUNCA enviar en URL (GET)
- [ ] NUNCA loguear contraseñas
- [ ] Usar HTTPS/TLS obligatorio

### 🔴 SESIONES & TOKENS
- [ ] JWT tokens con expiración (15-30 minutos)
- [ ] Refresh tokens para renovación (7 días)
- [ ] Almacenar en **httpOnly cookies** (no localStorage)
- [ ] CSRF tokens en formularios
- [ ] Secure flag + SameSite=Strict

### 🔴 BASE DE DATOS
- [ ] Prepared statements / Parameterized queries (previene SQL injection)
- [ ] Validación en servidor (NUNCA confiar en frontend)
- [ ] Encriptación de datos sensibles
- [ ] Logs de auditoría
- [ ] Backups encriptados

### 🔴 API REST
- [ ] Rate limiting en servidor (no solo cliente)
- [ ] Validación de Content-Type
- [ ] CORS configurado correctamente
- [ ] Input validation robusta
- [ ] Error handling genérico (no revelar info)

### 🔴 HTTPS & TLS
- [ ] Certificado SSL válido
- [ ] HSTS header (Strict-Transport-Security)
- [ ] Redirección HTTP → HTTPS
- [ ] Renovación automática de certificado

### 🔴 SEGURIDAD GENERAL
- [ ] WAF (Web Application Firewall)
- [ ] DDoS protection
- [ ] Monitoring y alertas
- [ ] Logs centralizados
- [ ] Incident response plan

---

## 🛠️ CHECKLIST DE IMPLEMENTACIÓN

### Frontend (✅ COMPLETADO)
- [x] CSP headers
- [x] Validación de formularios
- [x] Sanitización
- [x] Rate limiting (localStorage)
- [x] ARIA labels
- [x] Semantic HTML
- [x] Vanilla JS (sin jQuery)
- [x] Responsive design

### Backend (⏳ TODO)
- [ ] API REST con Node.js/Express, Django, Java, etc.
- [ ] Autenticación con JWT o Sessions
- [ ] Hash de contraseñas (bcrypt/argon2)
- [ ] Rate limiting en servidor
- [ ] CORS configuration
- [ ] SQL Injection prevention
- [ ] Error handling
- [ ] Logging

### DevOps (⏳ TODO)
- [ ] Certificado SSL/TLS
- [ ] WAF configuration
- [ ] DDoS protection
- [ ] Logs centralizados
- [ ] Monitoreo 24/7
- [ ] Backup strategy
- [ ] Disaster recovery

### Testing (⏳ TODO)
- [ ] Unit tests
- [ ] Integration tests
- [ ] Security testing (OWASP ZAP)
- [ ] Penetration testing
- [ ] Load testing

---

## 📝 EJEMPLO DE BACKEND SEGURO (Node.js/Express)

```javascript
const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();

// ==================== SEGURIDAD BÁSICA ====================
app.use(helmet()); // Headers de seguridad automáticos

// CORS - Solo desde dominio autorizado
app.use(cors({
  origin: 'https://hospitalharbit.com',
  credentials: true,
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));

// Limitar tamaño de body
app.use(express.json({ limit: '10mb' }));

// ==================== RATE LIMITING ====================
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // 5 intentos
  message: 'Demasiados intentos de login',
  standardHeaders: true,
  legacyHeaders: false
});

// ==================== ENDPOINT DE LOGIN ====================
app.post('/api/auth/login', loginLimiter, async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // 1. Validación en servidor
    if (!username || !password) {
      return res.status(400).json({ 
        error: 'Credenciales faltantes' 
      });
    }
    
    if (username.length < 3 || username.length > 50) {
      return res.status(400).json({ 
        error: 'Usuario inválido' 
      });
    }
    
    // 2. Buscar usuario en BD (con prepared statement)
    const user = await User.findOne({ username }); // ORM como Sequelize
    if (!user) {
      // Respuesta genérica - no revelar si existe usuario
      return res.status(401).json({ 
        error: 'Credenciales inválidas' 
      });
    }
    
    // 3. Verificar contraseña (bcrypt compara hash)
    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return res.status(401).json({ 
        error: 'Credenciales inválidas' 
      });
    }
    
    // 4. Generar JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        role: user.role,
        iat: Math.floor(Date.now() / 1000)
      },
      process.env.JWT_SECRET,
      { expiresIn: '30m' } // 30 minutos
    );
    
    // 5. Generar refresh token
    const refreshToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: '7d' } // 7 días
    );
    
    // 6. Guardar refresh token en BD (hash)
    user.refreshToken = await bcrypt.hash(refreshToken, 10);
    await user.save();
    
    // 7. Enviar respuesta con cookies seguras
    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: true, // HTTPS only
      sameSite: 'Strict',
      maxAge: 30 * 60 * 1000 // 30 minutos
    });
    
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'Strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 días
    });
    
    // 8. Log de auditoría
    await AuditLog.create({
      userId: user.id,
      action: 'LOGIN_SUCCESS',
      ipAddress: req.ip,
      userAgent: req.get('user-agent')
    });
    
    res.json({ 
      success: true, 
      message: 'Login exitoso',
      user: {
        id: user.id,
        username: user.username,
        role: user.role
      }
    });
    
  } catch (error) {
    console.error('Login error:', error);
    
    // Log de error (sin exponer detalles)
    await AuditLog.create({
      action: 'LOGIN_ERROR',
      error: error.message,
      ipAddress: req.ip
    });
    
    res.status(500).json({ 
      error: 'Error interno del servidor' 
    });
  }
});

// ==================== MIDDLEWARE DE AUTENTICACIÓN ====================
function authenticateToken(req, res, next) {
  const token = req.cookies.auth_token;
  
  if (!token) {
    return res.status(401).json({ error: 'No autorizado' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Token inválido' });
  }
}

// Usar en endpoints protegidos:
app.get('/api/dashboard', authenticateToken, (req, res) => {
  res.json({ message: 'Dashboard protegido', userId: req.userId });
});

// ==================== INICIA SERVIDOR ====================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor seguro en puerto ${PORT}`);
});
```

---

## 🧪 TESTING DE SEGURIDAD

### Verificar Headers
```bash
curl -I https://hospitalharbit.com
# Buscar: Content-Security-Policy, Strict-Transport-Security, X-Frame-Options
```

### OWASP ZAP Scan
```bash
docker run -t owasp/zap2docker-stable zap-baseline.py \
  -t https://hospitalharbit.com
```

### SSL Labs Test
```
https://www.ssllabs.com/ssltest/analyze.html?d=hospitalharbit.com
```

---

## 📚 Referencias Importantes

| Recurso | URL |
|---------|-----|
| OWASP Top 10 | https://owasp.org/www-project-top-ten/ |
| OWASP Cheat Sheets | https://cheatsheetseries.owasp.org/ |
| MDN Web Security | https://developer.mozilla.org/es/docs/Web/Security |
| Content Security Policy | https://developer.mozilla.org/es/docs/Web/HTTP/CSP |
| JWT Best Practices | https://tools.ietf.org/html/rfc8725 |

---

## ✍️ Notas Importantes

1. **Nunca confiar en validación frontend**: Siempre validar en servidor
2. **HTTPS es obligatorio**: Especialmente para login
3. **No guardar contraseñas en cliente**: Nunca, nunca, nunca
4. **Logs de auditoría**: Registrar todos los eventos de seguridad
5. **Testing constante**: Realizar penetration testing regularmente

---

**Última actualización:** Julio 2024  
**Versión:** 1.0  
**Responsable:** Equipo de Seguridad Hospital Harbit