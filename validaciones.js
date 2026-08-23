/**
 * NEXUS — Motor de Validaciones (sección 14 del brief)
 * -------------------------------------------------------------------------
 * Ejecuta las reglas de control sobre una planilla ya calculada y produce
 * una lista de resultados { tipo, resultado, mensaje, registro }. No
 * decide por sí solo si la planilla puede "procesarse": esa decisión la
 * toma el módulo de Planilla mirando si hay resultados con Error.
 */
const Validaciones = (() => {
  function ejecutar(planilla) {
    const resultados = [];
    const empleados = planilla?.detalles || [];

    if (empleados.length === 0) {
      resultados.push({
        tipo: 'Datos incompletos',
        resultado: 'Error',
        mensaje: 'La planilla no tiene empleados cargados.',
        registro: planilla?.periodo || '—',
      });
      return resultados;
    }

    const duiVistos = new Map();

    empleados.forEach((d) => {
      const nombre = d.empleado?.Nombre || d.empleado?.nombre || d.empleado?.ID_Empleado || 'Empleado';

      if (!d.empleado?.Salario && !d.empleado?.salario) {
        resultados.push({ tipo: 'Empleado sin salario', resultado: 'Error', mensaje: `${nombre} no tiene un salario base registrado.`, registro: nombre });
      }

      if (d.totales?.salarioNeto <= 0) {
        resultados.push({ tipo: 'Error de cálculo', resultado: 'Error', mensaje: `${nombre} presenta un salario neto de $0.00 o negativo.`, registro: nombre });
      }

      const dui = d.empleado?.DUI || d.empleado?.dui;
      if (dui) {
        if (duiVistos.has(dui)) {
          resultados.push({ tipo: 'Datos duplicados', resultado: 'Error', mensaje: `El DUI ${dui} aparece en más de un empleado de esta planilla (${nombre} y ${duiVistos.get(dui)}).`, registro: nombre });
        }
        duiVistos.set(dui, nombre);
      } else {
        resultados.push({ tipo: 'Datos incompletos', resultado: 'Advertencia', mensaje: `${nombre} no tiene DUI registrado.`, registro: nombre });
      }

      const horasExtra = d.totales?.totalHorasExtra || 0;
      const valorHoraAprox = ((d.empleado?.Salario || d.empleado?.salario || 0) / 30) / 8;
      const horasEquivalentes = valorHoraAprox > 0 ? horasExtra / (valorHoraAprox * 2) : 0;
      if (horasEquivalentes > 20) {
        resultados.push({ tipo: 'Control interno', resultado: 'Advertencia', mensaje: `${nombre} supera el límite recomendado de horas extra en el período.`, registro: nombre });
      }
    });

    if (!planilla?.periodo) {
      resultados.push({ tipo: 'Período incorrecto', resultado: 'Error', mensaje: 'La planilla no tiene un período asignado.', registro: planilla?.periodo || '—' });
    }

    if (resultados.length === 0) {
      resultados.push({ tipo: 'Revisión general', resultado: 'Correcto', mensaje: 'No se detectaron problemas en la planilla.', registro: planilla?.periodo || '—' });
    }

    return resultados;
  }

  function tieneErrores(resultados) {
    return resultados.some((r) => r.resultado === 'Error');
  }

  function explicarReglas() {
    return 'Antes de procesar una planilla, NEXUS verifica salario base, salario neto, DUI duplicados, DUI faltantes, horas extra y periodo.';
  }

  return { ejecutar, tieneErrores, explicarReglas };
})();
