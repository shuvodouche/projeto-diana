// src/components/Layout/Header.tsx
import { useState } from 'react'

interface HeaderProps {
  usuario?: any
  onLogout?: () => void
}

function Header({ usuario, onLogout }: HeaderProps) {
  const [showMenu, setShowMenu] = useState(false)

  return (
    <header style={styles.header}>
      <div style={styles.logoContainer}>
        <div style={styles.logo}>🏠</div>
        <h1 style={styles.titulo}>Gestión de Propiedades</h1>
      </div>
      
      <div style={styles.userInfo}>
        <div style={styles.userDetails}>
          <span style={styles.userName}>{usuario?.nombre || 'Usuario'}</span>
          <span style={styles.userRole}>Administrador</span>
        </div>
        
        <div 
          style={styles.userAvatar}
          onClick={() => setShowMenu(!showMenu)}
        >
          {usuario?.nombre?.charAt(0) || 'U'}
        </div>
        
        {showMenu && (
          <div style={styles.dropdownMenu}>
            <div style={styles.menuItem}>
              👤 {usuario?.nombre || 'Usuario'}
            </div>
            <div style={styles.menuItem}>
              ⚙️ Configuración
            </div>
            <div 
              style={styles.menuItemLogout}
              onClick={onLogout}
            >
              🚪 Salir
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 24px',
    height: '64px',
    backgroundColor: '#fff',
    borderBottom: '1px solid #e9ecef',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    position: 'relative' as const,
    zIndex: 100,
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  logo: {
    fontSize: '24px',
  },
  titulo: {
    fontSize: '20px',
    fontWeight: '600' as const,
    color: '#2c3e50',
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    position: 'relative' as const,
  },
  userDetails: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'flex-end',
  },
  userName: {
    fontSize: '14px',
    fontWeight: '600' as const,
    color: '#495057',
  },
  userRole: {
    fontSize: '12px',
    color: '#868e96',
  },
  userAvatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: '#4dabf7',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '600' as const,
    fontSize: '16px',
    cursor: 'pointer',
    userSelect: 'none' as const,
  },
  dropdownMenu: {
    position: 'absolute' as const,
    top: '50px',
    right: '0',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    minWidth: '200px',
    border: '1px solid #e9ecef',
    zIndex: 1000,
  },
  menuItem: {
    padding: '12px 16px',
    fontSize: '14px',
    color: '#495057',
    borderBottom: '1px solid #e9ecef',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  menuItemLogout: {
    padding: '12px 16px',
    fontSize: '14px',
    color: '#c92a2a',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
}

export default Header