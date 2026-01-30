// src/utils/storage.ts
const STORAGE_KEYS = {
  PROPIEDADES: 'gestor_propiedades',
  OCUPACION: 'gestor_ocupacion',
  TRANSACCIONES: 'gestor_transacciones',
  PROPIETARIOS: 'gestor_propietarios',
  USUARIO: 'gestor_usuario',
  CONFIG: 'gestor_config'
}

// DATOS INICIALES COMPLETOS - 30 PROPIEDADES COMO A DIANA TEM
const datosIniciales = {
  propiedades: [
    // SUITE DUPLEX
    { id: '1', nombre: 'SUITE DUPLEX 204', direccion: 'Torre Lima, Piso 2', tipo: 'SUITE DUPLEX', numero: '204', propietarioId: '1', precioNoche: 180, costoLimpeza: 30, costoInternet: 40, costoElectricidad: 50, estado: 'ACTIVO', wifi: true, aireAcondicionado: true, capacidad: 4 },
    
    // SUITE FAMILIAR JR
    { id: '2', nombre: 'SUITE FAMILIAR JR 105', direccion: 'Edificio Principal', tipo: 'SUITE FAMILIAR JR', numero: '105', propietarioId: '2', precioNoche: 220, costoLimpeza: 35, costoInternet: 40, costoElectricidad: 60, estado: 'ACTIVO', wifi: true, aireAcondicionado: true, capacidad: 6 },
    { id: '3', nombre: 'SUITE FAMILIAR JR 205', direccion: 'Edificio Principal, Piso 2', tipo: 'SUITE FAMILIAR JR', numero: '205', propietarioId: '1', precioNoche: 220, costoLimpeza: 35, costoInternet: 40, costoElectricidad: 60, estado: 'ACTIVO', wifi: true, aireAcondicionado: true, capacidad: 6 },
    
    // SUITE ESTANDAR (MÚLTIPLAS)
    { id: '4', nombre: 'SUITE ESTANDAR 4', direccion: 'Piso 0', tipo: 'SUITE ESTANDAR', numero: '4', propietarioId: '3', precioNoche: 150, costoLimpeza: 25, costoInternet: 40, costoElectricidad: 40, estado: 'ACTIVO', wifi: true, aireAcondicionado: true, capacidad: 2 },
    { id: '5', nombre: 'SUITE ESTANDAR 101', direccion: 'Piso 1', tipo: 'SUITE ESTANDAR', numero: '101', propietarioId: '1', precioNoche: 150, costoLimpeza: 25, costoInternet: 40, costoElectricidad: 40, estado: 'ACTIVO', wifi: true, aireAcondicionado: true, capacidad: 2 },
    { id: '6', nombre: 'SUITE ESTANDAR 106', direccion: 'Piso 1', tipo: 'SUITE ESTANDAR', numero: '106', propietarioId: '1', precioNoche: 150, costoLimpeza: 25, costoInternet: 40, costoElectricidad: 40, estado: 'ACTIVO', wifi: true, aireAcondicionado: true, capacidad: 2 },
    { id: '7', nombre: 'SUITE ESTANDAR 108', direccion: 'Piso 1', tipo: 'SUITE ESTANDAR', numero: '108', propietarioId: '1', precioNoche: 150, costoLimpeza: 25, costoInternet: 40, costoElectricidad: 40, estado: 'ACTIVO', wifi: true, aireAcondicionado: true, capacidad: 2 },
    { id: '8', nombre: 'SUITE ESTANDAR 109', direccion: 'Piso 1', tipo: 'SUITE ESTANDAR', numero: '109', propietarioId: '1', precioNoche: 150, costoLimpeza: 25, costoInternet: 40, costoElectricidad: 40, estado: 'ACTIVO', wifi: true, aireAcondicionado: true, capacidad: 2 },
    { id: '9', nombre: 'SUITE ESTANDAR 112', direccion: 'Piso 1', tipo: 'SUITE ESTANDAR', numero: '112', propietarioId: '1', precioNoche: 150, costoLimpeza: 25, costoInternet: 40, costoElectricidad: 40, estado: 'ACTIVO', wifi: true, aireAcondicionado: true, capacidad: 2 },
    { id: '10', nombre: 'SUITE ESTANDAR 201', direccion: 'Piso 2', tipo: 'SUITE ESTANDAR', numero: '201', propietarioId: '3', precioNoche: 150, costoLimpeza: 25, costoInternet: 40, costoElectricidad: 40, estado: 'ACTIVO', wifi: true, aireAcondicionado: true, capacidad: 2 },
    { id: '11', nombre: 'SUITE ESTANDAR 209', direccion: 'Piso 2', tipo: 'SUITE ESTANDAR', numero: '209', propietarioId: '1', precioNoche: 150, costoLimpeza: 25, costoInternet: 40, costoElectricidad: 40, estado: 'ACTIVO', wifi: true, aireAcondicionado: true, capacidad: 2 },
    { id: '12', nombre: 'SUITE ESTANDAR 211', direccion: 'Piso 2', tipo: 'SUITE ESTANDAR', numero: '211', propietarioId: '1', precioNoche: 150, costoLimpeza: 25, costoInternet: 40, costoElectricidad: 40, estado: 'ACTIVO', wifi: true, aireAcondicionado: true, capacidad: 2 },
    { id: '13', nombre: 'SUITE ESTANDAR 307', direccion: 'Piso 3', tipo: 'SUITE ESTANDAR', numero: '307', propietarioId: '1', precioNoche: 150, costoLimpeza: 25, costoInternet: 40, costoElectricidad: 40, estado: 'ACTIVO', wifi: true, aireAcondicionado: true, capacidad: 2 },
    { id: '14', nombre: 'SUITE ESTANDAR 404', direccion: 'Piso 4', tipo: 'SUITE ESTANDAR', numero: '404', propietarioId: '1', precioNoche: 150, costoLimpeza: 25, costoInternet: 40, costoElectricidad: 40, estado: 'ACTIVO', wifi: true, aireAcondicionado: true, capacidad: 2 },
    { id: '15', nombre: 'SUITE ESTANDAR 405', direccion: 'Piso 4', tipo: 'SUITE ESTANDAR', numero: '405', propietarioId: '1', precioNoche: 150, costoLimpeza: 25, costoInternet: 40, costoElectricidad: 40, estado: 'ACTIVO', wifi: true, aireAcondicionado: true, capacidad: 2 },
    { id: '16', nombre: 'SUITE ESTANDAR 408', direccion: 'Piso 4', tipo: 'SUITE ESTANDAR', numero: '408', propietarioId: '1', precioNoche: 150, costoLimpeza: 25, costoInternet: 40, costoElectricidad: 40, estado: 'ACTIVO', wifi: true, aireAcondicionado: true, capacidad: 2 },
    { id: '17', nombre: 'SUITE ESTANDAR 409', direccion: 'Piso 4', tipo: 'SUITE ESTANDAR', numero: '409', propietarioId: '1', precioNoche: 150, costoLimpeza: 25, costoInternet: 40, costoElectricidad: 40, estado: 'ACTIVO', wifi: true, aireAcondicionado: true, capacidad: 2 },
    { id: '18', nombre: 'SUITE ESTANDAR 412', direccion: 'Piso 4', tipo: 'SUITE ESTANDAR', numero: '412', propietarioId: '1', precioNoche: 150, costoLimpeza: 25, costoInternet: 40, costoElectricidad: 40, estado: 'ACTIVO', wifi: true, aireAcondicionado: true, capacidad: 2 },
    
    // TOBOROCHI
    { id: '19', nombre: 'TOBOROCHI 1311', direccion: 'Edificio Toborochi, Piso 13', tipo: 'TOBOROCHI', numero: '1311', propietarioId: '2', precioNoche: 200, costoLimpeza: 30, costoInternet: 40, costoElectricidad: 50, estado: 'ACTIVO', wifi: true, aireAcondicionado: true, capacidad: 4 },
    
    // ONIX ART
    { id: '20', nombre: 'ONIX ART 6B', direccion: 'Edificio Onix Art', tipo: 'ONIX ART', numero: '6B', propietarioId: '3', precioNoche: 160, costoLimpeza: 30, costoInternet: 40, costoElectricidad: 40, estado: 'ACTIVO', wifi: true, aireAcondicionado: true, capacidad: 2 },
    
    // CONDOMINIO ONIX
    { id: '21', nombre: 'CONDOMINIO ONIX 402', direccion: 'Condominio Onix, Piso 4', tipo: 'CONDOMINIO ONIX', numero: '402', propietarioId: '1', precioNoche: 140, costoLimpeza: 25, costoInternet: 40, costoElectricidad: 35, estado: 'ACTIVO', wifi: true, aireAcondicionado: true, capacidad: 2 },
    
    // SMARTSTUDIO YOU
    { id: '22', nombre: 'SMARTSTUDIO YOU 302', direccion: 'Edificio Smart Studio', tipo: 'SMARTSTUDIO YOU', numero: '302', propietarioId: '4', precioNoche: 140, costoLimpeza: 25, costoInternet: 40, costoElectricidad: 35, estado: 'ACTIVO', wifi: true, aireAcondicionado: true, capacidad: 2 },
    
    // SKY MAGNOLIA
    { id: '23', nombre: 'SKY MAGNOLIA 1B', direccion: 'Edificio Sky Magnolia', tipo: 'SKY MAGNOLIA', numero: '1B', propietarioId: '3', precioNoche: 170, costoLimpeza: 30, costoInternet: 40, costoElectricidad: 45, estado: 'ACTIVO', wifi: true, aireAcondicionado: true, capacidad: 3 },
    
    // NOMAD
    { id: '24', nombre: 'NOMAD 301', direccion: 'Edificio Nomad', tipo: 'NOMAD', numero: '301', propietarioId: '3', precioNoche: 155, costoLimpeza: 25, costoInternet: 40, costoElectricidad: 40, estado: 'ACTIVO', wifi: true, aireAcondicionado: true, capacidad: 2 },
    
    // ARES
    { id: '25', nombre: 'ARES 7D', direccion: 'Edificio Ares', tipo: 'ARES', numero: '7D', propietarioId: '3', precioNoche: 165, costoLimpeza: 30, costoInternet: 40, costoElectricidad: 45, estado: 'ACTIVO', wifi: true, aireAcondicionado: true, capacidad: 2 },
  ],
  
  propietarios: [
    { id: '1', nombre: 'Ricardo Chumacero', telefono: '+591 77712345', email: 'ricardo@email.com', porcentajeComision: 20, direccion: 'Av. Principal #123', ci: '1234567' },
    { id: '2', nombre: 'Lima Properties', telefono: '+591 77754321', email: 'contacto@lima.com', porcentajeComision: 20, direccion: 'Torre Lima, Oficina 401', ci: '7654321' },
    { id: '3', nombre: 'Directa Owner', telefono: '+591 77798765', email: 'directa@owner.com', porcentajeComision: 20, direccion: 'Calle Comercio #456', ci: '9876543' },
    { id: '4', nombre: 'Airbnb Host', telefono: '+591 77745678', email: 'host@airbnb.com', porcentajeComision: 15, direccion: 'Plaza Central #789', ci: '4567890' },
  ],
  
  transacciones: [
    // INGRESOS Enero 2026
    { id: '1', fecha: '2026-01-22', tipo: 'INGRESO', categoria: 'ALOJAMIENTO', propiedadId: '1', monto: 360, descripcion: 'YHURGEN HOWARD - 2 noches', comprobante: 'REC-001' },
    { id: '2', fecha: '2026-01-22', tipo: 'INGRESO', categoria: 'ALOJAMIENTO', propiedadId: '2', monto: 440, descripcion: 'RICARDO CHUMACERO - 2 noches', comprobante: 'REC-002' },
    { id: '3', fecha: '2026-01-22', tipo: 'INGRESO', categoria: 'ALOJAMIENTO', propiedadId: '5', monto: 300, descripcion: 'MEJIA GUTIERREZ - 2 noches', comprobante: 'REC-003' },
    
    // GASTOS Enero 2026
    { id: '4', fecha: '2026-01-05', tipo: 'GASTO', categoria: 'INTERNET', propiedadId: 'all', monto: 1200, descripcion: 'Factura internet mensual (30 propiedades)', comprobante: 'INT-0126' },
    { id: '5', fecha: '2026-01-10', tipo: 'GASTO', categoria: 'LIMPIEZA', propiedadId: '1', monto: 30, descripcion: 'Limpieza APTO 204', comprobante: 'LIM-001' },
    { id: '6', fecha: '2026-01-15', tipo: 'GASTO', categoria: 'MANTENIMIENTO', propiedadId: '2', monto: 85, descripcion: 'Reparación aire acondicionado APTO 105', comprobante: 'MAN-001' },
    { id: '7', fecha: '2026-01-20', tipo: 'GASTO', categoria: 'ELECTRICIDAD', propiedadId: 'all', monto: 1500, descripcion: 'Factura electricidad mensual', comprobante: 'ELE-0126' },
    { id: '8', fecha: '2026-01-25', tipo: 'GASTO', categoria: 'REPARACION', propiedadId: '5', monto: 45, descripcion: 'Cambio de foco LED APTO 101', comprobante: 'REP-001' },
  ],
  
  ocupacion: [
    { id: '1', fecha: '2026-01-27', propiedadId: '1', estado: 'OCUPADA', huesped: 'YHURGEN HOWARD', entrada: '22/1', salida: '24/1', empresa: 'LIMA', precioNoche: 180, pagado: true },
    { id: '2', fecha: '2026-01-27', propiedadId: '2', estado: 'OCUPADA', huesped: 'RICARDO CHUMACERO', entrada: '31/12', salida: '31/1', empresa: 'DIRECTA', precioNoche: 220, pagado: true },
    { id: '3', fecha: '2026-01-27', propiedadId: '5', estado: 'OCUPADA', huesped: 'MEJIA GUTIERREZ', entrada: '22/1', salida: '24/1', empresa: 'LIMA', precioNoche: 150, pagado: true },
    { id: '4', fecha: '2026-01-27', propiedadId: '6', estado: 'OCUPADA', huesped: 'ALEXANDER ARRASOLA', entrada: '22/1', salida: '24/1', empresa: 'LIMA', precioNoche: 150, pagado: true },
    { id: '5', fecha: '2026-01-27', propiedadId: '22', estado: 'OCUPADA', huesped: 'AIRBNB GUEST', entrada: '20/1', salida: '26/1', empresa: 'AIRBNB', precioNoche: 140, pagado: true },
  ]
}

