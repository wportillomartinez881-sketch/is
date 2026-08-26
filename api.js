const CONFIG_API = {
  API_URL: 'https://script.google.com/macros/s/AKfycbwAJgAi_S0ZulK2tZRyrG5WeQfnRjU8taWZ9brO5WOKoa1wLRNM3aIUlVsxghazNh5-/exec'
};

/**
 * Realiza peticiones POST a Google Apps Script
 */
async function ejecutarAccionAPI(accion, payload = {}) {
  try {
    const bodyData = Object.assign({ accion: accion }, payload);
    
    const response = await fetch(CONFIG_API.API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8'
      },
      body: JSON.stringify(bodyData),
      redirect: 'follow'
    });

    const data = await response.json();
    
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
    const response = await fetch(CONFIG_API.API_URL, {
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
