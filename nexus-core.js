/**
 * NEXUS — Core Unificado (Motor Fiscal, Validaciones y Utilidades de Planilla)
 * Centraliza los cálculos de ISSS, AFP, Renta y las reglas de control de calidad de datos.
 */

const NexusCore = {

  // ==========================================
  // 1. MOTOR FISCAL Y DE CÁLCULOS (El Salvador)
  // ==========================================
  
  /**
   * Calcula las deducciones y el salario neto de un empleado según la ley salvadoreña.
   * @param {number} salarioBase - Salario mensual o base del empleado.
   * @returns {Object} Desglose completo (ISSS, AFP, Renta, Salario Neto).
   */
  calcularPlanillaEmpleado(salarioBase) {
    const sal = parseFloat(salarioBase) || 0;
    
    // ISSS: 3% con un tope máximo de cotización de $30.00
    const isss = Math.min(sal * 0.03, 30.00);
    
    // AFP: 7.25% sobre el salario computable
    const afp = sal * 0.0725;
    
    // Base imponible para el Impuesto Sobre la Renta (Salario - ISSS - AFP)
    const baseRenta = sal - isss - afp;
    
    let renta = 0;
    // Tramos impositivos mensuales (El Salvador)
    if (baseRenta > 472.00 && baseRenta <= 895.24) {
      renta = (baseRenta - 472.00) * 0.10 + 17.67;
    } else if (baseRenta > 895.24 && baseRenta <= 2038.10) {
      renta = (baseRenta - 895.24) * 0.20 + 60.00;
    } else if (baseRenta > 2038.10) {
      renta = (baseRenta - 2038.10) * 0.30 + 288.57;
    }

    const totalDeducciones = isss + afp + renta;
    const salarioNeto = sal - totalDeducciones;

    return {
      salarioBase: sal.toFixed(2),
      isss: isss.toFixed(2),
      afp: afp.toFixed(2),
      baseRenta: baseRenta.toFixed(2),
      renta: renta.toFixed(2),
      totalDeducciones: totalDeducciones.toFixed(2),
      salarioNeto: isNaN(salarioNeto) ? "0.00" : salarioNeto.toFixed(2),
      // Valor numérico directo para validaciones o sumatorias
      _netoNum: isNaN(salarioNeto) ? 0 : salarioNeto
    };
  },

  /**
   * Calcula el proporcional en base a los días trabajados.
   */
  calcularProporcional(salarioBase, diasTrabajados = 30, ingresosAdicionales = 0) {
    let base = parseFloat(salarioBase) || 0;
    let dias = parseFloat(diasTrabajados) || 30;
    let adicionales = parseFloat(ingresosAdicionales) || 0;

    let salarioProporcional = (base / 30) * dias;
    let salarioBruto = salarioProporcional + adicionales;
    
    return {
      salarioBruto: salarioBruto.toFixed(2),
      _brutoNum: salarioBruto
    };
  },


  // ==========================================
  // 2. MOTOR DE VALIDACIONES Y CONTROL INTERNO
  // ==========================================

  /**
   * Ejecuta reglas de control y calidad sobre los datos de la planilla antes de procesarla.
   * @param {Object} planilla - Objeto que contiene el período y un arreglo de detalles/empleados.
   * @returns {Array} Lista de resultados y alertas { tipo, resultado, mensaje, registro }.
   */
  ejecutarValidaciones(planilla) {
    const resultados = [];
    const empleados = planilla?.detalles || planilla?.empleados || [];

    if (empleados.length === 0) {
      resultados.push({
        tipo: 'Datos incompletos',
        resultado: 'Error',
        mensaje: 'La planilla no tiene empleados cargados para procesar.',
        registro: planilla?.periodo || '—',
      });
      return resultados;
    }

    const duiVistos = new Map();

    empleados.forEach((d) => {
      // Compatibilidad con diferentes estructuras de datos (Google Sheets / Local)
      const empData = d.empleado || d;
      const nombre = empData.Nombre_Completo || empData.nombre || empData.ID_Empleado || 'Empleado';
      const salario = parseFloat(empData.Salario_Base || empData.salario || 0);
      const dui = empData.DUI || empData.dui;

      // 1. Validar salario base
      if (salario <= 0) {
        resultados.push({ 
          tipo: 'Empleado sin salario', 
          resultado: 'Error', 
          mensaje: `El empleado "${nombre}" no tiene un salario base válido registrado ($0.00).`, 
          registro: nombre 
        });
      }

      // 2. Simular cálculo para verificar que el neto no sea negativo
      const calculo = this.calcularPlanillaEmpleado(salario);
      if (calculo._netoNum <= 0) {
        resultados.push({ 
          tipo: 'Error de cálculo', 
          resultado: 'Error', 
          mensaje: `El empleado "${nombre}" presenta un salario neto negativo o en $0.00 tras las deducciones de ley.`, 
          registro: nombre 
        });
      }

      // 3. Control de DUIs duplicados
      if (dui) {
        if (duiVistos.has(dui)) {
          resultados.push({ 
            tipo: 'Datos duplicados', 
            resultado: 'Error', 
            mensaje: `El número de DUI (${dui}) está duplicado entre "${nombre}" y "${duiVistos.get(dui)}".`, 
            registro: nombre 
          });
        } else {
          duiVistos.set(dui, nombre);
        }
      } else {
        resultados.push({ 
          tipo: 'Datos incompletos', 
          resultado: 'Advertencia', 
          mensaje: `El empleado "${nombre}" no tiene número de DUI registrado en el sistema.`, 
          registro: nombre 
        });
      }
    });

    // 4. Validar período
    if (!planilla?.periodo) {
      resultados.push({ 
        tipo: 'Período incorrecto', 
        resultado: 'Error', 
        mensaje: 'La estructura de la planilla no cuenta con un período fiscal asignado (Ej. 2026-08).', 
        registro: '—' 
      });
    }

    // Si pasa limpio
    if (resultados.length === 0) {
      resultados.push({ 
        tipo: 'Revisión general', 
        resultado: 'Correcto', 
        mensaje: 'Todas las validaciones normativas y de integridad se han superado con éxito.', 
        registro: planilla?.periodo || 'General' 
      });
    }

    return resultados;
  },

  /**
   * Comprueba si el listado de validaciones contiene al menos un error crítico que detenga el proceso.
   */
  tieneErroresCriticos(resultados) {
    return resultados.some((r) => r.resultado === 'Error');
  },

  /**
   * Resumen legal de apoyo para mostrar en la interfaz.
   */
  obtenerBaseLegalResumen() {
    return [
      { titulo: "Código de Trabajo - Art. 161", detalle: "Jornada ordinaria diurna máxima de 8 horas diarias y 44 semanales." },
      { titulo: "Ley del Seguro Social - Art. 29", detalle: "Cotización del 3% (trabajador) con tope máximo de $30.00 y 7.5% (patronal)." },
      { titulo: "Ley SAP - Art. 16", detalle: "Aporte laboral a AFP fijado en el 7.25% sobre el salario computable." },
      { titulo: "Código Tributario - Art. 156", detalle: "Retención de Renta aplicada conforme a tramos mensuales de Hacienda." }
    ];
  }
};
