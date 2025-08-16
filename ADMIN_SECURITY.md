# 🔒 **CONFIGURACIÓN DE SEGURIDAD DEL PANEL ADMIN**

## ⚠️ **IMPORTANTE: CAMBIAR LA CONTRASEÑA PREDETERMINADA**

El panel de administración está protegido con una contraseña. **DEBES cambiar la contraseña predeterminada inmediatamente**.

### 📝 **Pasos para cambiar la contraseña:**

1. **Genera tu hash SHA-256:**
   - Ve a: https://emn178.github.io/online-tools/sha256.html
   - Escribe tu contraseña deseada (usa una contraseña fuerte)
   - Copia el hash SHA-256 generado

2. **Actualiza el código:**
   - Abre `admin/index.html`
   - Busca la línea que dice: `passwordHash: 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3'`
   - Reemplaza el hash con el que generaste

3. **Guarda y sube los cambios**

### 🛡️ **Configuración de Seguridad Actual:**

- ✅ **Panel protegido con contraseña**
- ✅ **Sesiones con expiración (2 horas)**  
- ✅ **No hay enlaces públicos al panel admin**
- ✅ **Verificación automática de sesión**
- ✅ **Logout manual disponible**

### 🚪 **Cómo Acceder al Panel Admin:**

**URL Directa:** `tu-dominio.com/admin/index.html`

**Ejemplo:** 
- `https://terapialiberal.github.io/admin/index.html`
- `https://tu-dominio.com/admin/index.html`

### 🔐 **Contraseña Predeterminada (CAMBIAR INMEDIATAMENTE):**

**Contraseña actual:** `hello`
**Hash actual:** `a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3`

**⚠️ ESTA ES UNA CONTRASEÑA TEMPORAL - DEBES CAMBIARLA**

### 💡 **Recomendaciones de Contraseña Fuerte:**

- Mínimo 12 caracteres
- Combina mayúsculas, minúsculas, números y símbolos  
- Evita palabras del diccionario
- No uses información personal

**Ejemplos de contraseñas fuertes:**
- `TL2025$Secure!Admin`
- `Geopolitica#2025@Strong`
- `Liberal$Analysis2025!`

### 🕒 **Configuración de Sesión:**

- **Duración:** 2 horas por sesión
- **Verificación:** Cada 5 minutos
- **Auto-logout:** Cuando la sesión expira
- **Almacenamiento:** Local (no se comparte entre navegadores)

### 🚨 **En caso de problemas:**

1. **¿Olvidaste la contraseña?**
   - Genera un nuevo hash SHA-256
   - Actualiza el código en `admin/index.html`

2. **¿No funciona el panel?**
   - Verifica que JavaScript esté habilitado
   - Revisa la consola del navegador (F12)

3. **¿Sesión expirada constantemente?**
   - Puedes aumentar el tiempo en la línea:
   - `sessionDuration: 2 * 60 * 60 * 1000` (2 horas en milisegundos)

### 🔒 **Medidas de Seguridad Adicionales Recomendadas:**

1. **Cambia la contraseña regularmente**
2. **No accedas desde computadoras públicas**
3. **Usa siempre HTTPS (no HTTP)**
4. **Cierra sesión cuando termines**
5. **No compartas la URL del panel admin públicamente**

---

## 📞 **Soporte**

Si necesitas ayuda con la configuración de seguridad:
- Revisa la consola del navegador (F12) para errores
- Verifica que el hash SHA-256 esté correctamente copiado
- Asegúrate de que no hay espacios extra en el hash

**¡LA SEGURIDAD DE TU PANEL ADMIN ES CRUCIAL!**