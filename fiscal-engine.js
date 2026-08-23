// ==========================================
// MÓDULO DE CÁLCULOS Y REPORTE GLOBAL
// ==========================================

function calcularTotalLiquido(bruto, deducciones) {
    let b = parseFloat(bruto);
    let d = parseFloat(deducciones);
    
    let totalBruto = isNaN(b) ? 0 : b;
    let totalDeducciones = isNaN(d) ? 0 : d;
    
    let resultado = totalBruto - totalDeducciones;
    return isNaN(resultado) ? "0.00" : resultado.toFixed(2);
}

function procesarCalculosPlanilla(salarioBase, diasTrabajados, ingresosAdicionales, totalDeducciones) {
    let base = parseFloat(salarioBase) || 0;
    let dias = parseFloat(diasTrabajados) || 0;
    let adicionales = parseFloat(ingresosAdicionales) || 0;
    let deducc = parseFloat(totalDeducciones) || 0;

    // Cálculo proporcional basado en días (ej. 30 días base)
    let salarioProporcional = (base / 30) * dias;
    let salarioBruto = salarioProporcional + adicionales;
    let salarioLiquido = salarioBruto - deducc;

    return {
        salarioBruto: salarioBruto.toFixed(2),
        salarioLiquido: isNaN(salarioLiquido) ? "0.00" : salarioLiquido.toFixed(2)
    };
}
