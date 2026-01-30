// src/components/Auth/Login.tsx
import { useState } from 'react'

interface LoginProps {
  onLogin: () => void
}

function Login({ onLogin }: LoginProps) {
  const [usuario, setUsuario] = useState('diana')
  const [password, setPassword] = useState('admin123')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const usuariosPermitidos = [
    { usuario: 'diana', password: 'admin123', nombre: 'Diana Arenales' },
    { usuario: 'hermano', password: 'admin456', nombre: 'Hermano de Diana' }
  ]

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Simular delay de rede
    setTimeout(() => {
      const usuarioEncontrado = usuariosPermitidos.find(
        u => u.usuario === usuario && u.password === password
      )

      if (usuarioEncontrado) {
        // Guardar en localStorage
        localStorage.setItem('gestor_usuario', JSON.stringify(usuarioEncontrado))
        
        // Limpiar formulario
        setUsuario('')
        setPassword('')
        
        // Notificar al padre
        onLogin()
      } else {
        setError('Usuario o contraseña incorrectos')
      }
      
      setLoading(false)
    }, 500)
  }

  const handleDemoLogin = () => {
    localStorage.setItem('gestor_usuario', JSON.stringify({
      usuario: 'diana',
      nombre: 'Diana Arenales',
      role: 'admin'
    }))
    onLogin()
  }

  return (
    <div style={styles.container}>
      <div style={styles.loginCard}>
        <div style={styles.logo}>
          <div style={styles.logoIcon}>🏠</div>
          <h1 style={styles.titulo}>Gestión de Propiedades</h1>
          <p style={styles.subtitulo}>Sistema de administración para Diana Arenales</p>
        </div>
        
        <form onSubmit={handleLogin} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Usuario</label>
            <input
              type="text"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              style={styles.input}
              placeholder="Ingrese su usuario"
              required
              disabled={loading}
            />
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              placeholder="Ingrese su contraseña"
              required
              disabled={loading}
            />
          </div>
          
          {error && (
            <div style={styles.error}>
              ⚠️ {error}
            </div>
          )}
          
          <button 
            type="submit" 
            style={styles.botonLogin}
            disabled={loading}
          >
            {loading ? 'Ingresando...' : 'Ingresar al Sistema'}
          </button>
          
          <div style={styles.separator}>
            <span style={styles.separatorText}>o</span>
          </div>
          
          <button 
            type="button"
            style={styles.botonDemo}
            onClick={handleDemoLogin}
            disabled={loading}
          >
            🚀 Ingresar como Diana (Demo)
          </button>
          
          <div style={styles.info}>
            <p style={styles.infoTitle}>Credenciales de acceso:</p>
            <div style={styles.credenciales}>
              <div style={styles.credencial}>
                <strong>Diana:</strong> usuario: <code>diana</code> | contraseña: <code>admin123</code>
              </div>
              <div style={styles.credencial}>
                <strong>Hermano:</strong> usuario: <code>hermano</code> | contraseña: <code>admin456</code>
              </div>
            </div>
            
            <div style={styles.features}>
              <p style={styles.featuresTitle}>Lo que puedes hacer:</p>
              <ul style={styles.featuresList}>
                <li>✅ Administrar 30+ propiedades</li>
                <li>✅ Controlar ocupación diaria</li>
                <li>✅ Registrar ingresos y gastos</li>
                <li>✅ Generar reportes automáticos</li>
                <li>✅ Calcular pagos a propietarios</li>
              </ul>
            </div>
          </div>
        </form>
        
        <div style={styles.footer}>
          <p style={styles.footerText}>
            Sistema diseñado específicamente para las necesidades de Diana Arenales en Bolivia
          </p>
        </div>
      </div>
    </div>
  )
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
    padding: '20px',
  },
  loginCard: {
    backgroundColor: 'white',
    borderRadius: '16px',
    padding: '40px',
    boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '480px',
    border: '1px solid #e9ecef',
  },
  logo: {
    textAlign: 'center' as const,
    marginBottom: '32px',
  },
  logoIcon: {
    fontSize: '64px',
    marginBottom: '16px',
  },
  titulo: {
    fontSize: '28px',
    fontWeight: '700' as const,
    color: '#2c3e50',
    marginBottom: '8px',
  },
  subtitulo: {
    fontSize: '14px',
    color: '#868e96',
    marginBottom: '0',
  },
  form: {
    marginTop: '8px',
  },
  formGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontSize: '14px',
    fontWeight: '600' as const,
    color: '#495057',
  },
  input: {
    width: '100%',
    padding: '14px 16px',
    border: '1px solid #dee2e6',
    borderRadius: '8px',
    fontSize: '15px',
    transition: 'all 0.2s',
  },
  error: {
    backgroundColor: '#fff5f5',
    color: '#c92a2a',
    padding: '12px 16px',
    borderRadius: '8px',
    marginBottom: '16px',
    fontSize: '14px',
    border: '1px solid #ffa8a8',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  botonLogin: {
    width: '100%',
    backgroundColor: '#4dabf7',
    color: 'white',
    border: 'none',
    padding: '16px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '600' as const,
    marginTop: '8px',
    transition: 'all 0.2s',
    opacity: 1,
  },
  botonDemo: {
    width: '100%',
    backgroundColor: '#40c057',
    color: 'white',
    border: 'none',
    padding: '16px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '600' as const,
    marginTop: '16px',
    transition: 'all 0.2s',
  },
  separator: {
    display: 'flex',
    alignItems: 'center',
    margin: '20px 0',
    '::before': {
      content: '""',
      flex: 1,
      height: '1px',
      backgroundColor: '#e9ecef',
    },
    '::after': {
      content: '""',
      flex: 1,
      height: '1px',
      backgroundColor: '#e9ecef',
    },
  },
  separatorText: {
    padding: '0 16px',
    color: '#868e96',
    fontSize: '14px',
  },
  info: {
    marginTop: '32px',
    padding: '20px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
  },
  infoTitle: {
    fontSize: '14px',
    fontWeight: '600' as const,
    color: '#495057',
    marginBottom: '12px',
  },
  credenciales: {
    fontSize: '12px',
    color: '#495057',
    lineHeight: 1.6,
  },
  credencial: {
    marginBottom: '8px',
    padding: '8px',
    backgroundColor: 'white',
    borderRadius: '4px',
    border: '1px solid #e9ecef',
  },
  features: {
    marginTop: '16px',
    paddingTop: '16px',
    borderTop: '1px solid #dee2e6',
  },
  featuresTitle: {
    fontSize: '14px',
    fontWeight: '600' as const,
    color: '#495057',
    marginBottom: '8px',
  },
  featuresList: {
    margin: '0',
    paddingLeft: '20px',
    fontSize: '13px',
    color: '#495057',
    lineHeight: 1.8,
  },
  footer: {
    marginTop: '32px',
    paddingTop: '20px',
    borderTop: '1px solid #e9ecef',
    textAlign: 'center' as const,
  },
  footerText: {
    fontSize: '12px',
    color: '#868e96',
    fontStyle: 'italic' as const,
  },
}

// Adicionar estilos hover
Object.assign(styles.botonLogin, {
  ':hover': {
    backgroundColor: '#339af0',
  },
  ':disabled': {
    backgroundColor: '#a5d8ff',
    cursor: 'not-allowed',
  }
})

Object.assign(styles.botonDemo, {
  ':hover': {
    backgroundColor: '#2f9e44',
  },
  ':disabled': {
    backgroundColor: '#b2f2bb',
    cursor: 'not-allowed',
  }
})

Object.assign(styles.input, {
  ':focus': {
    outline: 'none',
    borderColor: '#4dabf7',
    boxShadow: '0 0 0 3px rgba(77, 171, 247, 0.1)',
  },
  ':disabled': {
    backgroundColor: '#f8f9fa',
    cursor: 'not-allowed',
  }
})

export default Login