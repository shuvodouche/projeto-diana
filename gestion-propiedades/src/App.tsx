// src/App.tsx - ADICIONE ESTE useEffect:
import { useState, useEffect } from 'react'
import Login from './components/Auth/Login'
import Header from './components/Layout/Header'
import Sidebar from './components/Layout/Sidebar'
import Dashboard from './components/Dashboard/Dashboard'
import ListaPropiedades from './components/Propiedades/ListaPropiedades'
import OcupacionDiaria from './components/Ocupacion/OcupacionDiaria'
import RegistroTransacciones from './components/Transacciones/RegistroTransacciones'
import GenerarReporte from './components/Reportes/GenerarReporte'
import ListaPropietarios from './components/Propietarios/ListaPropietarios'
import { inicializarDatos } from './utils/storage'

function App() {
  const [autenticado, setAutenticado] = useState(false)
  const [menuActivo, setMenuActivo] = useState('dashboard')
  const [usuarioActual, setUsuarioActual] = useState<any>(null)

  useEffect(() => {
    // INICIALIZAR DATOS SIEMPRE
    inicializarDatos()
    
    console.log('Datos inicializados:')
    console.log('Propiedades:', localStorage.getItem('gestor_propiedades'))
    console.log('Transacciones:', localStorage.getItem('gestor_transacciones'))
    
    // Verificar se há usuário logado
    const usuarioStorage = localStorage.getItem('gestor_usuario')
    if (usuarioStorage) {
      setUsuarioActual(JSON.parse(usuarioStorage))
      setAutenticado(true)
    }
  }, [])

  const handleLogin = () => {
    const usuarioStorage = localStorage.getItem('gestor_usuario')
    if (usuarioStorage) {
      setUsuarioActual(JSON.parse(usuarioStorage))
      setAutenticado(true)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('gestor_usuario')
    setAutenticado(false)
    setUsuarioActual(null)
    setMenuActivo('dashboard')
  }

  if (!autenticado) {
    return <Login onLogin={handleLogin} />
  }

  const renderContenido = () => {
    switch (menuActivo) {
      case 'dashboard':
        return <Dashboard />
      case 'propiedades':
        return <ListaPropiedades />
      case 'ocupacion':
        return <OcupacionDiaria />
      case 'transacciones':
        return <RegistroTransacciones />
      case 'reportes':
        return <GenerarReporte />
      case 'propietarios':
        return <ListaPropietarios />
      default:
        return <Dashboard />
    }
  }

  return (
    <div style={styles.app}>
      <Header usuario={usuarioActual} onLogout={handleLogout} />
      <div style={styles.contenedor}>
        <Sidebar menuActivo={menuActivo} cambiarMenu={setMenuActivo} />
        <main style={styles.main}>
          {renderContenido()}
        </main>
      </div>
    </div>
  )
}

const styles = {
  app: {
    display: 'flex',
    flexDirection: 'column' as const,
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  contenedor: {
    display: 'flex',
    flex: 1,
  },
  main: {
    flex: 1,
    padding: '20px',
    overflow: 'auto',
  },
}

export default App