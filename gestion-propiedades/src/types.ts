// src/types.ts
export type MenuItem = 'dashboard' | 'propiedades' | 'ocupacion' | 'transacciones' | 'reportes' | 'propietarios'

export interface Propietario {
  id: string
  nombre: string
  telefono: string
  email: string
  porcentajeComision: number
}

export interface Propiedad {
  id: string
  nombre: string
  direccion: string
  tipo: string
  numero: string
  propietarioId: string
  precioNoche: number
  costoLimpeza: number
  costoInternet: number
  estado: string
}

export interface Ocupacion {
  id: string
  fecha: string
  propiedadId: string
  estado: string
  huesped?: string
  entrada?: string
  salida?: string
  empresa: string
  precioNoche: number
  pagado: boolean
}

export interface Transaccion {
  id: string
  fecha: string
  tipo: string
  categoria: string
  propiedadId: string
  monto: number
  descripcion: string
  comprobante?: string
}

export interface ReporteMensual {
  mes: string
  propiedadId: string
  totalIngresos: number
  totalGastos: number
  comisionAdmin: number
  netoPropietario: number
  diasOcupados: number
  porcentajeOcupacion: number
  estado: string
}