// Propiedades
export const guardarPropiedades = (propiedades: any[]) => {
  localStorage.setItem(STORAGE_KEYS.PROPIEDADES, JSON.stringify(propiedades))
}

export const obtenerPropiedades = (): any[] => {
  const data = localStorage.getItem(STORAGE_KEYS.PROPIEDADES)
  if (!data) {
    guardarPropiedades(datosIniciales.propiedades)
    return datosIniciales.propiedades
  }
  return JSON.parse(data)
}

// Ocupación
export const guardarOcupacion = (ocupacion: any[]) => {
  localStorage.setItem(STORAGE_KEYS.OCUPACION, JSON.stringify(ocupacion))
}

export const obtenerOcupacion = (): any[] => {
  const data = localStorage.getItem(STORAGE_KEYS.OCUPACION)
  if (!data) {
    guardarOcupacion(datosIniciales.ocupacion)
    return datosIniciales.ocupacion
  }
  return JSON.parse(data)
}

// Transacciones
export const guardarTransacciones = (transacciones: any[]) => {
  localStorage.setItem(STORAGE_KEYS.TRANSACCIONES, JSON.stringify(transacciones))
}

export const obtenerTransacciones = (): any[] => {
  const data = localStorage.getItem(STORAGE_KEYS.TRANSACCIONES)
  if (!data) {
    guardarTransacciones(datosIniciales.transacciones)
    return datosIniciales.transacciones
  }
  return JSON.parse(data)
}

