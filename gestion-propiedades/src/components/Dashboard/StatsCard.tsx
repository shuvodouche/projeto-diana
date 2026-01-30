// src/components/Dashboard/StatsCard.tsx
interface StatsCardProps {
  titulo: string
  valor: string
  cambio: string
  color: 'verde' | 'azul' | 'naranja' | 'morado' | 'rojo'
  icono: string
}

function StatsCard({ titulo, valor, cambio, color, icono }: StatsCardProps) {
  const colores = {
    verde: { bg: '#d3f9d8', text: '#2b8a3e' },
    azul: { bg: '#e7f5ff', text: '#1971c2' },
    naranja: { bg: '#fff4e6', text: '#e8590c' },
    morado: { bg: '#f3f0ff', text: '#5f3dc4' },
    rojo: { bg: '#ffe3e3', text: '#c92a2a' },
  }

  const colorConfig = colores[color]

  return (
    <div style={{
      backgroundColor: '#fff',
      borderRadius: '12px',
      padding: '20px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '12px',
      }}>
        <div>
          <div style={{
            fontSize: '12px',
            color: '#868e96',
            marginBottom: '8px',
          }}>
            {titulo}
          </div>
          <div style={{
            fontSize: '24px',
            fontWeight: '600' as const,
            color: '#2c3e50',
          }}>
            {valor}
          </div>
        </div>
        <div style={{
          backgroundColor: colorConfig.bg,
          color: colorConfig.text,
          width: '48px',
          height: '48px',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24px',
        }}>
          {icono}
        </div>
      </div>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '12px',
      }}>
        <span style={{
          color: cambio.startsWith('+') ? '#2b8a3e' : '#c92a2a',
          fontWeight: '500' as const,
        }}>
          {cambio} vs mes pasado
        </span>
      </div>
    </div>
  )
}

export default StatsCard