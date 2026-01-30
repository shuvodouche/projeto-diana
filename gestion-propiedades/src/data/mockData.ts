// src/data/mockData.ts
// Versão simplificada para não ter erros

export const mockPropiedades = [
  {
    id: '1',
    nombre: 'SUITE DUPLEX 204',
    direccion: 'Torre Lima, Piso 2',
    tipo: 'SUITE DUPLEX',
    numero: '204',
    propietarioId: '1',
    precioNoche: 180,
    costoLimpeza: 30,
    costoInternet: 40,
    estado: 'ACTIVO'
  },
  {
    id: '2',
    nombre: 'SUITE FAMILIAR JR 105',
    direccion: 'Edificio Principal',
    tipo: 'SUITE FAMILIAR JR',
    numero: '105',
    propietarioId: '2',
    precioNoche: 220,
    costoLimpeza: 35,
    costoInternet: 40,
    estado: 'ACTIVO'
  },
]

export const mockOcupacion = [
  {
    id: '1',
    fecha: '2026-01-27',
    propiedadId: '1',
    estado: 'OCUPADA',
    huesped: 'YHURGEN HOWARD',
    entrada: '22/1',
    salida: '24/1',
    empresa: 'LIMA',
    precioNoche: 180,
    pagado: true
  },
]

export const mockTransacciones = [
  {
    id: '1',
    fecha: '2026-01-27',
    tipo: 'INGRESO',
    categoria: 'ALOJAMIENTO',
    propiedadId: '1',
    monto: 180,
    descripcion: 'Pago por 1 noche - YHURGEN HOWARD'
  },
]

export const mockPropietarios = [
  {
    id: '1',
    nombre: 'Ricardo Chumacero',
    telefono: '+591 77712345',
    email: 'ricardo@email.com',
    porcentajeComision: 20
  },
]