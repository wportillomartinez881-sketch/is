/**
 * Capa de Comunicación API para NEXUS
 * Maneja las peticiones HTTP hacia el documento maestro en Google Sheets
 */
const API = {
    /**
     * Envía datos mediante POST a la Web App de Google Apps Script
     * @param {Object} payload - Objeto con los datos que se registrarán en la hoja.
     * @returns {Promise<Object>} Respuesta procesada del servidor.
     */
    async enviarDatos(payload) {
        if (!CONFIG || !CONFIG.GOOGLE_SCRIPT_URL) {
            throw new Error("La configuración de la API (CONFIG.GOOGLE_SCRIPT_URL) no está disponible.");
        }

        try {
            const respuesta = await fetch(CONFIG.GOOGLE_SCRIPT_URL, {
                method: "POST",
                // text/plain;charset=utf-8 evita bloqueos CORS pre-flight en Google Apps Script[cite: 1]
                headers: {
                    "Content-Type": "text/plain;charset=utf-8"
                },
                body: JSON.stringify(payload)
            });

            // Intentamos parsear la respuesta como JSON enviada desde Google Apps Script
            const resultado = await respuesta.json();
            return resultado;
        } catch (error) {
            console.error("Error al comunicarse con la API de Google Sheets:", error);
            throw error;
        }
    }
};
