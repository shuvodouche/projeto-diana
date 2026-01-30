// src/components/Transacciones/ListaTransacciones.tsx
import { useState } from 'react'

interface Transaccion {
  id: string
  fecha: string
  categoria: string
  propiedad: string
  monto: number
  descripcion: string
}

interface ListaTransaccionesProps {
  tipo: 'INGRESO' | 'GASTO'
}

function ListaTransacciones({ tipo }: ListaTransaccionesProps) {
  const [filtroMes, setFiltroMes] = useState('2026-01')

  const transaccionesIngreso: Transaccion[] = [
    { id: '1', fecha: '23/01/2026', categoria: 'ALOJAMIENTO', propiedad: '204', monto: 180, descripcion: 'Yhurgen Howard - 2 noches' },
    { id: '2', fecha: '23/01/2026', categoria: 'ALOJAMIENTO', propiedad: '101', monto: 150, descripcion: 'Mejia Gutierrez' },
    { id: '3', fecha: '23/01/2026', categoria: 'ALOJAMIENTO', propiedad: '106', monto: 150, descripcion: 'Alexander Arrasola' },
    { id: '4', fecha: '23/01/2026', categoria: 'ALOJAMIENTO', propiedad: '109', monto: 150, descripcion: 'Ana Lizette - 3 noches' },
    { id: '5', fecha: '23/01/2026', categoria: 'ALOJAMIENTO', propiedad: '302', monto: 140, descripcion: 'Airbnb - 6 noches' },
  ]

  const transaccionesGasto: Transaccion[] = [
    { id: '6', fecha: '23/01/2026', categoria: 'LIMPIEZA', propiedad: '204', monto: 30, descripcion: 'Limpieza post salida' },
    { id: '7', fecha: '23/01/2026', categoria: 'INTERNET', propiedad: 'TODAS', monto: 120, descripcion: 'Factura mensual internet' },
    { id: '8', fecha: '22/01/2026', categoria: 'MANTENIMIENTO', propiedad: '105', monto: 85, descripcion: 'Reparación aire acondicionado' },
    { id: '9', fecha: '21/01/2026', categoria: 'LIMPIEZA', propiedad: '101', monto: 30, descripcion: 'Limpieza diaria' },
    { id: '10', fecha: '20/01/2026', categoria: 'REPARACION', propiedad: '302', monto: 45, descripcion: 'Cambio de foco LED' },
  ]

  const transacciones = tipo === 'INGRESO' ? transaccionesIngreso : transaccionesGasto

  const total = transacciones.reduce((sum, t) => sum + t.monto, 0)

  return (
    <div style={styles.contenedor}>
      <div style={styles.filtros}>
        <select
          value={filtroMes}
          onChange={(e) => setFiltroMes(e.target.value)}
          style={styles.selectMes}
        >
          <option value="2026-01">Enero 2026</option>
          <option value="2025-12">Diciembre 2025</option>
          <option value="2025-11">Noviembre 2025</option>
        </select>
        <input
          type="text"
          placeholder="Buscar transacción..."
          style={styles.buscador}
        />
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
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {transacciones.map((t) => (
              <tr key={t.id}>
                <td style={styles.celda}>{t.fecha}</td>
                <td>
                  <span style={tipo === 'INGRESO' ? styles.badgeIngreso : styles.badgeGasto}>
                    {t.categoria}
                  </span>
                </td>
                <td style={styles.celda}>APTO {t.propiedad}</td>
                <td style={styles.celdaDescripcion}>{t.descripcion}</td>
                <td style={{
                  ...styles.celdaMonto,
                  color: tipo === 'INGRESO' ? '#2b8a3e' : '#c92a2a'
                }}>
                  {tipo === 'INGRESO' ? '+' : '-'} {t.monto.toFixed(2)}
                </td>
                <td>
                  <button style={styles.botonAccion}>Editar</button>
                  <button style={styles.botonAccionSecundario}>Ver</button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr style={styles.filaTotal}>
              <td colSpan={4} style={styles.celdaTotalLabel}>
                Total {tipo === 'INGRESO' ? 'Ingresos' : 'Gastos'} del mes:
              </td>
              <td colSpan={2} style={{
                ...styles.celdaTotal,
                color: tipo === 'INGRESO' ? '#2b8a3e' : '#c92a2a'
              }}>
                {tipo === 'INGRESO' ? '+' : '-'} {total.toFixed(2)} Bs
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  )
}

const styles = {
  contenedor: {
    marginBottom: '32px',
  },
  filtros: {
    display: 'flex',
    gap: '12px',
    marginBottom: '20px',
  },
  selectMes: {
    padding: '10px 16px',
    border: '1px solid #dee2e6',
    borderRadius: '6px',
    backgroundColor: 'white',
    fontSize: '14px',
    minWidth: '160px',
  },
  buscador: {
    flex: 1,
    padding: '10px 16px',
    border: '1px solid #dee2e6',
    borderRadius: '6px',
    fontSize: '14px',
  },
  tarjeta: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    overflowX: 'auto' as const,
  },
  tabla: {
    width: '100%',
    borderCollapse: 'collapse' as const,
  },
  celda: {
    padding: '12px 16px',
    fontSize: '14px',
    color: '#495057',
  },
  celdaDescripcion: {
    padding: '12px 16px',
    fontSize: '14px',
    color: '#495057',
    maxWidth: '300px',
    whiteSpace: 'nowrap' as const,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  celdaMonto: {
    padding: '12px 16px',
    fontSize: '14px',
    fontWeight: '600' as const,
  },
  badgeIngreso: {
    backgroundColor: '#d3f9d8',
    color: '#2b8a3e',
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '500' as const,
  },
  badgeGasto: {
    backgroundColor: '#ffe3e3',
    color: '#c92a2a',
    padding: '4px 12px',
    borderRadius: '20px',
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
  botonAccionSecundario: {
    backgroundColor: 'transparent',
    color: '#495057',
    border: '1px solid #dee2e6',
    padding: '6px 12px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
  },
  filaTotal: {
    backgroundColor: '#f8f9fa',
    borderTop: '2px solid #dee2e6',
  },
  celdaTotalLabel: {
    padding: '16px',
    fontSize: '14px',
    fontWeight: '600' as const,
    color: '#495057',
    textAlign: 'right' as const,
  },
  celdaTotal: {
    padding: '16px',
    fontSize: '16px',
    fontWeight: '600' as const,
  },
}

export default ListaTransacciones