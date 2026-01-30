// src/components/Ocupacion/TablaOcupacion.tsx
interface OcupacionDato {
  apto: string
  empresa: string
  huesped: string
  status: string
  entrada: string
  salida: string
}

interface TablaOcupacionProps {
  datos: OcupacionDato[]
}

function TablaOcupacion({ datos }: TablaOcupacionProps) {
  const getColorFila = (status: string, salida: string) => {
    if (status === 'OCUPADA') {
      // Si sale hoy, destacar en naranja
      const hoy = '24/1' // Esto sería dinámico en producción
      if (salida === hoy) return '#fff3cd'
      return '#fff'
    }
    if (status === 'DISPONIBLE') return '#d1ecf1'
    if (status === 'MANTENIMIENTO') return '#f8d7da'
    return '#fff'
  }

  return (
    <div style={styles.contenedor}>
      <table style={styles.tabla}>
        <thead>
          <tr style={styles.filaHeader}>
            <th style={styles.celdaHeader}>EMPRESA</th>
            <th style={styles.celdaHeader}>APTO</th>
            <th style={styles.celdaHeader}>NOMBRE HUÉSPED</th>
            <th style={styles.celdaHeader}>STATUS</th>
            <th style={styles.celdaHeader}>ENTRADA</th>
            <th style={styles.celdaHeader}>SALIDA</th>
          </tr>
        </thead>
        <tbody>
          {datos.map((dato, index) => (
            <tr 
              key={index}
              style={{
                ...styles.fila,
                backgroundColor: getColorFila(dato.status, dato.salida),
              }}
            >
              <td style={styles.celda}>{dato.empresa || '-'}</td>
              <td style={styles.celdaApto}>{dato.apto}</td>
              <td style={styles.celda}>{dato.huesped || '-'}</td>
              <td style={styles.celda}>
                <span className={`estado-${dato.status.toLowerCase()}`}>
                  {dato.status}
                </span>
              </td>
              <td style={styles.celda}>{dato.entrada}</td>
              <td style={styles.celda}>{dato.salida || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const styles = {
  contenedor: {
    overflowX: 'auto' as const,
  },
  tabla: {
    width: '100%',
    borderCollapse: 'collapse' as const,
  },
  filaHeader: {
    backgroundColor: '#2c3e50',
  },
  celdaHeader: {
    padding: '12px 16px',
    textAlign: 'left' as const,
    color: 'white',
    fontSize: '12px',
    fontWeight: '600' as const,
    borderBottom: '2px solid #4a6572',
  },
  fila: {
    borderBottom: '1px solid #e9ecef',
    transition: 'background-color 0.2s',
  },
  celda: {
    padding: '10px 16px',
    fontSize: '13px',
    color: '#495057',
  },
  celdaApto: {
    padding: '10px 16px',
    fontSize: '13px',
    fontWeight: '600' as const,
    color: '#2c3e50',
  },
}

export default TablaOcupacion