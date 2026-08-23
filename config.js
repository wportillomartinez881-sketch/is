/* Configuracion de NEXUS: actualizado con la nueva Web App de Apps Script. */
const NEXUS_CONFIG = {
  WEB_APP_URL: 'https://script.google.com/macros/s/AKfycbzoCo98Z-eYWrQfNZOGzUByhF9Y1Bcb1QqMh0akVPgwYUdWC8xIg5ZqmWGCzaD0T5SB/exec',
  SESSION_KEY: 'nexus_sesion', 
  PARAM_GET: 'accion', 
  PARAM_POST_ACTION: 'accion', 
  CACHE_TTL_MS: 60000,
  PARAM_ID_EMPRESA: 'ID_Empresa',
  GET_ENDPOINTS: { 
    EMPRESAS: 'empresas', 
    EMPLEADOS: 'empleados', 
    NOVEDADES: 'novedades', 
    PLANILLAS: 'planillas', 
    DETALLE_PLANILLA: 'detalle_planilla', 
    VALIDACIONES: 'validaciones', 
    REPORTES: 'reportes', 
    HISTORIAL: 'historial', 
    PARAMETROS: 'parametros', 
    AUDITORIA: 'auditoria', 
    FUNDAMENTO_LEGAL: 'fundamento_legal' 
  },
  POST_ACTIONS: { 
    REGISTRAR_EMPRESA: 'registrar_empresa', 
    REGISTRAR_USUARIO: 'registrar_usuario', 
    REGISTRAR_EMPRESA_USUARIO: 'registrar_empresa_usuario', 
    INICIAR_SESION: 'iniciar_sesion', 
    REGISTRAR_EMPLEADO: 'registrar_empleado', 
    REGISTRAR_NOVEDAD: 'registrar_novedad', 
    REGISTRAR_VALIDACION: 'registrar_validacion', 
    REGISTRAR_AUDITORIA: 'registrar_auditoria', 
    PREGUNTAR_IA: 'preguntar_ia' 
  },
  PENDING_ACTIONS: { 
    CALCULAR_PLANILLA: 'calcularPlanilla', 
    PROCESAR_PLANILLA: 'procesarPlanilla', 
    ACTUALIZAR_ESTADO_NOVEDAD: 'actualizarEstadoNovedad', 
    ACTUALIZAR_ESTADO_EMPLEADO: 'actualizarEstadoEmpleado', 
    GENERAR_REPORTE: 'generarReporte' 
  },
};
