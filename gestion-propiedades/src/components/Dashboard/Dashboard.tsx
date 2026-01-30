// src/components/Dashboard/Dashboard.tsx - ATUALIZADO
import { useState, useEffect } from 'react'
import StatsCard from './StatsCard'
import { obtenerPropiedades, obtenerTransacciones, obtenerOcupacion } from '../../utils/storage'
import { calcularTotalIngresos, calcularTotalGastos, formatearMoneda } from '../../utils/calculos'

function Dashboard() {
  const [estadisticas, setEstadisticas] = useState({
    totalPropiedades: 0,
    ocupacionHoy: 0,
    ingresosMes: 0,
    gastosMes: 0,
    checkoutsHoy: 0,
    checkinsHoy: 0,
    netoMes: 0
  })

  const [propiedadesRecientes, setPropiedadesRecientes] = useState<any[]>([])
  const [transaccionesRecientes, setTransaccionesRecientes] = useState<any[]>([])
  const [checkoutsHoy, setCheckoutsHoy] = useState<any[]>([])

  useEffect(() => {
    cargarDatos()
  }, [])

  const cargarDatos = () => {
    const propiedades = obtenerPropiedades()
    const transacciones = obtenerTransacciones()
    const ocupacion = obtenerOcupacion()
    
    const hoy = new Date().toISOString().split('T')[0]
    const mesActual = new Date().toISOString().substring(0, 7)
    
    // Propiedades mais recentes (últimas 5 adicionadas)
    const propiedadesRecientesData = [...propiedades]
      .sort((a, b) => b.id.localeCompare(a.id))
      .slice(0, 5)
    
    // Transações mais recentes
    const transaccionesRecientesData = [...transacciones]
      .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
      .slice(0, 5)
    
    // Check-outs de hoje
    const hoyDiaMes = `${new Date().getDate()}/${new Date().getMonth() + 1}`
    const checkoutsHoyData = ocupacion.filter(o => o.salida === hoyDiaMes && o.estado === 'OCUPADA')
    
    // Transações do mês
    const transaccionesMes = transacciones.filter(t => t.fecha.startsWith(mesActual))
    
    // Ocupação de hoje
    const ocupacionHoy = ocupacion.filter(o => o.fecha === hoy)
    
    setPropiedadesRecientes(propiedadesRecientesData)
    setTransaccionesRecientes(transaccionesRecientesData)
    setCheckoutsHoy(checkoutsHoyData)

    setEstadisticas({
      totalPropiedades: propiedades.length,
      ocupacionHoy: ocupacionHoy.length > 0 
        ? Math.round((ocupacionHoy.filter(o => o.estado === 'OCUPADA').length / propiedades.length) * 100)
        : 0,
      ingresosMes: calcularTotalIngresos(transaccionesMes),
      gastosMes: calcularTotalGastos(transaccionesMes),
      netoMes: calcularTotalIngresos(transaccionesMes) - calcularTotalGastos(transaccionesMes),
      checkoutsHoy: checkoutsHoyData.length,
      checkinsHoy: 0 // Podemos calcular depois
    })
  }

  const handleNuevaReserva = () => {
    window.location.hash = '#/ocupacion'
  }

  const handleNuevoReporte = () => {
    window.location.hash = '#/reportes'
  }

  return (
    <div>
      <div style={styles.header}>
        <h2 style={styles.titulo}>Dashboard</h2>
        <div style={styles.fecha}>
          {new Date().toLocaleDateString('es-BO', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </div>

      <div style={styles.statsGrid}>
        <StatsCard
          titulo="Ingresos del Mes"
          valor={formatearMoneda(estadisticas.ingresosMes)}
          cambio="+12%"
          color="verde"
          icono="💰"
        />
        <StatsCard
          titulo="Ocupación Actual"
          valor={`${estadisticas.ocupacionHoy}%`}
          cambio="+5%"
          color="azul"
          icono="📊"
        />
        <StatsCard
          titulo="Gastos del Mes"
          valor={formatearMoneda(estadisticas.gastosMes)}
          cambio="-3%"
          color="naranja"
          icono="💸"
        />
        <StatsCard
          titulo="Neto del Mes"
          valor={formatearMoneda(estadisticas.netoMes)}
          cambio={estadisticas.netoMes >= 0 ? "+8%" : "-2%"}
          color={estadisticas.netoMes >= 0 ? "verde" : "rojo"}
          icono="📈"
        />
      </div>

      <div style={styles.grid}>
        <div style={styles.columna}>
          <div style={styles.seccion}>
            <div style={styles.seccionHeader}>
              <h3 style={styles.subtitulo}>Propiedades Recientes</h3>
              <button 
                style={styles.verTodo}
                onClick={() => window.location.hash = '#/propiedades'}
              >
                Ver todas
              </button>
            </div>
            <div style={styles.tarjeta}>
              <table style={styles.tabla}>
                <thead>
                  <tr>
                    <th>APTO</th>
                    <th>Tipo</th>
                    <th>Estado</th>
                    <th>Precio/Noche</th>
                  </tr>
                </thead>
                <tbody>
                  {propiedadesRecientes.map((prop) => (
                    <tr key={prop.id}>
                      <td style={styles.celdaDestacada}>{prop.numero}</td>
                      <td>{prop.tipo}</td>
                      <td>
                        <span className={`estado-${prop.estado.toLowerCase()}`}>
                          {prop.estado}
                        </span>
                      </td>
                      <td>Bs {prop.precioNoche}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div style={styles.seccion}>
            <h3 style={styles.subtitulo}>Check-outs de Hoy</h3>
            <div style={styles.tarjeta}>
              {checkoutsHoy.length > 0 ? (
                <table style={styles.tabla}>
                  <thead>
                    <tr>
                      <th>APTO</th>
                      <th>Huésped</th>
                      <th>Salida</th>
                    </tr>
                  </thead>
                  <tbody>
                    {checkoutsHoy.map((item) => (
                      <tr key={item.id}>
                        <td>{item.propiedadNumero}</td>
                        <td>{item.huesped}</td>
                        <td>{item.salida}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div style={styles.sinDatos}>
                  No hay check-outs programados para hoy
                </div>
              )}
            </div>
          </div>
        </div>

        <div style={styles.columna}>
          <div style={styles.seccion}>
            <div style={styles.seccionHeader}>
              <h3 style={styles.subtitulo}>Transacciones Recientes</h3>
              <button 
                style={styles.verTodo}
                onClick={() => window.location.hash = '#/transacciones'}
              >
                Ver todas
              </button>
            </div>
            <div style={styles.tarjeta}>
              <table style={styles.tabla}>
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Tipo</th>
                    <th>Monto</th>
                    <th>Descripción</th>
                  </tr>
                </thead>
                <tbody>
                  {transaccionesRecientes.map((t) => (
                    <tr key={t.id}>
                      <td>{t.fecha.split('-').reverse().join('/')}</td>
                      <td>
                        <span style={t.tipo === 'INGRESO' ? styles.badgeIngreso : styles.badgeGasto}>
                          {t.categoria}
                        </span>
                      </td>
                      <td style={t.tipo === 'INGRESO' ? styles.montoIngreso : styles.montoGasto}>
                        {t.tipo === 'INGRESO' ? '+' : '-'} Bs {t.monto}
                      </td>
                      <td style={styles.descripcion}>{t.descripcion}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div style={styles.seccion}>
        <h3 style={styles.subtitulo}>Acciones Rápidas</h3>
        <div style={styles.accionesGrid}>
          <button style={styles.accion} onClick={handleNuevaReserva}>
            <span style={styles.accionIcono}>➕</span>
            Nueva Reserva
          </button>
          <button style={styles.accion} onClick={() => window.location.hash = '#/transacciones'}>
            <span style={styles.accionIcono}>💰</span>
            Registrar Pago
          </button>
          <button style={styles.accion} onClick={handleNuevoReporte}>
            <span style={styles.accionIcono}>📋</span>
            Generar Reporte
          </button>
          <button style={styles.accion} onClick={() => window.location.hash = '#/propiedades'}>
            <span style={styles.accionIcono}>🏠</span>
            Agregar Propiedad
          </button>
        </div>
      </div>
    </div>
  )
}

const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  },
  titulo: {
    fontSize: '24px',
    fontWeight: '600' as const,
    color: '#2c3e50',
  },
  fecha: {
    color: '#868e96',
    fontSize: '14px',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '20px',
    marginBottom: '32px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '24px',
    marginBottom: '32px',
  },
  columna: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '24px',
  },
  seccion: {
    marginBottom: '0',
  },
  seccionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  },
  subtitulo: {
    fontSize: '18px',
    fontWeight: '600' as const,
    color: '#495057',
    margin: '0',
  },
  verTodo: {
    backgroundColor: 'transparent',
    color: '#4dabf7',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500' as const,
  },
  tarjeta: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    overflow: 'hidden',
  },
  tabla: {
    width: '100%',
    borderCollapse: 'collapse' as const,
  },
  celdaDestacada: {
    fontWeight: '600' as const,
    color: '#2c3e50',
  },
  badgeIngreso: {
    backgroundColor: '#d3f9d8',
    color: '#2b8a3e',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: '500' as const,
  },
  badgeGasto: {
    backgroundColor: '#ffe3e3',
    color: '#c92a2a',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: '500' as const,
  },
  montoIngreso: {
    color: '#2b8a3e',
    fontWeight: '600' as const,
  },
  montoGasto: {
    color: '#c92a2a',
    fontWeight: '600' as const,
  },
  descripcion: {
    maxWidth: '200px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap' as const,
  },
  sinDatos: {
    padding: '40px',
    textAlign: 'center' as const,
    color: '#868e96',
    fontSize: '14px',
  },
  accionesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
  },
  accion: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    backgroundColor: '#e7f5ff',
    color: '#1971c2',
    border: 'none',
    padding: '16px 20px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500' as const,
    textAlign: 'left' as const,
    transition: 'all 0.2s',
  },
  accionIcono: {
    fontSize: '20px',
  },
}

// Adicionar hover effect
Object.assign(styles.accion, {
  ':hover': {
    backgroundColor: '#d0ebff',
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 12px rgba(77, 171, 247, 0.2)',
  }
})

Object.assign(styles.verTodo, {
  ':hover': {
    backgroundColor: '#e7f5ff',
  }
})

export default Dashboard