// Propietarios
export const guardarPropietarios = (propietarios: any[]) => {
  localStorage.setItem(STORAGE_KEYS.PROPIETARIOS, JSON.stringify(propietarios))
}

export const obtenerPropietarios = (): any[] => {
  const data = localStorage.getItem(STORAGE_KEYS.PROPIETARIOS)
  if (!data) {
    guardarPropietarios(datosIniciales.propietarios)
    return datosIniciales.propietarios
  }
  return JSON.parse(data)
}

// Configuración
export const guardarConfig = (config: any) => {
  localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(config))
}

export const obtenerConfig = (): any => {
  const data = localStorage.getItem(STORAGE_KEYS.CONFIG)
  return data ? JSON.parse(data) : { comisionDefault: 20 }
}

// Usuario
export const obtenerUsuario = () => {
  const data = localStorage.getItem(STORAGE_KEYS.USUARIO)
  return data ? JSON.parse(data) : null
}

export const cerrarSesion = () => {
  localStorage.removeItem(STORAGE_KEYS.USUARIO)
}

// Helper para generar IDs
export const generarId = () => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9)
}

// Inicializar todos los datos
export const inicializarDatos = () => {
  if (!localStorage.getItem(STORAGE_KEYS.PROPIEDADES)) {
    guardarPropiedades(datosIniciales.propiedades)
  }
  if (!localStorage.getItem(STORAGE_KEYS.OCUPACION)) {
    guardarOcupacion(datosIniciales.ocupacion)
  }
  if (!localStorage.getItem(STORAGE_KEYS.TRANSACCIONES)) {
    guardarTransacciones(datosIniciales.transacciones)
  }
  if (!localStorage.getItem(STORAGE_KEYS.PROPIETARIOS)) {
    guardarPropietarios(datosIniciales.propietarios)
  }
  if (!localStorage.getItem(STORAGE_KEYS.CONFIG)) {
    guardarConfig({ comisionDefault: 20, moneda: 'Bs' })
  }
}

// Obtener propiedad por ID
export const obtenerPropiedadPorId = (id: string) => {
  const propiedades = obtenerPropiedades()
  return propiedades.find(p => p.id === id)
}

// Obtener propietario por ID
export const obtenerPropietarioPorId = (id: string) => {
  const propietarios = obtenerPropietarios()
  return propietarios.find(p => p.id === id)
}