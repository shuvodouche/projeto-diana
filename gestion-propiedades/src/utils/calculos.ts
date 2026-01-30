// src/utils/calculos.ts - VERSÃO CORRETA E COMPLETA
export const calcularTotalIngresos = (transacciones: any[]): number => {
  if (!transacciones || !Array.isArray(transacciones)) return 0
  return transacciones
    .filter(t => t && t.tipo === 'INGRESO')
    .reduce((sum, t) => sum + (Number(t.monto) || 0), 0)
}

export const calcularTotalGastos = (transacciones: any[]): number => {
  if (!transacciones || !Array.isArray(transacciones)) return 0
  return transacciones
    .filter(t => t && t.tipo === 'GASTO')
    .reduce((sum, t) => sum + (Number(t.monto) || 0), 0)
}

export const calcularPorcentajeOcupacion = (
  ocupaciones: any[], 
  totalPropiedades: number
): number => {
  if (!ocupaciones || !Array.isArray(ocupaciones) || totalPropiedades === 0) return 0
  
  // Filtrar apenas ocupaciones del mes y propiedad específica
  const ocupadas = ocupaciones.filter(o => 
    o && 
    o.estado === 'OCUPADA' // SOLO OCUPADAS
  ).length
  
  return Math.round((ocupadas / totalPropiedades) * 100)
}

export const calcularNetoPropietario = (
  ingresos: number,
  gastos: number,
  porcentajeComision: number
): number => {
  const comision = ingresos * (porcentajeComision / 100)
  return ingresos - gastos - comision
}

export const formatearMoneda = (monto: number): string => {
  return `Bs ${monto.toLocaleString('es-BO', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`
}

export const formatearFecha = (fecha: string): string => {
  try {
    return new Date(fecha).toLocaleDateString('es-BO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  } catch {
    return fecha
  }
}

// 🎯 NOVAS FUNÇÕES CORRETAS - ESSENCIAIS PARA DIANA

/**
 * Calcula ingresos BASEADOS EM OCUPAÇÃO (não em transações)
 * Esta é a FUNÇÃO CRÍTICA que estava faltando
 */
export const calcularIngresoPorOcupacion = (
  ocupacion: any[], 
  propiedades: any[], 
  propiedadId: string, 
  mes: string
): number => {
  if (!ocupacion || !propiedades || !propiedadId || !mes) return 0
  
  // 1. Filtrar ocupación del mes y propiedad
  const ocupacionPropiedad = ocupacion.filter(o => 
    o.fecha && 
    o.fecha.startsWith(mes) &&
    o.propiedadId === propiedadId &&
    o.estado === 'OCUPADA'
  )
  
  // 2. Encontrar la propiedad
  const propiedad = propiedades.find(p => p.id === propiedadId)
  if (!propiedad || !propiedad.precioNoche) return 0
  
  // 3. Contar días OCUPADOS (únicos)
  const diasOcupadosSet = new Set(ocupacionPropiedad.map(o => o.fecha))
  const diasOcupados = diasOcupadosSet.size
  
  // 4. Calcular ingreso BASE
  const ingresoBase = diasOcupados * Number(propiedad.precioNoche)
  
  console.log('🧮 Cálculo por ocupación:')
  console.log('  • Días ocupados (únicos):', diasOcupados)
  console.log('  • Precio/noche:', propiedad.precioNoche)
  console.log('  • Ingreso base:', ingresoBase)
  
  return ingresoBase
}

/**
 * Calcula ingresos DE TRANSAÇÕES (para comparação)
 */
export const calcularIngresoPorTransacciones = (
  transacciones: any[], 
  propiedadId: string, 
  mes: string
): number => {
  if (!transacciones || !propiedadId || !mes) return 0
  
  const ingresosTransacciones = transacciones
    .filter(t => 
      t.fecha && 
      t.fecha.startsWith(mes) &&
      t.tipo === 'INGRESO' &&
      t.propiedadId === propiedadId
    )
    .reduce((sum, t) => sum + (Number(t.monto) || 0), 0)
  
  return ingresosTransacciones
}

/**
 * Calcula DIAS OCUPADOS CORRETAMENTE (com filtros)
 */
export const calcularDiasOcupados = (
  ocupacion: any[], 
  propiedadId: string, 
  mes: string
): number => {
  if (!ocupacion || !propiedadId || !mes) return 0
  
  // Filtrar EXATAMENTE o que precisamos
  const ocupacionFiltrada = ocupacion.filter(o => 
    o.fecha && 
    o.fecha.startsWith(mes) &&
    o.propiedadId === propiedadId &&
    o.estado === 'OCUPADA'
  )
  
  // Contar dias únicos
  const diasUnicos = new Set(ocupacionFiltrada.map(o => o.fecha)).size
  
  return diasUnicos
}

/**
 * Calcula gastos totais para una propiedad (incluye compartidos)
 */
export const calcularGastosTotalesPropiedad = (
  transacciones: any[], 
  propiedadId: string, 
  mes: string, 
  totalPropiedades: number
): { gastosPropios: number, gastosCompartidos: number, total: number } => {
  if (!transacciones || !propiedadId || !mes) return { gastosPropios: 0, gastosCompartidos: 0, total: 0 }
  
  // Gastos específicos de la propiedad
  const gastosPropios = transacciones
    .filter(t => 
      t.fecha && 
      t.fecha.startsWith(mes) &&
      t.tipo === 'GASTO' &&
      t.propiedadId === propiedadId
    )
    .reduce((sum, t) => sum + (Number(t.monto) || 0), 0)
  
  // Gastos compartidos (all)
  const gastosAll = transacciones
    .filter(t => 
      t.fecha && 
      t.fecha.startsWith(mes) &&
      t.tipo === 'GASTO' &&
      t.propiedadId === 'all'
    )
    .reduce((sum, t) => sum + (Number(t.monto) || 0), 0)
  
  const gastosCompartidos = totalPropiedades > 0 ? gastosAll / totalPropiedades : 0
  const total = gastosPropios + gastosCompartidos
  
  return { gastosPropios, gastosCompartidos, total }
}

/**
 * Valida si los cálculos están correctos
 */
export const validarCalculosReporte = (
  ingresoOcupacion: number,
  ingresoTransacciones: number,
  diasOcupados: number,
  precioNoche: number
): { valido: boolean, diferencia: number, mensaje: string } => {
  const ingresoEsperado = diasOcupados * precioNoche
  const diferencia = Math.abs(ingresoTransacciones - ingresoEsperado)
  
  // Tolerancia de 1 Boliviano (por redondeos)
  const esValido = diferencia <= 1
  
  let mensaje = ''
  if (esValido) {
    mensaje = '✅ Los cálculos coinciden correctamente'
  } else {
    if (ingresoTransacciones === 0 && ingresoEsperado > 0) {
      mensaje = `⚠️ Hay ${diasOcupados} días ocupados pero no hay transacciones registradas`
    } else if (ingresoTransacciones > 0 && ingresoEsperado === 0) {
      mensaje = `⚠️ Hay transacciones registradas pero no hay días ocupados`
    } else {
      mensaje = `⚠️ Diferencia de Bs ${diferencia.toFixed(2)}. Revisar transacciones.`
    }
  }
  
  return {
    valido: esValido,
    diferencia,
    mensaje
  }
}