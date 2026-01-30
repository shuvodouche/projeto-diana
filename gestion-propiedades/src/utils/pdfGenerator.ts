// src/utils/pdfGenerator.ts - VERSÃO SEM ERROS
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

// Helper para formatar números
const formatNumber = (num: number) => {
  return new Intl.NumberFormat('es-BO', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(num)
}

// Função principal - PDF de reporte individual
export const generarPDFReporte = (datos: any) => {
  try {
    const doc = new jsPDF()
    
    // TÍTULO
    doc.setFontSize(20)
    doc.setTextColor(45, 55, 72)
    doc.setFont('helvetica', 'bold')
    doc.text('REPORTE MENSUAL', 105, 25, { align: 'center' })
    
    // Linha decorativa
    doc.setDrawColor(77, 171, 247)
    doc.setLineWidth(0.5)
    doc.line(20, 32, 190, 32)
    
    // INFORMACIÓN BÁSICA
    doc.setFontSize(11)
    doc.setTextColor(73, 80, 87)
    doc.setFont('helvetica', 'normal')
    
    doc.text(`Propiedad: ${datos.propiedad}`, 20, 45)
    doc.text(`Propietario: ${datos.propietario}`, 20, 53)
    doc.text(`Mes: ${datos.mes}`, 20, 61)
    doc.text(`Generado: ${new Date().toLocaleDateString('es-BO')}`, 20, 69)
    
    // ESTADÍSTICAS
    doc.setFontSize(12)
    doc.setTextColor(45, 55, 72)
    doc.setFont('helvetica', 'bold')
    doc.text('Estadísticas de Ocupación', 20, 85)
    
    // Tabla simple de estadísticas
    const statsData = [
      ['Días ocupados:', `${datos.diasOcupados} días`],
      ['Porcentaje de ocupación:', `${datos.porcentajeOcupacion}%`],
      ['Precio por noche:', `Bs ${formatNumber(datos.precioNoche)}`]
    ]
    
    autoTable(doc, {
      startY: 90,
      body: statsData,
      theme: 'plain',
      styles: {
        fontSize: 10,
        cellPadding: 5,
        textColor: [73, 80, 87]
      },
      columnStyles: {
        0: { cellWidth: 100, fontStyle: 'bold' },
        1: { cellWidth: 90, halign: 'right' }
      },
      margin: { left: 20 }
    })
    
    // RESUMEN FINANCIERO - TABLA PRINCIPAL
    const financeStartY = (doc as any).lastAutoTable.finalY + 15
    
    doc.setFontSize(12)
    doc.text('Resumen Financiero', 20, financeStartY)
    
    const financeData = [
      ['INGRESO TOTAL', `Bs ${formatNumber(datos.ingresoTotal)}`],
      ['GASTOS TOTALES', `- Bs ${formatNumber(datos.totalGastos)}`],
      ['COMISIÓN ADMINISTRACIÓN', `- Bs ${formatNumber(datos.comisionAdmin)}`],
      ['NETO A PAGAR', `Bs ${formatNumber(datos.netoPropietario)}`]
    ]
    
    autoTable(doc, {
      startY: financeStartY + 5,
      head: [['CONCEPTO', 'MONTO (Bs)']],
      body: financeData,
      theme: 'grid',
      headStyles: {
        fillColor: [45, 55, 72],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 10,
        cellPadding: 6,
      },
      styles: {
        fontSize: 10,
        cellPadding: 5,
        textColor: [73, 80, 87]
      },
      columnStyles: {
        0: { cellWidth: 120, fontStyle: 'bold' },
        1: { cellWidth: 70, halign: 'right' }
      },
      margin: { left: 20, right: 20 },
      // Colorir as linhas manualmente
      didParseCell: function(data: any) {
        if (data.row.index === 0) { // Ingreso
          data.cell.styles.textColor = [39, 174, 96]
        }
        if (data.row.index === 1 || data.row.index === 2) { // Gastos
          data.cell.styles.textColor = [231, 76, 60]
        }
        if (data.row.index === 3) { // Neto
          data.cell.styles.fontStyle = 'bold'
          data.cell.styles.textColor = [39, 174, 96]
          data.cell.styles.fontSize = 11
        }
      }
    })
    
    // GASTOS DETALLADOS (si hay)
    if (datos.gastos && datos.gastos.length > 0) {
      const expensesY = (doc as any).lastAutoTable.finalY + 15
      
      doc.setFontSize(12)
      doc.text('Detalle de Gastos', 20, expensesY)
      
      const gastosTable = datos.gastos.map((g: any) => [
        g.concepto,
        `- Bs ${formatNumber(g.monto)}`
      ])
      
      autoTable(doc, {
        startY: expensesY + 5,
        head: [['CONCEPTO', 'MONTO (Bs)']],
        body: gastosTable,
        theme: 'striped',
        headStyles: {
          fillColor: [241, 196, 15],
          textColor: [0, 0, 0],
          fontStyle: 'bold',
          fontSize: 9,
        },
        styles: {
          fontSize: 9,
          cellPadding: 4,
        },
        columnStyles: {
          0: { cellWidth: 140 },
          1: { cellWidth: 50, halign: 'right', textColor: [231, 76, 60] }
        },
        margin: { left: 20, right: 20 }
      })
    }
    
    // OBSERVACIONES
    let notesY = (doc as any).lastAutoTable?.finalY || financeStartY + 100
    notesY += 15
    
    doc.setFontSize(11)
    doc.setTextColor(230, 126, 34)
    doc.setFont('helvetica', 'bold')
    doc.text('Observaciones', 20, notesY)
    
    doc.setFontSize(9)
    doc.setTextColor(92, 60, 0)
    doc.setFont('helvetica', 'normal')
    
    const observaciones = [
      '• El pago será realizado hasta el 5 del mes siguiente.',
      '• Los gastos incluyen: limpieza, mantenimiento, internet.',
      '• La comisión de administración es del 20%.',
      '• Para consultas: Diana Arenales.'
    ]
    
    observaciones.forEach((obs, index) => {
      doc.text(obs, 25, notesY + 10 + (index * 6))
    })
    
    // PIE DE PÁGINA SIMPLE
    const totalPages = (doc.internal as any).getNumberOfPages()
    const currentPage = 1 // Para single page
    
    doc.setFontSize(8)
    doc.setTextColor(153, 153, 153)
    doc.setFont('helvetica', 'italic')
    doc.text(
      `Sistema de Gestión de Propiedades • Página ${currentPage} de ${totalPages}`,
      105,
      285,
      { align: 'center' }
    )
    
    // Nombre del archivo
    const fileName = `Reporte_${datos.propiedad.replace(/[^a-zA-Z0-9]/g, '_')}_${datos.mes}.pdf`
    
    // Descargar PDF
    doc.save(fileName)
    
    return true
  } catch (error) {
    console.error('Error al generar PDF:', error)
    alert('Error al generar PDF. Verifique la consola para más detalles.')
    return false
  }
}

// Función para resumen de TODOS los reportes
export const generarTodosReportes = (propiedades: any[], mes: string, propietarios: any[]) => {
  try {
    const doc = new jsPDF()
    
    // TÍTULO
    doc.setFontSize(18)
    doc.setTextColor(45, 55, 72)
    doc.setFont('helvetica', 'bold')
    doc.text('RESUMEN DE REPORTES MENSUALES', 105, 20, { align: 'center' })
    
    // SUBTÍTULO
    doc.setFontSize(12)
    doc.setTextColor(77, 171, 247)
    doc.text(mes, 105, 28, { align: 'center' })
    
    // LÍNEA
    doc.setDrawColor(77, 171, 247)
    doc.setLineWidth(0.5)
    doc.line(20, 33, 190, 33)
    
    // INFORMACIÓN
    doc.setFontSize(10)
    doc.setTextColor(73, 80, 87)
    doc.setFont('helvetica', 'normal')
    doc.text(`Total propiedades: ${propiedades.length}`, 20, 45)
    doc.text(`Fecha: ${new Date().toLocaleDateString('es-BO')}`, 20, 52)
    
    // PREPARAR DATOS - SIN IDs
    const tableData = propiedades.map((prop, index) => {
      const propietario = propietarios.find(p => p.id === prop.propietarioId)
      return [
        (index + 1).toString(),
        `APTO ${prop.numero}`,
        prop.tipo,
        propietario?.nombre || 'No asignado',
        `Bs ${formatNumber(prop.precioNoche || 0)}`,
        prop.estado
      ]
    })
    
    // TABLA PRINCIPAL
    autoTable(doc, {
      startY: 60,
      head: [['#', 'APARTAMENTO', 'TIPO', 'PROPIETARIO', 'PRECIO/NOCHE', 'ESTADO']],
      body: tableData,
      theme: 'grid',
      headStyles: {
        fillColor: [45, 55, 72],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 9,
      },
      styles: {
        fontSize: 8,
        cellPadding: 3,
        textColor: [73, 80, 87],
        overflow: 'linebreak'
      },
      columnStyles: {
        0: { cellWidth: 15, halign: 'center' },
        1: { cellWidth: 35, halign: 'center' },
        2: { cellWidth: 40 },
        3: { cellWidth: 50 },
        4: { cellWidth: 35, halign: 'right' },
        5: { cellWidth: 25, halign: 'center' }
      },
      margin: { left: 15, right: 15 },
      // Colorir estados
      didParseCell: function(data: any) {
        if (data.column.index === 5) { // Columna ESTADO
          const estado = data.cell.raw
          if (estado === 'ACTIVO') {
            data.cell.styles.fillColor = [39, 174, 96]
            data.cell.styles.textColor = [255, 255, 255]
          } else if (estado === 'INACTIVO') {
            data.cell.styles.fillColor = [149, 165, 166]
            data.cell.styles.textColor = [255, 255, 255]
          } else if (estado === 'MANTENIMIENTO') {
            data.cell.styles.fillColor = [231, 76, 60]
            data.cell.styles.textColor = [255, 255, 255]
          }
        }
      }
    })
    
    // NOTA IMPORTANTE
    const finalY = (doc as any).lastAutoTable.finalY + 10
    
    doc.setFontSize(10)
    doc.setTextColor(230, 126, 34)
    doc.setFont('helvetica', 'bold')
    doc.text('Nota Importante', 20, finalY)
    
    doc.setFontSize(8)
    doc.setTextColor(92, 60, 0)
    doc.setFont('helvetica', 'normal')
    
    const notas = [
      '• Este es un resumen general de todas las propiedades.',
      '• Para reportes detallados con cálculos financieros,',
      '  genere los reportes individuales para cada propiedad.'
    ]
    
    notas.forEach((nota, index) => {
      doc.text(nota, 25, finalY + 7 + (index * 5))
    })
    
    // PIE DE PÁGINA
    doc.setFontSize(8)
    doc.setTextColor(153, 153, 153)
    doc.setFont('helvetica', 'italic')
    doc.text(
      `Resumen generado automáticamente • ${new Date().toLocaleDateString('es-BO')}`,
      105,
      285,
      { align: 'center' }
    )
    
    // SALVAR
    doc.save(`Resumen_General_${mes}.pdf`)
    
    return true
  } catch (error) {
    console.error('Error al generar resumen:', error)
    alert('Error al generar el resumen. Verifique la consola.')
    return false
  }
}

// Función para reporte de ocupación diaria
export const generarPDFOcupacionDiaria = (ocupacion: any[], fecha: string, propiedades: any[]) => {
  try {
    const doc = new jsPDF('landscape')
    
    // TÍTULO
    doc.setFontSize(16)
    doc.setTextColor(45, 55, 72)
    doc.setFont('helvetica', 'bold')
    doc.text('REPORTE DE OCUPACIÓN DIARIA', 148, 20, { align: 'center' })
    
    doc.setFontSize(12)
    doc.setTextColor(77, 171, 247)
    doc.text(fecha, 148, 28, { align: 'center' })
    
    // PREPARAR DATOS
    const tableData = ocupacion.map(o => {
      const propiedad = propiedades.find(p => p.id === o.propiedadId)
      return [
        propiedad?.numero || 'N/A',
        o.huesped || '-',
        o.estado,
        o.entrada || '-',
        o.salida || '-',
        o.empresa || '-',
        `Bs ${formatNumber(o.precioNoche || 0)}`,
        o.pagado ? 'Sí' : 'No'
      ]
    })
    
    // TABLA
    autoTable(doc, {
      startY: 35,
      head: [['APTO', 'HUÉSPED', 'ESTADO', 'ENTRADA', 'SALIDA', 'EMPRESA', 'PRECIO', 'PAGADO']],
      body: tableData,
      theme: 'grid',
      headStyles: {
        fillColor: [45, 55, 72],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 9,
      },
      styles: {
        fontSize: 8,
        cellPadding: 3,
        textColor: [73, 80, 87]
      },
      columnStyles: {
        0: { cellWidth: 20, halign: 'center' },
        1: { cellWidth: 40 },
        2: { cellWidth: 25, halign: 'center' },
        3: { cellWidth: 22, halign: 'center' },
        4: { cellWidth: 22, halign: 'center' },
        5: { cellWidth: 30, halign: 'center' },
        6: { cellWidth: 28, halign: 'right' },
        7: { cellWidth: 22, halign: 'center' }
      },
      margin: { left: 15, right: 15 },
      // Colorir estados
      didParseCell: function(data: any) {
        if (data.column.index === 2) { // Columna ESTADO
          const estado = data.cell.raw
          if (estado === 'OCUPADA') {
            data.cell.styles.fillColor = [231, 76, 60]
            data.cell.styles.textColor = [255, 255, 255]
          } else if (estado === 'DISPONIBLE') {
            data.cell.styles.fillColor = [39, 174, 96]
            data.cell.styles.textColor = [255, 255, 255]
          } else if (estado === 'RESERVADA') {
            data.cell.styles.fillColor = [241, 196, 15]
            data.cell.styles.textColor = [0, 0, 0]
          }
        }
        if (data.column.index === 7) { // Columna PAGADO
          if (data.cell.raw === 'Sí') {
            data.cell.styles.textColor = [39, 174, 96]
          } else {
            data.cell.styles.textColor = [231, 76, 60]
          }
        }
      }
    })
    
    // ESTADÍSTICAS
    const totalOcupados = ocupacion.filter(o => o.estado === 'OCUPADA').length
    const porcentaje = ocupacion.length > 0 
      ? ((totalOcupados / ocupacion.length) * 100).toFixed(1)
      : '0.0'
    
    const finalY = (doc as any).lastAutoTable.finalY + 10
    
    doc.setFontSize(10)
    doc.setTextColor(45, 55, 72)
    doc.setFont('helvetica', 'bold')
    doc.text('Resumen:', 20, finalY)
    
    doc.setFontSize(9)
    doc.setTextColor(73, 80, 87)
    doc.setFont('helvetica', 'normal')
    
    const stats = [
      `Total registros: ${ocupacion.length}`,
      `Ocupados: ${totalOcupados}`,
      `Porcentaje de ocupación: ${porcentaje}%`
    ]
    
    stats.forEach((stat, index) => {
      doc.text(stat, 25, finalY + 8 + (index * 6))
    })
    
    // PIE
    doc.setFontSize(8)
    doc.setTextColor(153, 153, 153)
    doc.setFont('helvetica', 'italic')
    doc.text(
      `Reporte de ocupación diaria • ${new Date().toLocaleDateString('es-BO')}`,
      148,
      190,
      { align: 'center' }
    )
    
    // SALVAR
    doc.save(`Ocupacion_${fecha.replace(/\//g, '-')}.pdf`)
    
    return true
  } catch (error) {
    console.error('Error al generar PDF de ocupación:', error)
    return false
  }
}