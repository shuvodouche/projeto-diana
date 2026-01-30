// src/components/Layout/Sidebar.tsx
interface SidebarProps {
  menuActivo: string
  cambiarMenu: (menu: string) => void
}

function Sidebar({ menuActivo, cambiarMenu }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', icon: '📊', label: 'Dashboard' },
    { id: 'propiedades', icon: '🏠', label: 'Propiedades' },
    { id: 'ocupacion', icon: '📅', label: 'Ocupación Diaria' },
    { id: 'transacciones', icon: '💰', label: 'Transacciones' },
    { id: 'reportes', icon: '📋', label: 'Reportes' },
    { id: 'propietarios', icon: '👤', label: 'Propietarios' },
  ]

  return (
    <aside style={styles.sidebar}>
      <nav style={styles.nav}>
        {menuItems.map((item) => (
          <button
            key={item.id}
            style={{
              ...styles.menuItem,
              ...(menuActivo === item.id ? styles.menuItemActivo : {}),
            }}
            onClick={() => cambiarMenu(item.id)}
          >
            <span style={styles.menuIcon}>{item.icon}</span>
            <span style={styles.menuLabel}>{item.label}</span>
          </button>
        ))}
      </nav>
      
      <div style={styles.stats}>
        <div style={styles.statItem}>
          <span style={styles.statLabel}>Propiedades</span>
          <span style={styles.statValue}>30</span>
        </div>
        <div style={styles.statItem}>
          <span style={styles.statLabel}>Ocupación Hoy</span>
          <span style={styles.statValue}>85%</span>
        </div>
      </div>
    </aside>
  )
}

const styles = {
  sidebar: {
    width: '240px',
    backgroundColor: '#fff',
    borderRight: '1px solid #e9ecef',
    display: 'flex',
    flexDirection: 'column' as const,
    padding: '20px 0',
  },
  nav: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '4px',
    padding: '0 12px',
  },
  menuItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    border: 'none',
    backgroundColor: 'transparent',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    color: '#495057',
    transition: 'all 0.2s',
    textAlign: 'left' as const,
  },
  menuItemActivo: {
    backgroundColor: '#e7f5ff',
    color: '#1971c2',
    fontWeight: '600' as const,
  },
  menuIcon: {
    fontSize: '18px',
  },
  menuLabel: {
    flex: 1,
  },
  stats: {
    marginTop: 'auto',
    padding: '20px 16px',
    borderTop: '1px solid #e9ecef',
  },
  statItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  },
  statLabel: {
    fontSize: '12px',
    color: '#868e96',
  },
  statValue: {
    fontSize: '16px',
    fontWeight: '600' as const,
    color: '#2c3e50',
  },
}

export default Sidebar