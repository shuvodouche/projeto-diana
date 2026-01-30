// src/components/Reportes/GenerarReporte.tsx - VERSÃO ATUALIZADA COM CÁLCULOS CORRETOS
import { useState, useEffect } from 'react'
import { 
  obtenerPropiedades, 
  obtenerTransacciones, 
  obtenerOcupacion,
  obtenerPropietarios 
} from '../../utils/storage'
import { 
  calcularIngresoPorOcupacion,
  calcularIngresoPorTransacciones,
  calcularDiasOcupados,
  calcularGastosTotalesPropiedad,
  calcularNetoPropietario,
  validarCalculosReporte,
  formatearMoneda 
} from '../../utils/calculos'
import { generarPDFReporte, generarTodosReportes } from '../../utils/pdfGenerator'

function GenerarReporte() {
  const [mesReporte, setMesReporte] = useState('2026-01')
  const [propiedadSeleccionada, setPropiedadSeleccionada] = useState<string>('')
  const [propiedades, setPropiedades] = useState<any[]>([])
  const [propietarios, setPropietarios] = useState<any[]>([])
  const [reporteGenerado, setReporteGenerado] = useState(false)
  const [reporteData, setReporteData] = useState<any>(null)

  useEffect(() => {
    cargarDatos()
  }, [])

  const cargarDatos = () => {
    setPropiedades(obtenerPropiedades())
    setPropietarios(obtenerPropietarios())
  }

  const handleGenerarReporte = () => {
    if (!propiedadSeleccionada) {
      alert('Por favor seleccione una propiedad')
      return
    }

    const propiedad = propiedades.find(p => p.id === propiedadSeleccionada)
    const propietario = propietarios.find(p => p.id === propiedad.propietarioId)
    const transacciones = obtenerTransacciones()
    const ocupacion = obtenerOcupacion()
    const totalPropiedades = propiedades.length

    if (!propiedad) {
      alert('Propiedad no encontrada')
      return
    }

    console.log('🧮 INICIANDO CÁLCULO CORRECTO DEL REPORTE')
    console.log('Propiedad:', propiedad.numero)
    console.log('Mes:', mesReporte)

    // 🎯 1. CALCULAR DIAS OCUPADOS (BASE EN OCUPACIÓN)
    const diasOcupados = calcularDiasOcupados(ocupacion, propiedadSeleccionada, mesReporte)
    console.log('Días ocupados calculados:', diasOcupados)

    // 🎯 2. CALCULAR INGRESO POR OCUPACIÓN (EL CORRECTO)
    const ingresoPorOcupacion = calcularIngresoPorOcupacion(
      ocupacion, 
      propiedades, 
      propiedadSeleccionada, 
      mesReporte
    )
    
    // 🎯 3. CALCULAR INGRESO POR TRANSACCIONES (PARA COMPARAR)
    const ingresoPorTransacciones = calcularIngresoPorTransacciones(
      transacciones,
      propiedadSeleccionada,
      mesReporte
    )

    // 🎯 4. DECIDIR QUÉ INGRESO USAR
    // Prioridad: Transacciones si existen, si no, ocupación
    // 🎯 4. DEFINIR INGRESO BASE (SIEMPRE OCUPACIÓN)
const ingresoTotal = ingresoPorOcupacion
const fuenteIngreso = 'ocupación (base del sistema)'


    // 🎯 5. VALIDAR LOS CÁLCULOS
    const validacion = validarCalculosReporte(
      ingresoPorOcupacion,
      ingresoPorTransacciones,
      diasOcupados,
      propiedad.precioNoche || 0
    )

    console.log('Validación:', validacion)

    // 🎯 6. CALCULAR GASTOS
    const gastosCalculados = calcularGastosTotalesPropiedad(
      transacciones,
      propiedadSeleccionada,
      mesReporte,
      totalPropiedades
    )

    // 🎯 7. CALCULAR COMISIÓN (20%)
    const porcentajeComision = 20
    const comisionAdmin = ingresoTotal * (porcentajeComision / 100)

    // 🎯 8. CALCULAR NETO
    const netoPropietario = calcularNetoPropietario(
      ingresoTotal,
      gastosCalculados.total,
      porcentajeComision
    )

    // 🎯 9. PORCENTAJE DE OCUPACIÓN
    const diasMes = 30
    const porcentajeOcupacion = Math.round((diasOcupados / diasMes) * 100)

    // 🎯 10. AGRUPAR GASTOS PARA DETALLE
    const transaccionesGastos = transacciones.filter(t => 
      t.fecha.startsWith(mesReporte) &&
      t.tipo === 'GASTO' &&
      (t.propiedadId === propiedadSeleccionada || t.propiedadId === 'all')
    )

    const gastosPorCategoria = transaccionesGastos.reduce((acc: any, t) => {
      const monto = t.propiedadId === 'all' 
        ? t.monto / totalPropiedades 
        : t.monto
      
      if (!acc[t.categoria]) acc[t.categoria] = 0
      acc[t.categoria] += monto
      return acc
    }, {})

    const gastosDetallados = Object.entries(gastosPorCategoria).map(([categoria, monto]) => ({
      concepto: categoria,
      monto: monto as number
    }))

    // 🎯 11. PREPARAR DATOS FINALES
    const data = {
      propiedad: `APTO ${propiedad.numero} - ${propiedad.tipo}`,
      propietario: propietario?.nombre || 'No especificado',
      mes: mesReporte,
      diasOcupados: diasOcupados,
      porcentajeOcupacion: porcentajeOcupacion,
      precioNoche: propiedad.precioNoche || 0,
      ingresoTotal: ingresoTotal,
      gastos: gastosDetallados,
      totalGastos: gastosCalculados.total,
      comisionAdmin: comisionAdmin,
      netoPropietario: netoPropietario,
      
      // Datos de verificación
      _verificacion: {
        fuenteIngreso: fuenteIngreso,
        ingresoPorOcupacion: ingresoPorOcupacion,
        ingresoPorTransacciones: ingresoPorTransacciones,
        gastosPropios: gastosCalculados.gastosPropios,
        gastosCompartidos: gastosCalculados.gastosCompartidos,
        validacion: validacion,
        calculoEsperado: diasOcupados * propiedad.precioNoche
      }
    }

    // 🎯 12. MOSTRAR RESULTADO EN CONSOLA
    console.log('📊 REPORTE CALCULADO CORRECTAMENTE:')
    console.log('• Propiedad:', data.propiedad)
    console.log('• Días ocupados:', data.diasOcupados)
    console.log('• Precio/noche:', data.precioNoche)
    console.log('• Ingreso total:', data.ingresoTotal)
    console.log('• Fuente del ingreso:', data._verificacion.fuenteIngreso)
    console.log('• Gastos totales:', data.totalGastos)
    console.log('• Comisión (20%):', data.comisionAdmin)
    console.log('• Neto a pagar:', data.netoPropietario)
    console.log('• Validación:', data._verificacion.validacion.mensaje)

    setReporteData(data)
    setReporteGenerado(true)

    // 🎯 13. MOSTRAR ALERTA SI HAY DIFERENCIA
    if (!data._verificacion.validacion.valido) {
      setTimeout(() => {
        alert(`⚠️ Atención: ${data._verificacion.validacion.mensaje}\n\n` +
              `Revisar las transacciones registradas para ${data.propiedad} en ${mesReporte}`)
      }, 500)
    }
  }

  const handleEnviarReporte = () => {
    if (!reporteData) return
    
    const mensaje = `
REPORTE MENSUAL - ${reporteData.propiedad}
Mes: ${reporteData.mes}
Propietario: ${reporteData.propietario}

INGRESO TOTAL: Bs ${reporteData.ingresoTotal.toFixed(2)}
GASTOS TOTALES: Bs ${reporteData.totalGastos.toFixed(2)}
COMISIÓN ADMINISTRACIÓN: Bs ${reporteData.comisionAdmin.toFixed(2)}
NETO A PAGAR: Bs ${reporteData.netoPropietario.toFixed(2)}

Porcentaje de ocupación: ${reporteData.porcentajeOcupacion}%
Días ocupados: ${reporteData.diasOcupados} días

Este reporte fue generado automáticamente por el sistema de gestión.
    `.trim()

    alert('Reporte listo para enviar:\n\n' + mensaje)
  }

  const handleDescargarPDF = () => {
    if (!reporteData) {
      alert('No hay datos para generar el PDF')
      return
    }
    
    // Mostrar loading
    const originalText = '📥 Descargar Reporte'
    const boton = document.querySelector('[data-pdf-button]') as HTMLButtonElement
    if (boton) {
      boton.textContent = '⏳ Generando PDF...'
      boton.disabled = true
    }
    
    setTimeout(() => {
      try {
        // Remover informações de verificação antes de gerar PDF
        const datosParaPDF = { ...reporteData }
        delete datosParaPDF._verificacion
        
        const success = generarPDFReporte(datosParaPDF)
        
        if (success) {
          alert('✅ PDF generado correctamente')
        } else {
          alert('⚠️ Error al generar PDF')
        }
      } catch (error) {
        console.error('Error:', error)
        alert('❌ Error al generar PDF. Verifique la consola.')
      } finally {
        // Restaurar botón
        if (boton) {
          boton.textContent = originalText
          boton.disabled = false
        }
      }
    }, 500)
  }

  const handleGenerarTodos = () => {
    if (propiedades.length === 0) {
      alert('No hay propiedades registradas')
      return
    }

    if (!confirm(`¿Generar reporte resumen para ${propiedades.length} propiedades?\n\nSe creará un PDF profesional con el resumen general.`)) {
      return
    }

    // Mostrar loading
    const originalText = '📋 Generar Resumen'
    const boton = document.querySelector('[data-all-button]') as HTMLButtonElement
    if (boton) {
      boton.textContent = '⏳ Generando PDF...'
      boton.disabled = true
    }

    setTimeout(() => {
      try {
        const success = generarTodosReportes(propiedades, mesReporte, propietarios)
        
        if (success) {
          alert(`✅ Resumen general generado correctamente\n\n` +
                `📋 Se ha creado un PDF profesional con:\n` +
                `• Lista de todas las propiedades\n` +
                `• Información de propietarios\n` +
                `• Estados y precios\n` +
                `• Fecha de generación\n\n` +
                `Para reportes detallados con cálculos financieros, genere los reportes individuales.`)
        } else {
          alert('⚠️ Error al generar el resumen')
        }
      } catch (error) {
        console.error('Error:', error)
        alert('❌ Error inesperado al generar el resumen')
      } finally {
        // Restaurar botón
        if (boton) {
          boton.textContent = originalText
          boton.disabled = false
        }
      }
    }, 500)
  }

  return (
    <div>
      <div style={{
        marginBottom: '32px',
      }}>
        <h2 style={{
          fontSize: '24px',
          fontWeight: '600',
          color: '#2c3e50',
          marginBottom: '20px',
        }}>Reportes Mensuales</h2>
        <div style={{
          display: 'flex',
          gap: '12px',
          alignItems: 'center',
          flexWrap: 'wrap',
        }}>
          <select
            value={mesReporte}
            onChange={(e) => setMesReporte(e.target.value)}
            style={{
              padding: '10px 16px',
              border: '1px solid #dee2e6',
              borderRadius: '6px',
              backgroundColor: 'white',
              fontSize: '14px',
              minWidth: '160px',
            }}
          >
            <option value="2026-01">Enero 2026</option>
            <option value="2025-12">Diciembre 2025</option>
            <option value="2025-11">Noviembre 2025</option>
            <option value="2025-10">Octubre 2025</option>
          </select>
          
          <select
            value={propiedadSeleccionada}
            onChange={(e) => setPropiedadSeleccionada(e.target.value)}
            style={{
              padding: '10px 16px',
              border: '1px solid #dee2e6',
              borderRadius: '6px',
              backgroundColor: 'white',
              fontSize: '14px',
              minWidth: '300px',
              flex: 1,
            }}
          >
            <option value="">Seleccionar propiedad</option>
            {propiedades.map(prop => (
              <option key={prop.id} value={prop.id}>
                APTO {prop.numero} - {prop.tipo}
              </option>
            ))}
          </select>

          <button
            style={{
              backgroundColor: '#4dabf7',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
            }}
            onClick={handleGenerarReporte}
            disabled={!propiedadSeleccionada}
          >
            📊 Generar Reporte
          </button>

          <button
            style={{
              backgroundColor: '#40c057',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
            }}
            onClick={handleGenerarTodos}
            data-all-button="true"
          >
            📋 Generar Resumen ({propiedades.length})
          </button>
        </div>
      </div>

      {/* Vista previa del PDF */}
      {!reporteGenerado && (
        <div style={{
          marginTop: '20px',
          padding: '15px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          borderLeft: '4px solid #4dabf7'
        }}>
          <h4 style={{ margin: '0 0 10px 0', color: '#2c3e50' }}>🎨 Vista Previa del PDF</h4>
          <p style={{ fontSize: '12px', color: '#666', marginBottom: '10px' }}>
            Así se verá el PDF generado (diseño profesional):
          </p>
          
          <div style={{
            backgroundColor: 'white',
            padding: '15px',
            borderRadius: '6px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            fontSize: '12px',
            lineHeight: '1.4'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '10px' }}>
              <strong style={{ fontSize: '14px', color: '#2c3e50' }}>REPORTE MENSUAL</strong>
              <div style={{ height: '2px', backgroundColor: '#4dabf7', margin: '5px 0' }}></div>
            </div>
            
            <div style={{ marginBottom: '10px' }}>
              <strong>Propiedad:</strong> APTO 101 - SUITE ESTANDAR<br/>
              <strong>Propietario:</strong> Ricardo Chumacero<br/>
              <strong>Mes:</strong> Enero 2026
            </div>
            
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '10px' }}>
              <thead>
                <tr style={{ backgroundColor: '#2c3e50', color: 'white' }}>
                  <th style={{ padding: '6px', textAlign: 'left' }}>CONCEPTO</th>
                  <th style={{ padding: '6px', textAlign: 'right' }}>MONTO (Bs)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ padding: '6px', borderBottom: '1px solid #eee' }}>INGRESO TOTAL</td>
                  <td style={{ padding: '6px', borderBottom: '1px solid #eee', textAlign: 'right', color: '#2b8a3e' }}>
                    Bs 4,750.00
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: '6px', borderBottom: '1px solid #eee' }}>GASTOS TOTALES</td>
                  <td style={{ padding: '6px', borderBottom: '1px solid #eee', textAlign: 'right', color: '#c92a2a' }}>
                    - Bs 1,135.00
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: '6px', borderBottom: '1px solid #eee' }}>COMISIÓN ADMINISTRACIÓN</td>
                  <td style={{ padding: '6px', borderBottom: '1px solid #eee', textAlign: 'right', color: '#c92a2a' }}>
                    - Bs 950.00
                  </td>
                </tr>
                <tr style={{ backgroundColor: '#f8f9fa' }}>
                  <td style={{ padding: '8px', fontWeight: 'bold' }}>NETO A PAGAR</td>
                  <td style={{ padding: '8px', textAlign: 'right', fontWeight: 'bold', color: '#2b8a3e' }}>
                    Bs 2,665.00
                  </td>
                </tr>
              </tbody>
            </table>
            
            <div style={{ 
              backgroundColor: '#fff9db', 
              padding: '10px', 
              borderRadius: '4px',
              borderLeft: '3px solid #f59f00',
              fontSize: '11px'
            }}>
              <strong style={{ color: '#e67700' }}>OBSERVACIONES:</strong><br/>
              • El pago será realizado hasta el 5 del mes siguiente.<br/>
              • Los gastos incluyen: limpieza, mantenimiento, internet.
            </div>
          </div>
        </div>
      )}

      {reporteGenerado && reporteData ? (
        <div style={{
          backgroundColor: '#fff',
          borderRadius: '12px',
          padding: '32px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        }}>
          <div style={{
            textAlign: 'center',
            marginBottom: '32px',
            paddingBottom: '20px',
            borderBottom: '2px solid #e9ecef',
          }}>
            <h3 style={{
              fontSize: '20px',
              fontWeight: '600',
              color: '#2c3e50',
              marginBottom: '8px',
            }}>
              REPORTE MENSUAL - {reporteData.propiedad}
            </h3>
            <div style={{
              color: '#868e96',
              fontSize: '14px',
            }}>
              Mes: {reporteData.mes} | Propietario: {reporteData.propietario} | 
              Generado: {new Date().toLocaleDateString('es-BO')}
            </div>
          </div>

          <div style={{
            maxWidth: '800px',
            margin: '0 auto',
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-around',
              backgroundColor: '#f8f9fa',
              padding: '20px',
              borderRadius: '8px',
              marginBottom: '32px',
              flexWrap: 'wrap',
              gap: '20px',
            }}>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                minWidth: '120px',
              }}>
                <span style={{
                  fontSize: '12px',
                  color: '#868e96',
                  marginBottom: '4px',
                }}>Días Ocupados:</span>
                <span style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#2c3e50',
                }}>{reporteData.diasOcupados} días</span>
              </div>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                minWidth: '120px',
              }}>
                <span style={{
                  fontSize: '12px',
                  color: '#868e96',
                  marginBottom: '4px',
                }}>Ocupación:</span>
                <span style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#2c3e50',
                }}>{reporteData.porcentajeOcupacion}%</span>
              </div>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                minWidth: '120px',
              }}>
                <span style={{
                  fontSize: '12px',
                  color: '#868e96',
                  marginBottom: '4px',
                }}>Precio/Noche:</span>
                <span style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#2c3e50',
                }}>Bs {reporteData.precioNoche.toFixed(2)}</span>
              </div>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                minWidth: '120px',
              }}>
                <span style={{
                  fontSize: '12px',
                  color: '#868e96',
                  marginBottom: '4px',
                }}>Ingreso Total:</span>
                <span style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#2b8a3e',
                }}>Bs {reporteData.ingresoTotal.toFixed(2)}</span>
              </div>
            </div>

            <div style={{ marginBottom: '32px' }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                border: '1px solid #dee2e6',
              }}>
                <thead>
                  <tr>
                    <th colSpan={2} style={{
                      backgroundColor: '#2c3e50',
                      color: 'white',
                      padding: '16px',
                      fontSize: '16px',
                      fontWeight: '600',
                      textAlign: 'center',
                    }}>RESUMEN FINANCIERO</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ backgroundColor: '#e7f5ff' }}>
                    <td style={{
                      padding: '12px 16px',
                      fontSize: '14px',
                      color: '#495057',
                      borderBottom: '1px solid #dee2e6',
                    }}>INGRESO TOTAL DEL MES:</td>
                    <td style={{
                      padding: '12px 16px',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#2b8a3e',
                      textAlign: 'right',
                      borderBottom: '1px solid #dee2e6',
                    }}>Bs {reporteData.ingresoTotal.toFixed(2)}</td>
                  </tr>
                  
                  {reporteData.gastos.length > 0 && (
                    <>
                      <tr>
                        <td colSpan={2} style={{
                          padding: '8px 16px',
                          fontSize: '12px',
                          fontWeight: '600',
                          color: '#868e96',
                          backgroundColor: '#f8f9fa',
                          textTransform: 'uppercase',
                        }}>GASTOS DEDUCIBLES:</td>
                      </tr>
                      
                      {reporteData.gastos.map((gasto: any, index: number) => (
                        <tr key={index}>
                          <td style={{
                            padding: '12px 16px',
                            fontSize: '14px',
                            color: '#495057',
                            borderBottom: '1px solid #dee2e6',
                          }}>• {gasto.concepto}</td>
                          <td style={{
                            padding: '12px 16px',
                            fontSize: '14px',
                            fontWeight: '600',
                            color: '#c92a2a',
                            textAlign: 'right',
                            borderBottom: '1px solid #dee2e6',
                          }}>- Bs {gasto.monto.toFixed(2)}</td>
                        </tr>
                      ))}
                      
                      <tr style={{ backgroundColor: '#f8f9fa' }}>
                        <td style={{
                          padding: '12px 16px',
                          fontSize: '14px',
                          color: '#495057',
                          borderBottom: '1px solid #dee2e6',
                        }}>TOTAL GASTOS:</td>
                        <td style={{
                          padding: '12px 16px',
                          fontSize: '14px',
                          fontWeight: '600',
                          color: '#c92a2a',
                          textAlign: 'right',
                          borderBottom: '1px solid #dee2e6',
                        }}>- Bs {reporteData.totalGastos.toFixed(2)}</td>
                      </tr>
                    </>
                  )}
                  
                  <tr>
                    <td colSpan={2} style={{
                      padding: '8px 16px',
                      fontSize: '12px',
                      fontWeight: '600',
                      color: '#868e96',
                      backgroundColor: '#f8f9fa',
                      textTransform: 'uppercase',
                    }}>COMISIÓN ADMINISTRACIÓN (20%):</td>
                  </tr>
                  
                  <tr>
                    <td style={{
                      padding: '12px 16px',
                      fontSize: '14px',
                      color: '#495057',
                      borderBottom: '1px solid #dee2e6',
                    }}>• Comisión gestión y administración</td>
                    <td style={{
                      padding: '12px 16px',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#c92a2a',
                      textAlign: 'right',
                      borderBottom: '1px solid #dee2e6',
                    }}>- Bs {reporteData.comisionAdmin.toFixed(2)}</td>
                  </tr>
                  
                  <tr style={{ backgroundColor: '#d3f9d8', borderTop: '2px solid #2b8a3e' }}>
                    <td style={{
                      padding: '16px',
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#2b8a3e',
                    }}>NETO A PAGAR AL PROPIETARIO:</td>
                    <td style={{
                      padding: '16px',
                      fontSize: '20px',
                      fontWeight: '700',
                      color: '#2b8a3e',
                      textAlign: 'right',
                    }}>Bs {reporteData.netoPropietario.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* VISUALIZACIÓN DE VERIFICACIÓN */}
            {reporteData._verificacion && (
              <div style={{
                marginTop: '20px',
                marginBottom: '20px',
                padding: '15px',
                backgroundColor: reporteData._verificacion.fuenteIngreso === 'transacciones' ? '#e7f5ff' : '#fff3cd',
                borderRadius: '8px',
                borderLeft: `4px solid ${reporteData._verificacion.fuenteIngreso === 'transacciones' ? '#1971c2' : '#f59f00'}`
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  marginBottom: '10px'
                }}>
                  <span style={{
                    fontSize: '20px',
                    color: reporteData._verificacion.fuenteIngreso === 'transacciones' ? '#1971c2' : '#f59f00'
                  }}>
                    {reporteData._verificacion.fuenteIngreso === 'transacciones' ? '📝' : '🔢'}
                  </span>
                  <h4 style={{ margin: 0, color: reporteData._verificacion.fuenteIngreso === 'transacciones' ? '#1971c2' : '#e67700' }}>
                    {reporteData._verificacion.fuenteIngreso === 'transacciones' 
                      ? 'Cálculo Manual (con transacciones)' 
                      : 'Cálculo Automático (sin transacciones)'}
                  </h4>
                </div>
                
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '10px',
                  fontSize: '12px'
                }}>
                  <div>
                    <strong>Días ocupados:</strong> {reporteData.diasOcupados}
                  </div>
                  <div>
                    <strong>Precio por noche:</strong> Bs {reporteData.precioNoche.toFixed(2)}
                  </div>
                  
                  <div style={{ gridColumn: 'span 2' }}>
                    <div style={{ 
                      backgroundColor: 'white', 
                      padding: '10px', 
                      borderRadius: '4px',
                      marginTop: '5px',
                      fontFamily: 'monospace'
                    }}>
                      <strong>Fórmula base:</strong><br/>
                      {reporteData.diasOcupados} días × Bs {reporteData.precioNoche.toFixed(2)} = 
                      <strong style={{ color: '#1971c2', marginLeft: '5px' }}>
                        Bs {(reporteData.diasOcupados * reporteData.precioNoche).toFixed(2)}
                      </strong>
                    </div>
                  </div>
                  
                  <div style={{ gridColumn: 'span 2', marginTop: '10px' }}>
                    <div style={{ 
                      backgroundColor: reporteData._verificacion.validacion.valido ? '#d3f9d8' : '#fff3cd', 
                      padding: '10px', 
                      borderRadius: '4px'
                    }}>
                      <strong>Verificación:</strong><br/>
                      • Por ocupación: <strong>Bs {reporteData._verificacion.ingresoPorOcupacion.toFixed(2)}</strong><br/>
                      • Por transacciones: <strong>Bs {reporteData._verificacion.ingresoPorTransacciones.toFixed(2)}</strong>
                      <br/><br/>
                      {reporteData._verificacion.validacion.mensaje}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div style={{
              marginBottom: '32px',
              padding: '20px',
              backgroundColor: '#fff9db',
              borderRadius: '8px',
              borderLeft: '4px solid #f59f00',
            }}>
              <h4 style={{
                fontSize: '14px',
                fontWeight: '600',
                color: '#e67700',
                marginBottom: '8px',
              }}>Observaciones:</h4>
              <p style={{
                fontSize: '14px',
                color: '#5c3c00',
                lineHeight: 1.6,
              }}>
                • El pago será realizado hasta el 5 del mes siguiente según contrato.<br/>
                • Los gastos incluyen: limpieza, mantenimiento, internet y servicios.<br/>
                • La comisión de administración es del 20% sobre los ingresos brutos.<br/>
                • Para consultas o aclaraciones, contactar a Diana Arenales.
              </p>
            </div>

            <div style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'center',
              paddingTop: '32px',
              borderTop: '1px solid #e9ecef',
              flexWrap: 'wrap',
            }}>
              <button
                style={{
                  backgroundColor: '#e7f5ff',
                  color: '#1971c2',
                  border: '1px solid #a5d8ff',
                  padding: '12px 20px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                }}
                onClick={handleDescargarPDF}
                data-pdf-button="true"
              >
                📥 Descargar Reporte
              </button>
              <button
                style={{
                  backgroundColor: '#e7f5ff',
                  color: '#1971c2',
                  border: '1px solid #a5d8ff',
                  padding: '12px 20px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                }}
                onClick={() => {
                  const texto = `Reporte ${reporteData.propiedad} - ${reporteData.mes}\nNeto a pagar: Bs ${reporteData.netoPropietario.toFixed(2)}`
                  navigator.clipboard.writeText(texto)
                  alert('Resumen copiado al portapapeles')
                }}
              >
                📋 Copiar Resumen
              </button>
              <button
                style={{
                  backgroundColor: '#40c057',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                }}
                onClick={handleEnviarReporte}
              >
                ✉️ Enviar al Propietario
              </button>
            </div>
          </div>
        </div>
      ) : !reporteGenerado ? (
        <div style={{
          backgroundColor: '#fff',
          borderRadius: '12px',
          padding: '32px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          marginTop: '20px',
        }}>
          <h3 style={{
            fontSize: '20px',
            fontWeight: '600',
            color: '#495057',
            marginBottom: '20px',
            textAlign: 'center',
          }}>Sistema de Reportes Automáticos</h3>
          <div style={{
            padding: '24px',
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
          }}>
            <p style={{
              marginBottom: '16px',
              color: '#495057',
              fontSize: '16px',
            }}>
              <strong>🎯 Beneficios para Diana:</strong>
            </p>
            <ul style={{
              marginLeft: '0',
              marginBottom: '32px',
              color: '#495057',
              lineHeight: 1.8,
              listStyle: 'none',
            }}>
              <li>✅ <strong>Automático:</strong> El sistema calcula todo automáticamente</li>
              <li>✅ <strong>Rápido:</strong> Genera 30 reportes en 5 minutos (antes: 4 días)</li>
              <li>✅ <strong>Preciso:</strong> Sin errores de cálculo manual</li>
              <li>✅ <strong>Profesional:</strong> Reportes listos para enviar a propietarios</li>
              <li>✅ <strong>Transparente:</strong> Todos los gastos están detallados</li>
            </ul>
            
            <div style={{ marginBottom: '32px' }}>
              <h4 style={{
                fontSize: '16px',
                fontWeight: '600',
                color: '#495057',
                marginBottom: '16px',
              }}>Cómo funciona:</h4>
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                marginBottom: '20px',
                padding: '16px',
                backgroundColor: 'white',
                borderRadius: '8px',
                borderLeft: '4px solid #4dabf7',
              }}>
                <span style={{
                  backgroundColor: '#4dabf7',
                  color: 'white',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '600',
                  marginRight: '16px',
                  flexShrink: 0,
                }}>1</span>
                <div style={{ flex: 1 }}>
                  <strong>Selecciona el mes y la propiedad</strong>
                  <p>El sistema toma todos los datos automáticamente</p>
                </div>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                marginBottom: '20px',
                padding: '16px',
                backgroundColor: 'white',
                borderRadius: '8px',
                borderLeft: '4px solid #4dabf7',
              }}>
                <span style={{
                  backgroundColor: '#4dabf7',
                  color: 'white',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '600',
                  marginRight: '16px',
                  flexShrink: 0,
                }}>2</span>
                <div style={{ flex: 1 }}>
                  <strong>Calcula ingresos y gastos</strong>
                  <p>Suma todos los pagos y resta los gastos del mes</p>
                </div>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                marginBottom: '20px',
                padding: '16px',
                backgroundColor: 'white',
                borderRadius: '8px',
                borderLeft: '4px solid #4dabf7',
              }}>
                <span style={{
                  backgroundColor: '#4dabf7',
                  color: 'white',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '600',
                  marginRight: '16px',
                  flexShrink: 0,
                }}>3</span>
                <div style={{ flex: 1 }}>
                  <strong>Aplica tu comisión</strong>
                  <p>Calcula automáticamente tu 20% de comisión</p>
                </div>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                marginBottom: '20px',
                padding: '16px',
                backgroundColor: 'white',
                borderRadius: '8px',
                borderLeft: '4px solid #4dabf7',
              }}>
                <span style={{
                  backgroundColor: '#4dabf7',
                  color: 'white',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '600',
                  marginRight: '16px',
                  flexShrink: 0,
                }}>4</span>
                <div style={{ flex: 1 }}>
                  <strong>Genera el reporte final</strong>
                  <p>Crea un PDF profesional listo para enviar</p>
                </div>
              </div>
            </div>
            
            <div style={{
              display: 'flex',
              justifyContent: 'space-around',
              textAlign: 'center',
              marginTop: '32px',
              paddingTop: '32px',
              borderTop: '1px solid #dee2e6',
              flexWrap: 'wrap',
              gap: '20px',
            }}>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                minWidth: '120px',
              }}>
                <div style={{
                  fontSize: '24px',
                  fontWeight: '700',
                  color: '#4dabf7',
                  marginBottom: '4px',
                }}>{propiedades.length}</div>
                <div style={{
                  fontSize: '12px',
                  color: '#868e96',
                }}>Propiedades activas</div>
              </div>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                minWidth: '120px',
              }}>
                <div style={{
                  fontSize: '24px',
                  fontWeight: '700',
                  color: '#4dabf7',
                  marginBottom: '4px',
                }}>4 días → 5 min</div>
                <div style={{
                  fontSize: '12px',
                  color: '#868e96',
                }}>Ahorro de tiempo</div>
              </div>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                minWidth: '120px',
              }}>
                <div style={{
                  fontSize: '24px',
                  fontWeight: '700',
                  color: '#4dabf7',
                  marginBottom: '4px',
                }}>100%</div>
                <div style={{
                  fontSize: '12px',
                  color: '#868e96',
                }}>Precisión</div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default GenerarReporte