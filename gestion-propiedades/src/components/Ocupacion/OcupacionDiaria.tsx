// src/components/Ocupacion/OcupacionDiaria.tsx - ATUALIZADO COM STORAGE
import { useState, useEffect } from 'react'
import { 
  obtenerOcupacion, 
  guardarOcupacion, 
  obtenerPropiedades,
  generarId 
} from '../../utils/storage'

function OcupacionDiaria() {
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0])
  const [ocupacion, setOcupacion] = useState<any[]>([])
  const [propiedades, setPropiedades] = useState<any[]>([])
  const [mostrarForm, setMostrarForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    propiedadId: '',
    estado: 'DISPONIBLE',
    huesped: '',
    entrada: '',
    salida: '',
    empresa: 'DIRECTA',
    precioNoche: '',
    pagado: false
  })

  useEffect(() => {
    cargarDatos()
  }, [fecha])

  const cargarDatos = () => {
    // USAR AS FUNÇÕES DO STORAGE
    const ocupacionData = obtenerOcupacion().filter(o => o.fecha === fecha)
    const propiedadesData = obtenerPropiedades()
    
    console.log('Ocupación cargada:', ocupacionData)
    console.log('Propiedades disponibles:', propiedadesData)
    
    setOcupacion(ocupacionData)
    setPropiedades(propiedadesData)
  }

  const empresas = ['DIRECTA', 'AIRBNB', 'LIMA', 'INSTAGRAM', 'RECEPCION']
  const estados = ['OCUPADA', 'DISPONIBLE', 'RESERVADA', 'MANTENIMIENTO']

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setFormData(prev => ({ ...prev, [name]: checked }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const propiedadSeleccionada = propiedades.find(p => p.id === formData.propiedadId)
    
    const nuevaOcupacion = {
      id: editingId || generarId(),
      fecha,
      propiedadId: formData.propiedadId,
      estado: formData.estado,
      huesped: formData.huesped,
      entrada: formData.entrada,
      salida: formData.salida,
      empresa: formData.empresa,
      precioNoche: formData.precioNoche || propiedadSeleccionada?.precioNoche || 0,
      pagado: formData.pagado,
      propiedadNumero: propiedadSeleccionada?.numero
    }

    let nuevaOcupacionLista
    if (editingId) {
      nuevaOcupacionLista = ocupacion.map(o => 
        o.id === editingId ? nuevaOcupacion : o
      )
    } else {
      nuevaOcupacionLista = [...ocupacion, nuevaOcupacion]
    }

    // USAR GUARDAR OCUPACION
    const todasOcupaciones = obtenerOcupacion()
    const otrasOcupaciones = todasOcupaciones.filter(o => o.fecha !== fecha)
    guardarOcupacion([...otrasOcupaciones, ...nuevaOcupacionLista])
    
    setOcupacion(nuevaOcupacionLista)
    setMostrarForm(false)
    resetForm()
  }

  const resetForm = () => {
    setFormData({
      propiedadId: '',
      estado: 'DISPONIBLE',
      huesped: '',
      entrada: '',
      salida: '',
      empresa: 'DIRECTA',
      precioNoche: '',
      pagado: false
    })
    setEditingId(null)
  }

  const handleEditar = (item: any) => {
    setFormData({
      propiedadId: item.propiedadId,
      estado: item.estado,
      huesped: item.huesped || '',
      entrada: item.entrada || '',
      salida: item.salida || '',
      empresa: item.empresa || 'DIRECTA',
      precioNoche: item.precioNoche?.toString() || '',
      pagado: item.pagado || false
    })
    setEditingId(item.id)
    setMostrarForm(true)
  }

  const handleEliminar = (id: string) => {
    if (window.confirm('¿Está seguro de eliminar este registro?')) {
      const nuevaOcupacion = ocupacion.filter(o => o.id !== id)
      
      // USAR GUARDAR OCUPACION
      const todasOcupaciones = obtenerOcupacion()
      const otrasOcupaciones = todasOcupaciones.filter(o => o.fecha !== fecha)
      guardarOcupacion([...otrasOcupaciones, ...nuevaOcupacion])
      
      setOcupacion(nuevaOcupacion)
    }
  }

  const propiedadesDisponibles = propiedades.filter(p => 
    !ocupacion.find(o => o.propiedadId === p.id && o.estado === 'OCUPADA')
  )

  const estadisticas = {
    total: ocupacion.length,
    ocupadas: ocupacion.filter(o => o.estado === 'OCUPADA').length,
    disponibles: ocupacion.filter(o => o.estado === 'DISPONIBLE').length,
    reservadas: ocupacion.filter(o => o.estado === 'RESERVADA').length,
    porcentajeOcupacion: ocupacion.length > 0 
      ? Math.round((ocupacion.filter(o => o.estado === 'OCUPADA').length / ocupacion.length) * 100)
      : 0
  }

  return (
    <div>
      <div style={styles.header}>
        <h2 style={styles.titulo}>Ocupación Diaria</h2>
        <div style={styles.controles}>
          <input
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            style={styles.inputFecha}
          />
          <button 
            style={styles.botonAccion}
            onClick={() => {
              resetForm()
              setMostrarForm(true)
            }}
          >
            + Nueva Ocupación
          </button>
          <button 
            style={styles.botonExportar}
            onClick={() => alert('Exportando a Excel...')}
          >
            📊 Exportar Excel
          </button>
        </div>
      </div>

      <div style={styles.estadisticas}>
        <div style={styles.estadistica}>
          <span style={styles.estadisticaLabel}>Total Propiedades</span>
          <span style={styles.estadisticaValor}>{ocupacion.length}</span>
        </div>
        <div style={styles.estadistica}>
          <span style={styles.estadisticaLabel}>Ocupadas</span>
          <span style={{...styles.estadisticaValor, color: '#c92a2a'}}>
            {estadisticas.ocupadas}
          </span>
        </div>
        <div style={styles.estadistica}>
          <span style={styles.estadisticaLabel}>Disponibles</span>
          <span style={{...styles.estadisticaValor, color: '#2b8a3e'}}>
            {estadisticas.disponibles}
          </span>
        </div>
        <div style={styles.estadistica}>
          <span style={styles.estadisticaLabel}>Ocupación</span>
          <span style={styles.estadisticaValor}>
            {estadisticas.porcentajeOcupacion}%
          </span>
        </div>
      </div>

      <div style={styles.tarjeta}>
        <div style={styles.filtros}>
          <select style={styles.filtro}>
            <option>Todas las empresas</option>
            {empresas.map(emp => (
              <option key={emp}>{emp}</option>
            ))}
          </select>
          <select style={styles.filtro}>
            <option>Todos los estados</option>
            {estados.map(est => (
              <option key={est}>{est}</option>
            ))}
          </select>
        </div>

        <table style={styles.tabla}>
          <thead>
            <tr>
              <th>APTO</th>
              <th>Huésped</th>
              <th>Estado</th>
              <th>Empresa</th>
              <th>Entrada</th>
              <th>Salida</th>
              <th>Precio/Noche</th>
              <th>Pagado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {ocupacion.map((item) => {
              const propiedad = propiedades.find(p => p.id === item.propiedadId)
              return (
                <tr key={item.id}>
                  <td style={styles.celdaDestacada}>{propiedad?.numero || 'N/A'}</td>
                  <td>{item.huesped || '-'}</td>
                  <td>
                    <span className={`estado-${item.estado.toLowerCase()}`}>
                      {item.estado}
                    </span>
                  </td>
                  <td>{item.empresa || '-'}</td>
                  <td>{item.entrada || '-'}</td>
                  <td>{item.salida || '-'}</td>
                  <td>Bs {item.precioNoche || 0}</td>
                  <td>
                    <span style={item.pagado ? styles.pagadoSi : styles.pagadoNo}>
                      {item.pagado ? 'Sí' : 'No'}
                    </span>
                  </td>
                  <td>
                    <button 
                      style={styles.botonAccionPeq}
                      onClick={() => handleEditar(item)}
                    >
                      Editar
                    </button>
                    <button 
                      style={styles.botonEliminarPeq}
                      onClick={() => handleEliminar(item.id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              )
            })}
            {ocupacion.length === 0 && (
              <tr>
                <td colSpan={9} style={styles.celdaVacia}>
                  No hay registros de ocupación para esta fecha
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
              <h3>{editingId ? 'Editar' : 'Nueva'} Ocupación</h3>
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
                  <label style={styles.formLabel}>Propiedad *</label>
                  <select
                    name="propiedadId"
                    value={formData.propiedadId}
                    onChange={handleInputChange}
                    style={styles.formInput}
                    required
                  >
                    <option value="">Seleccionar propiedad</option>
                    {propiedadesDisponibles.map(prop => (
                      <option key={prop.id} value={prop.id}>
                        APTO {prop.numero} - {prop.tipo}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div style={styles.formGrupo}>
                  <label style={styles.formLabel}>Estado *</label>
                  <select
                    name="estado"
                    value={formData.estado}
                    onChange={handleInputChange}
                    style={styles.formInput}
                    required
                  >
                    {estados.map(est => (
                      <option key={est} value={est}>{est}</option>
                    ))}
                  </select>
                </div>
                
                <div style={styles.formGrupo}>
                  <label style={styles.formLabel}>Huésped</label>
                  <input
                    type="text"
                    name="huesped"
                    value={formData.huesped}
                    onChange={handleInputChange}
                    style={styles.formInput}
                    placeholder="Nombre del huésped"
                  />
                </div>
                
                <div style={styles.formGrupo}>
                  <label style={styles.formLabel}>Empresa</label>
                  <select
                    name="empresa"
                    value={formData.empresa}
                    onChange={handleInputChange}
                    style={styles.formInput}
                  >
                    {empresas.map(emp => (
                      <option key={emp} value={emp}>{emp}</option>
                    ))}
                  </select>
                </div>
                
                <div style={styles.formGrupo}>
                  <label style={styles.formLabel}>Entrada (DD/MM)</label>
                  <input
                    type="text"
                    name="entrada"
                    value={formData.entrada}
                    onChange={handleInputChange}
                    style={styles.formInput}
                    placeholder="Ej: 25/1"
                  />
                </div>
                
                <div style={styles.formGrupo}>
                  <label style={styles.formLabel}>Salida (DD/MM)</label>
                  <input
                    type="text"
                    name="salida"
                    value={formData.salida}
                    onChange={handleInputChange}
                    style={styles.formInput}
                    placeholder="Ej: 27/1"
                  />
                </div>
                
                <div style={styles.formGrupo}>
                  <label style={styles.formLabel}>Precio/Noche (Bs)</label>
                  <input
                    type="number"
                    name="precioNoche"
                    value={formData.precioNoche}
                    onChange={handleInputChange}
                    style={styles.formInput}
                    min="0"
                  />
                </div>
                
                <div style={styles.formGrupo}>
                  <label style={styles.formLabel}>
                    <input
                      type="checkbox"
                      name="pagado"
                      checked={formData.pagado}
                      onChange={handleInputChange}
                      style={styles.checkbox}
                    />
                    Pagado
                  </label>
                </div>
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
                  {editingId ? 'Actualizar' : 'Guardar'} Ocupación
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
    gap: '12px',
    alignItems: 'center',
  },
  inputFecha: {
    padding: '10px 16px',
    border: '1px solid #dee2e6',
    borderRadius: '6px',
    fontSize: '14px',
  },
  botonAccion: {
    backgroundColor: '#4dabf7',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500' as const,
  },
  botonExportar: {
    backgroundColor: '#2b8a3e',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500' as const,
  },
  estadisticas: {
    display: 'flex',
    gap: '24px',
    marginBottom: '32px',
    padding: '20px',
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  estadistica: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    flex: 1,
  },
  estadisticaLabel: {
    fontSize: '12px',
    color: '#868e96',
    marginBottom: '4px',
  },
  estadisticaValor: {
    fontSize: '20px',
    fontWeight: '600' as const,
    color: '#2c3e50',
  },
  tarjeta: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  filtros: {
    display: 'flex',
    gap: '12px',
    marginBottom: '20px',
  },
  filtro: {
    padding: '10px 16px',
    border: '1px solid #dee2e6',
    borderRadius: '6px',
    backgroundColor: 'white',
    fontSize: '14px',
    minWidth: '180px',
  },
  tabla: {
    width: '100%',
    borderCollapse: 'collapse' as const,
  },
  celdaDestacada: {
    fontWeight: '600' as const,
    color: '#2c3e50',
    padding: '12px 16px',
  },
  pagadoSi: {
    color: '#2b8a3e',
    fontWeight: '600' as const,
  },
  pagadoNo: {
    color: '#c92a2a',
    fontWeight: '600' as const,
  },
  botonAccionPeq: {
    backgroundColor: '#4dabf7',
    color: 'white',
    border: 'none',
    padding: '6px 12px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
    marginRight: '8px',
  },
  botonEliminarPeq: {
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
    width: '800px',
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
    gridTemplateColumns: 'repeat(2, 1fr)',
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
  checkbox: {
    marginRight: '8px',
    cursor: 'pointer',
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

export default OcupacionDiaria