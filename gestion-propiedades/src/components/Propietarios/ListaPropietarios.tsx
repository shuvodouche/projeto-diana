// src/components/Propietarios/ListaPropietarios.tsx - VERSÃO CORRIGIDA
import { useState, useEffect } from 'react'
import { 
  obtenerPropietarios, 
  guardarPropietarios, 
  obtenerPropiedades,
  obtenerTransacciones,
  generarId 
} from '../../utils/storage'
import { 
  calcularTotalIngresos, 
  calcularTotalGastos, 
  calcularNetoPropietario,
  formatearMoneda 
} from '../../utils/calculos'

function ListaPropietarios() {
  const [mostrarForm, setMostrarForm] = useState(false)
  const [propietarios, setPropietarios] = useState<any[]>([])
  const [propiedades, setPropiedades] = useState<any[]>([])
  const [transacciones, setTransacciones] = useState<any[]>([])
  const [busqueda, setBusqueda] = useState('')

  const [formData, setFormData] = useState({
    id: '',
    nombre: '',
    telefono: '',
    email: '',
    porcentajeComision: '20',
    propiedadesAsignadas: [] as string[]
  })

  useEffect(() => {
    cargarDatos()
  }, [])

  const cargarDatos = () => {
    const propietariosData = obtenerPropietarios()
    const propiedadesData = obtenerPropiedades()
    const transaccionesData = obtenerTransacciones()
    
    setPropietarios(propietariosData)
    setPropiedades(propiedadesData)
    setTransacciones(transaccionesData)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleCheckboxChange = (propiedadId: string) => {
    setFormData(prev => {
      const nuevasPropiedades = prev.propiedadesAsignadas.includes(propiedadId)
        ? prev.propiedadesAsignadas.filter(id => id !== propiedadId)
        : [...prev.propiedadesAsignadas, propiedadId]
      
      return { ...prev, propiedadesAsignadas: nuevasPropiedades }
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const nuevoPropietario = {
      id: formData.id || generarId(),
      nombre: formData.nombre,
      telefono: formData.telefono,
      email: formData.email,
      porcentajeComision: Number(formData.porcentajeComision)
    }

    let nuevosPropietarios
    if (formData.id) {
      nuevosPropietarios = propietarios.map(p => 
        p.id === formData.id ? nuevoPropietario : p
      )
    } else {
      nuevosPropietarios = [...propietarios, nuevoPropietario]
    }

    // Actualizar propiedades con el nuevo propietario
    if (formData.propiedadesAsignadas.length > 0) {
      const nuevasPropiedades = propiedades.map(prop => {
        if (formData.propiedadesAsignadas.includes(prop.id)) {
          return { ...prop, propietarioId: nuevoPropietario.id }
        }
        return prop
      })
      
      // Guardar propiedades actualizadas
      localStorage.setItem('gestor_propiedades', JSON.stringify(nuevasPropiedades))
      setPropiedades(nuevasPropiedades)
    }

    guardarPropietarios(nuevosPropietarios)
    setPropietarios(nuevosPropietarios)
    setMostrarForm(false)
    resetForm()
  }

  const resetForm = () => {
    setFormData({
      id: '',
      nombre: '',
      telefono: '',
      email: '',
      porcentajeComision: '20',
      propiedadesAsignadas: []
    })
  }

  const handleEditar = (propietario: any) => {
    const propiedadesDelPropietario = propiedades
      .filter(p => p.propietarioId === propietario.id)
      .map(p => p.id)

    setFormData({
      id: propietario.id,
      nombre: propietario.nombre,
      telefono: propietario.telefono,
      email: propietario.email,
      porcentajeComision: propietario.porcentajeComision.toString(),
      propiedadesAsignadas: propiedadesDelPropietario
    })
    setMostrarForm(true)
  }

  const handleEliminar = (id: string) => {
    if (window.confirm('¿Está seguro de eliminar este propietario?\nSus propiedades quedarán sin propietario asignado.')) {
      const nuevosPropietarios = propietarios.filter(p => p.id !== id)
      guardarPropietarios(nuevosPropietarios)
      setPropietarios(nuevosPropietarios)
    }
  }

  // Calcular estadísticas para cada propietario
  const calcularEstadisticasPropietario = (propietarioId: string) => {
    const propiedadesPropietario = propiedades.filter(p => p.propietarioId === propietarioId)
    
    // Usar las propiedades del propietario para calcular
    let totalIngresos = 0
    let totalGastos = 0
    
    propiedadesPropietario.forEach(prop => {
      const transaccionesMes = transacciones.filter(t => 
        t.fecha.startsWith('2026-01') && // Mes actual
        (t.propiedadId === prop.id || t.propiedadId === 'all')
      )
      
      totalIngresos += calcularTotalIngresos(transaccionesMes.filter(t => t.propiedadId === prop.id))
      totalGastos += calcularTotalGastos(transaccionesMes)
    })
    
    const neto = calcularNetoPropietario(totalIngresos, totalGastos, 20)
    
    return {
      propiedadesCount: propiedadesPropietario.length,
      ingresos: totalIngresos,
      gastos: totalGastos,
      neto,
      propiedades: propiedadesPropietario
    }
  }

  // Filtrar propietarios
  const propietariosFiltrados = propietarios.filter(prop => {
    if (!busqueda) return true
    const busquedaLower = busqueda.toLowerCase()
    return (
      prop.nombre.toLowerCase().includes(busquedaLower) ||
      prop.telefono.toLowerCase().includes(busquedaLower) ||
      prop.email.toLowerCase().includes(busquedaLower)
    )
  })

  // Estadísticas generales
  const transaccionesMes = transacciones.filter(t => t.fecha.startsWith('2026-01'))
  const estadisticasGenerales = {
    totalPropietarios: propietarios.length,
    totalPropiedades: propiedades.length,
    totalIngresos: calcularTotalIngresos(transaccionesMes),
    totalGastos: calcularTotalGastos(transaccionesMes),
    netoTotal: calcularNetoPropietario(
      calcularTotalIngresos(transaccionesMes),
      calcularTotalGastos(transaccionesMes),
      20
    )
  }

  return (
    <div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px',
      }}>
        <h2 style={{
          fontSize: '24px',
          fontWeight: '600',
          color: '#2c3e50',
        }}>Propietarios</h2>
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
          onClick={() => {
            resetForm()
            setMostrarForm(true)
          }}
        >
          + Agregar Propietario
        </button>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        marginBottom: '32px',
      }}>
        <div style={{
          backgroundColor: '#fff',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          textAlign: 'center',
        }}>
          <span style={{
            display: 'block',
            fontSize: '12px',
            color: '#868e96',
            marginBottom: '8px',
          }}>Total Propietarios</span>
          <span style={{
            fontSize: '24px',
            fontWeight: '600',
            color: '#2c3e50',
          }}>{estadisticasGenerales.totalPropietarios}</span>
        </div>
        <div style={{
          backgroundColor: '#fff',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          textAlign: 'center',
        }}>
          <span style={{
            display: 'block',
            fontSize: '12px',
            color: '#868e96',
            marginBottom: '8px',
          }}>Total Propiedades</span>
          <span style={{
            fontSize: '24px',
            fontWeight: '600',
            color: '#2c3e50',
          }}>{estadisticasGenerales.totalPropiedades}</span>
        </div>
        <div style={{
          backgroundColor: '#fff',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          textAlign: 'center',
        }}>
          <span style={{
            display: 'block',
            fontSize: '12px',
            color: '#868e96',
            marginBottom: '8px',
          }}>Ingresos Enero</span>
          <span style={{
            fontSize: '24px',
            fontWeight: '600',
            color: '#2c3e50',
          }}>{formatearMoneda(estadisticasGenerales.totalIngresos)}</span>
        </div>
        <div style={{
          backgroundColor: '#fff',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          textAlign: 'center',
        }}>
          <span style={{
            display: 'block',
            fontSize: '12px',
            color: '#868e96',
            marginBottom: '8px',
          }}>Total a pagar</span>
          <span style={{
            fontSize: '24px',
            fontWeight: '600',
            color: '#2c3e50',
          }}>
            {formatearMoneda(estadisticasGenerales.netoTotal)}
          </span>
        </div>
      </div>

      <div style={{ marginTop: '32px' }}>
        <div style={{
          display: 'flex',
          gap: '12px',
          marginBottom: '20px',
        }}>
          <input
            type="text"
            placeholder="Buscar propietario por nombre, teléfono o email..."
            style={{
              flex: 1,
              padding: '10px 16px',
              border: '1px solid #dee2e6',
              borderRadius: '6px',
              fontSize: '14px',
            }}
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        <div style={{
          backgroundColor: '#fff',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          overflowX: 'auto',
        }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
          }}>
            <thead>
              <tr>
                <th style={{ padding: '12px 16px', textAlign: 'left', backgroundColor: '#f8f9fa' }}>Propietario</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', backgroundColor: '#f8f9fa' }}>Contacto</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', backgroundColor: '#f8f9fa' }}>Propiedades</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', backgroundColor: '#f8f9fa' }}>Comisión</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', backgroundColor: '#f8f9fa' }}>Ingresos Enero</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', backgroundColor: '#f8f9fa' }}>Neto a Pagar</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', backgroundColor: '#f8f9fa' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {propietariosFiltrados.map((prop) => {
                const stats = calcularEstadisticasPropietario(prop.id)
                const propiedadesDelPropietario = propiedades.filter(p => p.propietarioId === prop.id)
                
                return (
                  <tr key={prop.id}>
                    <td style={{ padding: '16px', borderBottom: '1px solid #e9ecef' }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                      }}>
                        <div style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          backgroundColor: '#4dabf7',
                          color: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: '600',
                          fontSize: '16px',
                        }}>
                          {prop.nombre.charAt(0)}
                        </div>
                        <div>
                          <div style={{
                            fontWeight: '600',
                            color: '#2c3e50',
                            marginBottom: '4px',
                          }}>{prop.nombre}</div>
                          <div style={{
                            fontSize: '11px',
                            color: '#868e96',
                          }}>ID: {prop.id}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '16px', borderBottom: '1px solid #e9ecef' }}>
                      <div style={{
                        fontSize: '14px',
                      }}>
                        <div style={{
                          color: '#495057',
                          marginBottom: '4px',
                        }}>{prop.telefono}</div>
                        <div style={{
                          color: '#868e96',
                          fontSize: '12px',
                        }}>{prop.email}</div>
                      </div>
                    </td>
                    <td style={{ padding: '16px', borderBottom: '1px solid #e9ecef' }}>
                      <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '4px',
                        maxWidth: '200px',
                      }}>
                        {propiedadesDelPropietario.slice(0, 3).map((apto, idx) => (
                          <span key={idx} style={{
                            backgroundColor: '#e7f5ff',
                            color: '#1971c2',
                            padding: '2px 8px',
                            borderRadius: '4px',
                            fontSize: '11px',
                            fontWeight: '500',
                          }}>APTO {apto.numero}</span>
                        ))}
                        {propiedadesDelPropietario.length > 3 && (
                          <span style={{
                            fontSize: '11px',
                            color: '#868e96',
                            fontStyle: 'italic',
                          }}>+{propiedadesDelPropietario.length - 3} más</span>
                        )}
                        {propiedadesDelPropietario.length === 0 && (
                          <span style={{
                            fontSize: '11px',
                            color: '#868e96',
                            fontStyle: 'italic',
                          }}>Sin propiedades</span>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: '16px', borderBottom: '1px solid #e9ecef' }}>
                      <span style={{
                        backgroundColor: '#d3f9d8',
                        color: '#2b8a3e',
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '600',
                      }}>
                        {prop.porcentajeComision}%
                      </span>
                    </td>
                    <td style={{ padding: '16px', borderBottom: '1px solid #e9ecef' }}>
                      <div style={{
                        textAlign: 'right',
                      }}>
                        <div style={{
                          fontSize: '16px',
                          fontWeight: '600',
                          color: '#2c3e50',
                        }}>{formatearMoneda(stats.ingresos)}</div>
                        <div style={{
                          fontSize: '11px',
                          color: '#868e96',
                          marginBottom: '4px',
                        }}>{stats.propiedadesCount} propiedades</div>
                      </div>
                    </td>
                    <td style={{ padding: '16px', borderBottom: '1px solid #e9ecef' }}>
                      <div style={{
                        textAlign: 'right',
                      }}>
                        <div style={{
                          fontSize: '16px',
                          fontWeight: '600',
                          color: stats.neto >= 0 ? '#2b8a3e' : '#c92a2a',
                        }}>
                          {formatearMoneda(stats.neto)}
                        </div>
                        <div style={{
                          fontSize: '11px',
                          color: '#868e96',
                          marginBottom: '4px',
                        }}>Pendiente</div>
                      </div>
                    </td>
                    <td style={{ padding: '16px', borderBottom: '1px solid #e9ecef' }}>
                      <div style={{
                        display: 'flex',
                        gap: '8px',
                      }}>
                        <button 
                          style={{
                            backgroundColor: '#4dabf7',
                            color: 'white',
                            border: 'none',
                            padding: '6px 12px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '12px',
                          }}
                          onClick={() => handleEditar(prop)}
                        >
                          Editar
                        </button>
                        <button 
                          style={{
                            backgroundColor: '#40c057',
                            color: 'white',
                            border: 'none',
                            padding: '6px 12px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '12px',
                            margin: '0 4px',
                          }}
                          onClick={() => {
                            alert(`Generando reporte para ${prop.nombre}...`)
                          }}
                        >
                          Reporte
                        </button>
                        <button 
                          style={{
                            backgroundColor: '#fa5252',
                            color: 'white',
                            border: 'none',
                            padding: '6px 12px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '12px',
                          }}
                          onClick={() => handleEliminar(prop.id)}
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
              {propietariosFiltrados.length === 0 && (
                <tr>
                  <td colSpan={7} style={{
                    padding: '40px',
                    textAlign: 'center',
                    color: '#868e96',
                    fontSize: '14px',
                  }}>
                    {busqueda ? 'No hay propietarios que coincidan con la búsqueda' : 'No hay propietarios registrados'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {mostrarForm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            width: '600px',
            maxWidth: '90%',
            maxHeight: '90%',
            overflow: 'auto',
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '20px 24px',
              borderBottom: '1px solid #e9ecef',
            }}>
              <h3>{formData.id ? 'Editar' : 'Nuevo'} Propietario</h3>
              <button 
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: '#868e96',
                }}
                onClick={() => setMostrarForm(false)}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '20px',
                marginBottom: '20px',
              }}>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#495057',
                  }}>Nombre Completo *</label>
                  <input 
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '10px 16px',
                      border: '1px solid #dee2e6',
                      borderRadius: '6px',
                      fontSize: '14px',
                    }}
                    required
                  />
                </div>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#495057',
                  }}>Teléfono *</label>
                  <input 
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '10px 16px',
                      border: '1px solid #dee2e6',
                      borderRadius: '6px',
                      fontSize: '14px',
                    }}
                    required
                  />
                </div>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#495057',
                  }}>Email</label>
                  <input 
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '10px 16px',
                      border: '1px solid #dee2e6',
                      borderRadius: '6px',
                      fontSize: '14px',
                    }}
                  />
                </div>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#495057',
                  }}>% Comisión *</label>
                  <input 
                    type="number"
                    name="porcentajeComision"
                    value={formData.porcentajeComision}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '10px 16px',
                      border: '1px solid #dee2e6',
                      borderRadius: '6px',
                      fontSize: '14px',
                    }}
                    min="0"
                    max="100"
                    required
                  />
                </div>
              </div>
              
              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#495057',
                }}>Propiedades Asignadas</label>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: '8px',
                  padding: '16px',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '6px',
                  maxHeight: '200px',
                  overflowY: 'auto',
                }}>
                  {propiedades.map(prop => (
                    <label key={prop.id} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '13px',
                      color: '#495057',
                      cursor: 'pointer',
                    }}>
                      <input 
                        type="checkbox" 
                        checked={formData.propiedadesAsignadas.includes(prop.id)}
                        onChange={() => handleCheckboxChange(prop.id)}
                        style={{ cursor: 'pointer' }}
                      />
                      <span>APTO {prop.numero} - {prop.tipo}</span>
                    </label>
                  ))}
                  {propiedades.length === 0 && (
                    <div style={{
                      padding: '20px',
                      textAlign: 'center',
                      color: '#868e96',
                      fontSize: '14px',
                      fontStyle: 'italic',
                    }}>
                      No hay propiedades registradas. Agrega propiedades primero.
                    </div>
                  )}
                </div>
              </div>
              
              <div style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '12px',
                marginTop: '32px',
              }}>
                <button 
                  type="button" 
                  style={{
                    backgroundColor: 'transparent',
                    color: '#495057',
                    border: '1px solid #dee2e6',
                    padding: '12px 24px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                  }}
                  onClick={() => setMostrarForm(false)}
                >
                  Cancelar
                </button>
                <button type="submit" style={{
                  backgroundColor: '#4dabf7',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                }}>
                  {formData.id ? 'Actualizar' : 'Guardar'} Propietario
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default ListaPropietarios