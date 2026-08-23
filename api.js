/**
 * NEXUS — Cliente de API / Conexión con Google Apps Script
 */
const API = {
  getURL() {
    if (typeof NEXUS_CONFIG !== 'undefined' && NEXUS_CONFIG.WEB_APP_URL) {
      return NEXUS_CONFIG.WEB_APP_URL;
    }
    if (typeof API_URL !== 'undefined') {
      return API_URL;
    }
    return '';
  },

  async post(datos) {
    const url = this.getURL();

    if (!url || url.includes("TU_WEB_APP_ID")) {
      console.warn("NEXUS_CONFIG.WEB_APP_URL no configurada. Operando en modo local.");
      return { status: "success", offline: true, mensaje: "Modo fuera de línea activo" };
    }

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(datos)
      });

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error de conexión con Google Sheets:", error);
      // Retornar respuesta de éxito local para permitir uso ininterrumpido
      return { 
        status: "success", 
        offline: true, 
        mensaje: "Conexión local activa." 
      };
    }
  },

  async get(accion) {
    const url = this.getURL();
    if (!url) return { status: "offline", datos: [] };

    try {
      const paramName = (typeof NEXUS_CONFIG !== 'undefined' && NEXUS_CONFIG.PARAM_GET) ? NEXUS_CONFIG.PARAM_GET : 'accion';
      const response = await fetch(`${url}?${paramName}=${accion}`);
      return await response.json();
    } catch (error) {
      console.error("Error al obtener datos:", error);
      return { status: "offline", datos: [] };
    }
  }
};
