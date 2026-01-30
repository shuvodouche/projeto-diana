// src/components/Propiedades/ListaPropiedades.tsx - FORMULÁRIO COMPLETO
import { useState, useEffect } from 'react'
import { obtenerPropiedades, guardarPropiedades, generarId } from '../../utils/storage'

function ListaPropiedades() {
  const [mostrarForm, setMostrarForm] = useState(false)
  const [propiedades, setPropiedades] = useState<any[]>([])
  const [busqueda, setBusqueda] = useState('')

  // Datos iniciales para cuando no hay datos en storage
  const propiedadesIniciales = [
    {
      id: '1',
      numero: '204',
      nombre: 'SUITE DUPLEX',
      tipo: 'SUITE DUPLEX',
      direccion: 'Torre Lima, Piso 2',
      precioNoche: 180,
      costoLimpeza: 30,
      costoInternet: 40,
      costoMantenimiento: 0,
      tieneWifi: true,
      tieneAireAcondicionado: true,
      tieneCocina: true,
      capacidadPersonas: 4,
      descripcion: 'Suite dúplex con dos niveles, ideal para familias',
      estado: 'ACTIVO'
    },
    {
      id: '2',
      numero: '105',
      nombre: 'SUITE FAMILIAR JR',
      tipo: 'SUITE FAMILIAR JR',
      direccion: 'Edificio Principal',
      precioNoche: 220,
      costoLimpeza: 30,
      costoInternet: 40,
      costoMantenimiento: 0,
      tieneWifi: true,
      tieneAireAcondicionado: true,
      tieneCocina: true,
      capacidadPersonas: 6,
      descripcion: 'Suite familiar con espacio amplio',
      estado: 'ACTIVO'
    },
    {
      id: '3',
      numero: '101',
      nombre: 'SUITE ESTANDAR',
      tipo: 'SUITE ESTANDAR',
      direccion: 'Piso 1',
      precioNoche: 150,
      costoLimpeza: 30,
      costoInternet: 40,
      costoMantenimiento: 0,
      tieneWifi: true,
      tieneAireAcondicionado: true,
      tieneCocina: false,
      capacidadPersonas: 2,
      descripcion: 'Suite estándar con todas las comodidades',
      estado: 'ACTIVO'
    },
    {
      id: '4',
      numero: '302',
      nombre: 'SMARTSTUDIO YOU',
      tipo: 'SMARTSTUDIO YOU',
      direccion: 'Edificio Smart',
      precioNoche: 140,
      costoLimpeza: 30,
      costoInternet: 40,
      costoMantenimiento: 0,
      tieneWifi: true,
      tieneAireAcondicionado: true,
      tieneCocina: true,
      capacidadPersonas: 2,
      descripcion: 'Estudio inteligente moderno',
      estado: 'ACTIVO'
    },
  ]

  useEffect(() => {
    // USAR A FUNÇÃO DO STORAGE
    const datos = obtenerPropiedades()
    console.log('Propiedades cargadas desde storage:', datos)
    
    if (datos && datos.length > 0) {
      setPropiedades(datos)
    } else {
      // Si no hay datos en storage, usar los iniciales y guardarlos
      setPropiedades(propiedadesIniciales)
      guardarPropiedades(propiedadesIniciales)
    }
  }, [])

  // ATUALIZAR formData com todos os campos
  const [formData, setFormData] = useState({
    id: '',
    numero: '',
    nombre: '',
    tipo: 'SUITE ESTANDAR',
    direccion: '',
    precioNoche: '',
    costoLimpeza: '30', // Campo NOVO
    costoInternet: '40', // Campo NOVO
    costoMantenimiento: '0', // Campo NOVO
    tieneWifi: true, // Campo NOVO
    tieneAireAcondicionado: true, // Campo NOVO
    tieneCocina: false, // Campo NOVO
    capacidadPersonas: '2', // Campo NOVO
    descripcion: '', // Campo NOVO
    estado: 'ACTIVO'
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // ATUALIZAR objeto com todos os campos
    const nuevaPropiedad = {
      id: formData.id || generarId(),
      numero: formData.numero,
      nombre: formData.nombre,
      tipo: formData.tipo,
      direccion: formData.direccion,
      precioNoche: Number(formData.precioNoche),
      costoLimpeza: Number(formData.costoLimpeza),
      costoInternet: Number(formData.costoInternet),
      costoMantenimiento: Number(formData.costoMantenimiento),
      tieneWifi: formData.tieneWifi,
      tieneAireAcondicionado: formData.tieneAireAcondicionado,
      tieneCocina: formData.tieneCocina,
      capacidadPersonas: Number(formData.capacidadPersonas),
      descripcion: formData.descripcion,
      propietarioId: '1',
      estado: formData.estado
    }

    let nuevasPropiedades
    if (formData.id) {
      // Editar propiedad existente
      nuevasPropiedades = propiedades.map(p => 
        p.id === formData.id ? nuevaPropiedad : p
      )
    } else {
      // Agregar nueva propiedad
      nuevasPropiedades = [...propiedades, nuevaPropiedad]
    }

    // USAR GUARDAR PROPIEDADES DEL STORAGE
    guardarPropiedades(nuevasPropiedades)
    setPropiedades(nuevasPropiedades)
    setMostrarForm(false)
    setFormData({
      id: '',
      numero: '',
      nombre: '',
      tipo: 'SUITE ESTANDAR',
      direccion: '',
      precioNoche: '',
      costoLimpeza: '30',
      costoInternet: '40',
      costoMantenimiento: '0',
      tieneWifi: true,
      tieneAireAcondicionado: true,
      tieneCocina: false,
      capacidadPersonas: '2',
      descripcion: '',
      estado: 'ACTIVO'
    })
  }

  const handleEditar = (propiedad: any) => {
    setFormData({
      id: propiedad.id,
      numero: propiedad.numero,
      nombre: propiedad.nombre,
      tipo: propiedad.tipo,
      direccion: propiedad.direccion,
      precioNoche: propiedad.precioNoche.toString(),
      costoLimpeza: (propiedad.costoLimpeza || 30).toString(),
      costoInternet: (propiedad.costoInternet || 40).toString(),
      costoMantenimiento: (propiedad.costoMantenimiento || 0).toString(),
      tieneWifi: propiedad.tieneWifi !== undefined ? propiedad.tieneWifi : true,
      tieneAireAcondicionado: propiedad.tieneAireAcondicionado !== undefined ? propiedad.tieneAireAcondicionado : true,
      tieneCocina: propiedad.tieneCocina !== undefined ? propiedad.tieneCocina : false,
      capacidadPersonas: (propiedad.capacidadPersonas || 2).toString(),
      descripcion: propiedad.descripcion || '',
      estado: propiedad.estado || 'ACTIVO'
    })
    setMostrarForm(true)
  }

  const handleEliminar = (id: string) => {
    if (window.confirm('¿Está seguro de eliminar esta propiedad?')) {
      const nuevasPropiedades = propiedades.filter(p => p.id !== id)
      // USAR GUARDAR PROPIEDADES DEL STORAGE
      guardarPropiedades(nuevasPropiedades)
      setPropiedades(nuevasPropiedades)
    }
  }

  // Filtro de búsqueda FUNCIONAL
  const propiedadesFiltradas = propiedades.filter(prop => {
    if (!busqueda) return true
    
    const busquedaLower = busqueda.toLowerCase()
    return (
      prop.numero.toLowerCase().includes(busquedaLower) ||
      prop.nombre.toLowerCase().includes(busquedaLower) ||
      prop.tipo.toLowerCase().includes(busquedaLower) ||
      prop.direccion.toLowerCase().includes(busquedaLower) ||
      (prop.descripcion && prop.descripcion.toLowerCase().includes(busquedaLower))
    )
  })

  return (
    <div>
      <div style={styles.header}>
        <h2 style={styles.titulo}>Propiedades ({propiedades.length})</h2>
        <button 
          style={styles.botonAgregar}
          onClick={() => {
            setFormData({
              id: '',
              numero: '',
              nombre: '',
              tipo: 'SUITE ESTANDAR',
              direccion: '',
              precioNoche: '',
              costoLimpeza: '30',
              costoInternet: '40',
              costoMantenimiento: '0',
              tieneWifi: true,
              tieneAireAcondicionado: true,
              tieneCocina: false,
              capacidadPersonas: '2',
              descripcion: '',
              estado: 'ACTIVO'
            })
            setMostrarForm(true)
          }}
        >
          + Agregar Propiedad
        </button>
      </div>

      <div style={styles.tarjeta}>
        <div style={styles.filtros}>
          <input
            type="text"
            placeholder="Buscar por número, nombre, tipo, dirección o descripción..."
            style={styles.buscador}
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        <table style={styles.tabla}>
          <thead>
            <tr>
              <th>APTO</th>
              <th>Nombre</th>
              <th>Tipo</th>
              <th>Dirección</th>
              <th>Precio/Noche</th>
              <th>Capacidad</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {propiedadesFiltradas.map((prop) => (
              <tr key={prop.id}>
                <td style={styles.celdaDestacada}>{prop.numero}</td>
                <td>{prop.nombre}</td>
                <td>{prop.tipo}</td>
                <td>{prop.direccion}</td>
                <td>Bs {prop.precioNoche}</td>
                <td>{prop.capacidadPersonas || 2} pers.</td>
                <td>
                  <span className={`estado-${prop.estado.toLowerCase()}`}>
                    {prop.estado}
                  </span>
                </td>
                <td>
                  <button 
                    style={styles.botonAccion}
                    onClick={() => handleEditar(prop)}
                  >
                    Editar
                  </button>
                  <button 
                    style={styles.botonEliminar}
                    onClick={() => handleEliminar(prop.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
            {propiedadesFiltradas.length === 0 && (
              <tr>
                <td colSpan={8} style={styles.celdaVacia}>
                  {busqueda ? 'No hay propiedades que coincidan con la búsqueda' : 'No hay propiedades registradas'}
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
              <h3>{formData.id ? 'Editar' : 'Nueva'} Propiedad</h3>
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
                  <label style={styles.formLabel}>Número de APTO *</label>
                  <input 
                    name="numero"
                    value={formData.numero}
                    onChange={handleInputChange}
                    style={styles.formInput}
                    required
                  />
                </div>
                <div style={styles.formGrupo}>
                  <label style={styles.formLabel}>Nombre *</label>
                  <input 
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    style={styles.formInput}
                    required
                  />
                </div>
                <div style={styles.formGrupo}>
                  <label style={styles.formLabel}>Tipo *</label>
                  <select 
                    name="tipo"
                    value={formData.tipo}
                    onChange={handleInputChange}
                    style={styles.formInput}
                    required
                  >
                    <option value="SUITE ESTANDAR">SUITE ESTANDAR</option>
                    <option value="SUITE DUPLEX">SUITE DUPLEX</option>
                    <option value="SUITE FAMILIAR JR">SUITE FAMILIAR JR</option>
                    <option value="SMARTSTUDIO YOU">SMARTSTUDIO YOU</option>
                    <option value="TOBOROCHI">TOBOROCHI</option>
                    <option value="ONIX ART">ONIX ART</option>
                  </select>
                </div>
                <div style={styles.formGrupo}>
                  <label style={styles.formLabel}>Dirección</label>
                  <input 
                    name="direccion"
                    value={formData.direccion}
                    onChange={handleInputChange}
                    style={styles.formInput}
                  />
                </div>
                <div style={styles.formGrupo}>
                  <label style={styles.formLabel}>Precio por Noche (Bs) *</label>
                  <input 
                    type="number"
                    name="precioNoche"
                    value={formData.precioNoche}
                    onChange={handleInputChange}
                    style={styles.formInput}
                    required
                    min="0"
                  />
                </div>
                
                {/* NOVOS CAMPOS ADICIONADOS */}
                <div style={styles.formGrupo}>
                  <label style={styles.formLabel}>Costo Limpieza (Bs) *</label>
                  <input 
                    type="number"
                    name="costoLimpeza"
                    value={formData.costoLimpeza}
                    onChange={handleInputChange}
                    style={styles.formInput}
                    required
                    min="0"
                  />
                </div>
                
                <div style={styles.formGrupo}>
                  <label style={styles.formLabel}>Costo Internet (Bs) *</label>
                  <input 
                    type="number"
                    name="costoInternet"
                    value={formData.costoInternet}
                    onChange={handleInputChange}
                    style={styles.formInput}
                    required
                    min="0"
                  />
                </div>
                
                <div style={styles.formGrupo}>
                  <label style={styles.formLabel}>Costo Mantenimiento (Bs)</label>
                  <input 
                    type="number"
                    name="costoMantenimiento"
                    value={formData.costoMantenimiento}
                    onChange={handleInputChange}
                    style={styles.formInput}
                    min="0"
                  />
                </div>
                
                <div style={styles.formGrupo}>
                  <label style={styles.formLabel}>Capacidad (personas)</label>
                  <input 
                    type="number"
                    name="capacidadPersonas"
                    value={formData.capacidadPersonas}
                    onChange={handleInputChange}
                    style={styles.formInput}
                    min="1"
                  />
                </div>
                
                <div style={styles.formGrupo}>
                  <label style={styles.formLabel}>Estado</label>
                  <select 
                    name="estado"
                    value={formData.estado}
                    onChange={handleInputChange}
                    style={styles.formInput}
                  >
                    <option value="ACTIVO">ACTIVO</option>
                    <option value="INACTIVO">INACTIVO</option>
                    <option value="MANTENIMIENTO">MANTENIMIENTO</option>
                  </select>
                </div>
              </div>

              {/* CAMPOS DE CHECKBOX PARA SERVIÇOS */}
              <div style={styles.formGrupo}>
                <label style={styles.formLabel}>Servicios incluidos:</label>
                <div style={styles.checkboxGroup}>
                  <label style={styles.checkboxLabel}>
                    <input 
                      type="checkbox"
                      checked={formData.tieneWifi}
                      onChange={(e) => handleCheckboxChange('tieneWifi', e.target.checked)}
                      style={styles.checkbox}
                    />
                    <span>WiFi</span>
                  </label>
                  <label style={styles.checkboxLabel}>
                    <input 
                      type="checkbox"
                      checked={formData.tieneAireAcondicionado}
                      onChange={(e) => handleCheckboxChange('tieneAireAcondicionado', e.target.checked)}
                      style={styles.checkbox}
                    />
                    <span>Aire Acondicionado</span>
                  </label>
                  <label style={styles.checkboxLabel}>
                    <input 
                      type="checkbox"
                      checked={formData.tieneCocina}
                      onChange={(e) => handleCheckboxChange('tieneCocina', e.target.checked)}
                      style={styles.checkbox}
                    />
                    <span>Cocina</span>
                  </label>
                </div>
              </div>

              {/* CAMPO DE DESCRIÇÃO */}
              <div style={styles.formGrupo}>
                <label style={styles.formLabel}>Descripción</label>
                <textarea
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleInputChange}
                  style={styles.formTextarea}
                  placeholder="Descripción del apartamento, características, comodidades, etc."
                  rows={3}
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
                  {formData.id ? 'Actualizar' : 'Guardar'} Propiedad
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
  botonAgregar: {
    backgroundColor: '#4dabf7',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600' as const,
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
  buscador: {
    flex: 1,
    padding: '10px 16px',
    border: '1px solid #dee2e6',
    borderRadius: '6px',
    fontSize: '14px',
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
    width: '700px',
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
  checkboxGroup: {
    display: 'flex',
    gap: '20px',
    flexWrap: 'wrap' as const,
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    color: '#495057',
  },
  checkbox: {
    margin: 0,
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

export default ListaPropiedades