// src/components/Transacciones/RegistroTransacciones.tsx - NOVO ARQUIVO COMPLETO
import { useState, useEffect } from 'react'
import { 
  obtenerTransacciones, 
  guardarTransacciones, 
  obtenerPropiedades,
  generarId 
} from '../../utils/storage'
import { calcularTotalIngresos, calcularTotalGastos } from '../../utils/calculos'

function RegistroTransacciones() {
  const [tipoTransaccion, setTipoTransaccion] = useState<'INGRESO' | 'GASTO'>('INGRESO')
  const [mostrarForm, setMostrarForm] = useState(false)
  const [transacciones, setTransacciones] = useState<any[]>([])
  const [propiedades, setPropiedades] = useState<any[]>([])
  const [filtroMes, setFiltroMes] = useState('2026-01')

  const [formData, setFormData] = useState({
    id: '',
    fecha: new Date().toISOString().split('T')[0],
    categoria: 'ALOJAMIENTO',
    propiedadId: '',
    monto: '',
    descripcion: '',
    comprobante: '',
  })

  useEffect(() => {
    cargarDatos()
  }, [filtroMes])

  const cargarDatos = () => {
    const transaccionesData = obtenerTransacciones()
    const propiedadesData = obtenerPropiedades()
    
    setTransacciones(transaccionesData)
    setPropiedades(propiedadesData)
  }

  const categoriasIngreso = ['ALOJAMIENTO', 'DEPOSITO', 'OTRO']
  const categoriasGasto = ['LIMPIEZA', 'MANTENIMIENTO', 'INTERNET', 'REPARACION', 'SERVICIO', 'OTRO']

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const nuevaTransaccion = {
      id: formData.id || generarId(),
      fecha: formData.fecha,
      tipo: tipoTransaccion,
      categoria: formData.categoria,
      propiedadId: formData.propiedadId,
      monto: Number(formData.monto),
      descripcion: formData.descripcion,
      comprobante: formData.comprobante,
      propiedadNumero: propiedades.find(p => p.id === formData.propiedadId)?.numero
    }

    let nuevasTransacciones
    if (formData.id) {
      nuevasTransacciones = transacciones.map(t => 
        t.id === formData.id ? nuevaTransaccion : t
      )
    } else {
      nuevasTransacciones = [...transacciones, nuevaTransaccion]
    }

    guardarTransacciones(nuevasTransacciones)
    setTransacciones(nuevasTransacciones)
    setMostrarForm(false)
    resetForm()
  }

  const resetForm = () => {
    setFormData({
      id: '',
      fecha: new Date().toISOString().split('T')[0],
      categoria: 'ALOJAMIENTO',
      propiedadId: '',
      monto: '',
      descripcion: '',
      comprobante: '',
    })
  }

  const handleEditar = (transaccion: any) => {
    setFormData({
      id: transaccion.id,
      fecha: transaccion.fecha,
      categoria: transaccion.categoria,
      propiedadId: transaccion.propiedadId,
      monto: transaccion.monto.toString(),
      descripcion: transaccion.descripcion,
      comprobante: transaccion.comprobante || '',
    })
    setTipoTransaccion(transaccion.tipo)
    setMostrarForm(true)
  }

  const handleEliminar = (id: string) => {
    if (window.confirm('¿Está seguro de eliminar esta transacción?')) {
      const nuevasTransacciones = transacciones.filter(t => t.id !== id)
      guardarTransacciones(nuevasTransacciones)
      setTransacciones(nuevasTransacciones)
    }
  }

  // Filtrar por mes
  const transaccionesFiltradas = transacciones.filter(t => 
    t.fecha.startsWith(filtroMes)
  )

  const transaccionesTipo = transaccionesFiltradas.filter(t => t.tipo === tipoTransaccion)

  const totalIngresos = calcularTotalIngresos(transaccionesFiltradas)
  const totalGastos = calcularTotalGastos(transaccionesFiltradas)
  const neto = totalIngresos - totalGastos

  return (
    <div>
      <div style={styles.header}>
        <h2 style={styles.titulo}>Transacciones</h2>
        <div style={styles.controles}>
          <div style={styles.botonesTipo}>
            <button
              style={{
                ...styles.botonTipo,
                ...(tipoTransaccion === 'INGRESO' ? styles.botonTipoActivo : {})
              }}
              onClick={() => setTipoTransaccion('INGRESO')}
            >
              💰 Ingresos
            </button>
            <button
              style={{
                ...styles.botonTipo,
                ...(tipoTransaccion === 'GASTO' ? styles.botonTipoActivo : {})
              }}
              onClick={() => setTipoTransaccion('GASTO')}
            >
              💸 Gastos
            </button>
          </div>
          <select
            value={filtroMes}
            onChange={(e) => setFiltroMes(e.target.value)}
            style={styles.selectMes}
          >
            <option value="2026-01">Enero 2026</option>
            <option value="2025-12">Diciembre 2025</option>
            <option value="2025-11">Noviembre 2025</option>
          </select>
          <button
            style={styles.botonAgregar}
            onClick={() => {
              resetForm()
              setMostrarForm(true)
            }}
          >
            + Nueva Transacción
          </button>
        </div>
      </div>

      <div style={styles.resumen}>
        <div style={styles.resumenItem}>
          <span style={styles.resumenLabel}>Total Ingresos ({filtroMes}):</span>
          <span style={styles.resumenValor}>Bs {totalIngresos.toLocaleString('es-BO')}</span>
        </div>
        <div style={styles.resumenItem}>
          <span style={styles.resumenLabel}>Total Gastos ({filtroMes}):</span>
          <span style={styles.resumenValor}>Bs {totalGastos.toLocaleString('es-BO')}</span>
        </div>
        <div style={styles.resumenItem}>
          <span style={styles.resumenLabel}>Neto:</span>
          <span style={{
            ...styles.resumenValor, 
            color: neto >= 0 ? '#2b8a3e' : '#c92a2a'
          }}>
            Bs {neto.toLocaleString('es-BO')}
          </span>
        </div>
      </div>

      <div style={styles.tarjeta}>
        <table style={styles.tabla}>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Categoría</th>
              <th>Propiedad</th>
              <th>Descripción</th>
              <th>Monto (Bs)</th>
              <th>Comprobante</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {transaccionesTipo.map((t) => (
              <tr key={t.id}>
                <td>{t.fecha}</td>
                <td>
                  <span style={t.tipo === 'INGRESO' ? styles.badgeIngreso : styles.badgeGasto}>
                    {t.categoria}
                  </span>
                </td>
                <td>APTO {t.propiedadNumero || t.propiedadId}</td>
                <td>{t.descripcion}</td>
                <td style={{
                  color: t.tipo === 'INGRESO' ? '#2b8a3e' : '#c92a2a',
                  fontWeight: '600'
                }}>
                  {t.tipo === 'INGRESO' ? '+' : '-'} {t.monto.toLocaleString('es-BO')}
                </td>
                <td>{t.comprobante || '-'}</td>
                <td>
                  <button 
                    style={styles.botonAccion}
                    onClick={() => handleEditar(t)}
                  >
                    Editar
                  </button>
                  <button 
                    style={styles.botonEliminar}
                    onClick={() => handleEliminar(t.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
            {transaccionesTipo.length === 0 && (
              <tr>
                <td colSpan={7} style={styles.celdaVacia}>
                  No hay transacciones registradas
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {mostrarForm && (
        <div style={styles.modal}>
          <div style={styles.modalContenido}>
            <div style={styles.modalHeader}>
              <h3>Registrar {tipoTransaccion === 'INGRESO' ? 'Ingreso' : 'Gasto'}</h3>
              <button
                style={styles.modalCerrar}
                onClick={() => setMostrarForm(false)}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} style={styles.formulario}>
              <div style={styles.formGrid}>
                <div style={styles.formGrupo}>
                  <label style={styles.formLabel}>Fecha *</label>
                  <input
                    type="date"
                    name="fecha"
                    value={formData.fecha}
                    onChange={handleInputChange}
                    style={styles.formInput}
                    required
                  />
                </div>

                <div style={styles.formGrupo}>
                  <label style={styles.formLabel}>Categoría *</label>
                  <select
                    name="categoria"
                    value={formData.categoria}
                    onChange={handleInputChange}
                    style={styles.formInput}
                    required
                  >
                    {(tipoTransaccion === 'INGRESO' ? categoriasIngreso : categoriasGasto).map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div style={styles.formGrupo}>
                  <label style={styles.formLabel}>Propiedad *</label>
                  <select
                    name="propiedadId"
                    value={formData.propiedadId}
                    onChange={handleInputChange}
                    style={styles.formInput}
                    required
                  >
                    <option value="">Seleccionar propiedad</option>
                    {propiedades.map(prop => (
                      <option key={prop.id} value={prop.id}>APTO {prop.numero}</option>
                    ))}
                  </select>
                </div>

                <div style={styles.formGrupo}>
                  <label style={styles.formLabel}>Monto (Bs) *</label>
                  <input
                    type="number"
                    name="monto"
                    value={formData.monto}
                    onChange={handleInputChange}
                    style={styles.formInput}
                    placeholder="0.00"
                    required
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>

              <div style={styles.formGrupo}>
                <label style={styles.formLabel}>Descripción *</label>
                <textarea
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleInputChange}
                  style={styles.formTextarea}
                  placeholder="Descripción detallada..."
                  rows={3}
                  required
                />
              </div>

              <div style={styles.formGrupo}>
                <label style={styles.formLabel}>Comprobante (opcional)</label>
                <input
                  type="text"
                  name="comprobante"
                  value={formData.comprobante}
                  onChange={handleInputChange}
                  style={styles.formInput}
                  placeholder="Número de factura"
                />
              </div>

              <div style={styles.botonesForm}>
                <button
                  type="button"
                  style={styles.botonCancelar}
                  onClick={() => setMostrarForm(false)}
                >
                  Cancelar
                </button>
                <button type="submit" style={styles.botonGuardar}>
                  {formData.id ? 'Actualizar' : 'Guardar'} Transacción
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
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
  controles: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  },
  botonesTipo: {
    display: 'flex',
    gap: '8px',
    backgroundColor: '#e9ecef',
    padding: '4px',
    borderRadius: '8px',
  },
  botonTipo: {
    padding: '8px 20px',
    border: 'none',
    borderRadius: '6px',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    fontSize: '14px',
    color: '#495057',
  },
  botonTipoActivo: {
    backgroundColor: '#fff',
    color: '#1971c2',
    fontWeight: '500' as const,
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  selectMes: {
    padding: '10px 16px',
    border: '1px solid #dee2e6',
    borderRadius: '6px',
    backgroundColor: 'white',
    fontSize: '14px',
  },
  botonAgregar: {
    backgroundColor: '#4dabf7',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500' as const,
  },
  resumen: {
    display: 'flex',
    gap: '32px',
    marginBottom: '32px',
    padding: '20px',
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  resumenItem: {
    display: 'flex',
    flexDirection: 'column' as const,
  },
  resumenLabel: {
    fontSize: '12px',
    color: '#868e96',
    marginBottom: '4px',
  },
  resumenValor: {
    fontSize: '18px',
    fontWeight: '600' as const,
    color: '#2c3e50',
  },
  tarjeta: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  tabla: {
    width: '100%',
    borderCollapse: 'collapse' as const,
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
  botonAccion: {
    backgroundColor: '#4dabf7',
    color: 'white',
    border: 'none',
    padding: '6px 12px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
    marginRight: '8px',
  },
  botonEliminar: {
    backgroundColor: '#fa5252',
    color: 'white',
    border: 'none',
    padding: '6px 12px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
  },
  celdaVacia: {
    padding: '40px',
    textAlign: 'center' as const,
    color: '#868e96',
    fontSize: '14px',
  },
  modal: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modalContenido: {
    backgroundColor: 'white',
    borderRadius: '12px',
    width: '600px',
    maxWidth: '90%',
    maxHeight: '90%',
    overflow: 'auto',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 24px',
    borderBottom: '1px solid #e9ecef',
  },
  modalCerrar: {
    background: 'none',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
    color: '#868e96',
  },
  formulario: {
    padding: '24px',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
    marginBottom: '20px',
  },
  formGrupo: {
    marginBottom: '20px',
  },
  formLabel: {
    display: 'block',
    marginBottom: '8px',
    fontSize: '14px',
    fontWeight: '500' as const,
    color: '#495057',
  },
  formInput: {
    width: '100%',
    padding: '10px 16px',
    border: '1px solid #dee2e6',
    borderRadius: '6px',
    fontSize: '14px',
  },
  formTextarea: {
    width: '100%',
    padding: '10px 16px',
    border: '1px solid #dee2e6',
    borderRadius: '6px',
    fontSize: '14px',
    fontFamily: 'inherit',
    resize: 'vertical' as const,
  },
  botonesForm: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    marginTop: '32px',
  },
  botonCancelar: {
    backgroundColor: 'transparent',
    color: '#495057',
    border: '1px solid #dee2e6',
    padding: '12px 24px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  botonGuardar: {
    backgroundColor: '#4dabf7',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600' as const,
  },
}

export default RegistroTransacciones