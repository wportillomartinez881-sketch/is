const CONFIG = {
  API_URL: 'https://script.google.com/macros/s/AKfycbwAJgAi_S0ZulK2tZRyrG5WeQfnRjU8taWZ9brO5WOKoa1wLRNM3aIUlVsxghazNh5-/exec'
};

/**
 * Realiza peticiones POST a Google Apps Script
 */
async function ejecutarAccionAPI(accion, payload = {}) {
  try {
    // Aseguramos compatibilidad total si el frontend envía email en lugar de correo
    if (payload.email && !payload.correo) {
      payload.correo = payload.email;
    }
    
    const bodyData = Object.assign({ accion: accion }, payload);
    console.log(`Enviando a API [${accion}]:`, bodyData); // Depuración en consola F12[cite: 1]
    
    const response = await fetch(CONFIG.API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8'
      },
      body: JSON.stringify(bodyData),
      redirect: 'follow'
    });

    const textResponse = await response.text();
    console.log("Respuesta cruda del servidor:", textResponse); // Ver qué responde exactamente Google[cite: 1]

    let data;
    try {
      data = JSON.parse(textResponse);
    } catch (e) {
      throw new Error("Respuesta inválida del servidor: " + textResponse);
    }
    
    if (data.result === 'error') {
      throw new Error(data.message || 'Error en el servidor');
    }
    
    return data;
  } catch (error) {
    console.error(`Error al ejecutar acción ${accion}:`, error);
    throw error;
  }
}

/**
 * Obtiene el historial de planillas procesadas vía GET
 */
async function obtenerPlanillasAPI() {
  try {
    const response = await fetch(CONFIG.API_URL, {
      method: 'GET',
      redirect: 'follow'
    });

    const data = await response.json();

    if (data.result === 'error') {
      throw new Error(data.message || 'Error al obtener planillas');
    }

    return data.planillas || [];
  } catch (error) {
    console.error("Error al obtener planillas:", error);
    throw error;
  }
}
