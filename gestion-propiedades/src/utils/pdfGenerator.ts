// src/utils/pdfGenerator.ts - VERSÃO ORGANIZADA
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

// Helper para formatar números
const formatNumber = (num: number) => {
  return new Intl.NumberFormat('es-BO', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(num)
}

// Configurações gerais do PDF
const PDF_CONFIG = {
  MARGIN_LEFT: 15,
  MARGIN_RIGHT: 15,
  PAGE_WIDTH: 210, // A4 em mm
  MAX_TABLE_WIDTH: 180,
  FONT_SIZES: {
    TITLE: 16,
    SUBTITLE: 12,
    BODY: 10,
    SMALL: 8
  }
}

// Função principal - PDF de reporte individual
export const generarPDFReporte = (datos: any) => {
  try {
    const doc = new jsPDF()
    const pageWidth = PDF_CONFIG.PAGE_WIDTH
    const marginLeft = PDF_CONFIG.MARGIN_LEFT
    const marginRight = PDF_CONFIG.MARGIN_RIGHT
    const maxTableWidth = pageWidth - marginLeft - marginRight

    // TÍTULO
    doc.setFontSize(PDF_CONFIG.FONT_SIZES.TITLE)
    doc.setTextColor(45, 55, 72)
    doc.setFont('helvetica', 'bold')
    doc.text('REPORTE MENSUAL', pageWidth / 2, 25, { align: 'center' })
    
    // Linha decorativa
    doc.setDrawColor(77, 171, 247)
    doc.setLineWidth(0.5)
    doc.line(marginLeft, 32, pageWidth - marginLeft, 32)
    
    // INFORMACIÓN BÁSICA
    doc.setFontSize(PDF_CONFIG.FONT_SIZES.BODY)
    doc.setTextColor(73, 80, 87)
    doc.setFont('helvetica', 'normal')
    
    // Informação em duas colunas para economizar espaço
    const col1X = marginLeft
    const col2X = pageWidth / 2
    
    doc.text(`Propiedad: ${datos.propiedad}`, col1X, 45)
    doc.text(`Propietario: ${datos.propietario}`, col1X, 52)
    doc.text(`Mes: ${datos.mes}`, col2X, 45)
    doc.text(`Generado: ${new Date().toLocaleDateString('es-BO')}`, col2X, 52)
    
    // ESTADÍSTICAS
    doc.setFontSize(PDF_CONFIG.FONT_SIZES.SUBTITLE)
    doc.setTextColor(45, 55, 72)
    doc.setFont('helvetica', 'bold')
    doc.text('Estadísticas de Ocupación', marginLeft, 65)
    
    // Tabla simple de estadísticas
    const statsData = [
      ['Días ocupados:', `${datos.diasOcupados} días`],
      ['Porcentaje de ocupación:', `${datos.porcentajeOcupacion}%`],
      ['Precio por noche:', `Bs ${formatNumber(datos.precioNoche)}`]
    ]
    
    autoTable(doc, {
      startY: 70,
      body: statsData,
      theme: 'plain',
      styles: {
        fontSize: PDF_CONFIG.FONT_SIZES.BODY,
        cellPadding: 4,
        textColor: [73, 80, 87]
      },
      columnStyles: {
        0: { cellWidth: maxTableWidth * 0.6, fontStyle: 'bold' },
        1: { cellWidth: maxTableWidth * 0.4, halign: 'right' }
      },
      margin: { left: marginLeft, right: marginRight },
      tableWidth: maxTableWidth
    })
    
    // RESUMEN FINANCIERO - TABLA PRINCIPAL
    const financeStartY = (doc as any).lastAutoTable.finalY + 10
    
    doc.setFontSize(PDF_CONFIG.FONT_SIZES.SUBTITLE)
    doc.text('Resumen Financiero', marginLeft, financeStartY)
    
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
        fontSize: PDF_CONFIG.FONT_SIZES.BODY,
        cellPadding: 5,
      },
      styles: {
        fontSize: PDF_CONFIG.FONT_SIZES.BODY,
        cellPadding: 4,
        textColor: [73, 80, 87]
      },
      columnStyles: {
        0: { cellWidth: maxTableWidth * 0.7, fontStyle: 'bold' },
        1: { cellWidth: maxTableWidth * 0.3, halign: 'right' }
      },
      margin: { left: marginLeft, right: marginRight },
      tableWidth: maxTableWidth,
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
          data.cell.styles.fontSize = PDF_CONFIG.FONT_SIZES.BODY + 1
        }
      }
    })
    
    // GASTOS DETALLADOS (si hay)
    if (datos.gastos && datos.gastos.length > 0) {
      const expensesY = (doc as any).lastAutoTable.finalY + 10
      
      doc.setFontSize(PDF_CONFIG.FONT_SIZES.SUBTITLE)
      doc.text('Detalle de Gastos', marginLeft, expensesY)
      
      const gastosTable = datos.gastos.map((g: any) => [
        g.concepto.length > 40 ? g.concepto.substring(0, 40) + '...' : g.concepto,
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
          fontSize: PDF_CONFIG.FONT_SIZES.BODY - 1,
        },
        styles: {
          fontSize: PDF_CONFIG.FONT_SIZES.SMALL,
          cellPadding: 3,
        },
        columnStyles: {
          0: { cellWidth: maxTableWidth * 0.75 },
          1: { cellWidth: maxTableWidth * 0.25, halign: 'right', textColor: [231, 76, 60] }
        },
        margin: { left: marginLeft, right: marginRight },
        tableWidth: maxTableWidth
      })
    }
    
    // OBSERVACIONES
    let notesY = (doc as any).lastAutoTable?.finalY || financeStartY + 100
    notesY += 10
    
    doc.setFontSize(PDF_CONFIG.FONT_SIZES.BODY)
    doc.setTextColor(230, 126, 34)
    doc.setFont('helvetica', 'bold')
    doc.text('Observaciones', marginLeft, notesY)
    
    doc.setFontSize(PDF_CONFIG.FONT_SIZES.SMALL)
    doc.setTextColor(92, 60, 0)
    doc.setFont('helvetica', 'normal')
    
    const observaciones = [
      '• El pago será realizado hasta el 5 del mes siguiente.',
      '• Los gastos incluyen: limpieza, mantenimiento, internet.',
      '• La comisión de administración es del 20%.',
      '• Para consultas: Diana Arenales.'
    ]
    
    observaciones.forEach((obs, index) => {
      // Quebrar linhas muito longas
      const lines = doc.splitTextToSize(obs, maxTableWidth - 10)
      lines.forEach((line: string, lineIndex: number) => {
        doc.text(line, marginLeft + 5, notesY + 8 + (index * 5) + (lineIndex * 4))
      })
    })
    
    // PIE DE PÁGINA SIMPLE
    doc.setFontSize(PDF_CONFIG.FONT_SIZES.SMALL)
    doc.setTextColor(153, 153, 153)
    doc.setFont('helvetica', 'italic')
    doc.text(
      'Sistema de Gestión de Propiedades • Página 1 de 1',
      pageWidth / 2,
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
    const pageWidth = PDF_CONFIG.PAGE_WIDTH
    const marginLeft = PDF_CONFIG.MARGIN_LEFT
    const marginRight = PDF_CONFIG.MARGIN_RIGHT
    const maxTableWidth = pageWidth - marginLeft - marginRight
    
    // TÍTULO
    doc.setFontSize(PDF_CONFIG.FONT_SIZES.TITLE - 2)
    doc.setTextColor(45, 55, 72)
    doc.setFont('helvetica', 'bold')
    doc.text('RESUMEN DE REPORTES MENSUALES', pageWidth / 2, 20, { align: 'center' })
    
    // SUBTÍTULO
    doc.setFontSize(PDF_CONFIG.FONT_SIZES.SUBTITLE)
    doc.setTextColor(77, 171, 247)
    doc.text(mes, pageWidth / 2, 28, { align: 'center' })
    
    // LÍNEA
    doc.setDrawColor(77, 171, 247)
    doc.setLineWidth(0.5)
    doc.line(marginLeft, 33, pageWidth - marginLeft, 33)
    
    // INFORMACIÓN
    doc.setFontSize(PDF_CONFIG.FONT_SIZES.BODY)
    doc.setTextColor(73, 80, 87)
    doc.setFont('helvetica', 'normal')
    doc.text(`Total propiedades: ${propiedades.length}`, marginLeft, 45)
    doc.text(`Fecha: ${new Date().toLocaleDateString('es-BO')}`, marginLeft, 52)
    
    // PREPARAR DATOS - SIN IDs
    const tableData = propiedades.map((prop, index) => {
      const propietario = propietarios.find(p => p.id === prop.propietarioId)
      // Truncar nombres muito longos
      const nombrePropietario = propietario?.nombre || 'No asignado'
      const nombreTruncado = nombrePropietario.length > 25 
        ? nombrePropietario.substring(0, 22) + '...' 
        : nombrePropietario
        
      return [
        (index + 1).toString(),
        `APTO ${prop.numero}`,
        prop.tipo,
        nombreTruncado,
        `Bs ${formatNumber(prop.precioNoche || 0)}`,
        prop.estado
      ]
    })
    
    // TABLA PRINCIPAL - com larguras proporcionais
    const columnWidths = [
      maxTableWidth * 0.05,  // #
      maxTableWidth * 0.15,  // APTO
      maxTableWidth * 0.20,  // TIPO
      maxTableWidth * 0.25,  // PROPIETARIO
      maxTableWidth * 0.20,  // PRECIO/NOCHE
      maxTableWidth * 0.15,  // ESTADO
    ]
    
    autoTable(doc, {
      startY: 60,
      head: [['#', 'APARTAMENTO', 'TIPO', 'PROPIETARIO', 'PRECIO/NOCHE', 'ESTADO']],
      body: tableData,
      theme: 'grid',
      headStyles: {
        fillColor: [45, 55, 72],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: PDF_CONFIG.FONT_SIZES.BODY - 1,
        cellPadding: 3,
      },
      styles: {
        fontSize: PDF_CONFIG.FONT_SIZES.SMALL,
        cellPadding: 2,
        textColor: [73, 80, 87],
        overflow: 'linebreak',
        cellWidth: 'wrap'
      },
      columnStyles: {
        0: { cellWidth: columnWidths[0], halign: 'center' },
        1: { cellWidth: columnWidths[1], halign: 'center' },
        2: { cellWidth: columnWidths[2] },
        3: { cellWidth: columnWidths[3] },
        4: { cellWidth: columnWidths[4], halign: 'right' },
        5: { cellWidth: columnWidths[5], halign: 'center' }
      },
      margin: { left: marginLeft, right: marginRight },
      tableWidth: maxTableWidth,
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
    
    doc.setFontSize(PDF_CONFIG.FONT_SIZES.BODY)
    doc.setTextColor(230, 126, 34)
    doc.setFont('helvetica', 'bold')
    doc.text('Nota Importante', marginLeft, finalY)
    
    doc.setFontSize(PDF_CONFIG.FONT_SIZES.SMALL)
    doc.setTextColor(92, 60, 0)
    doc.setFont('helvetica', 'normal')
    
    const notas = [
      '• Este es un resumen general de todas las propiedades.',
      '• Para reportes detallados con cálculos financieros,',
      '  genere los reportes individuales para cada propiedad.'
    ]
    
    notas.forEach((nota, index) => {
      doc.text(nota, marginLeft + 5, finalY + 7 + (index * 5))
    })
    
    // PIE DE PÁGINA
    doc.setFontSize(PDF_CONFIG.FONT_SIZES.SMALL)
    doc.setTextColor(153, 153, 153)
    doc.setFont('helvetica', 'italic')
    doc.text(
      `Resumen generado automáticamente • ${new Date().toLocaleDateString('es-BO')}`,
      pageWidth / 2,
      285,
      { align: 'center' }
    )
    
    // SALVAR
    doc.save(`Resumen_General_${mes.replace(/\//g, '-')}.pdf`)
    
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
    const pageWidth = 297 // A4 landscape width
    const marginLeft = PDF_CONFIG.MARGIN_LEFT
    const marginRight = PDF_CONFIG.MARGIN_RIGHT
    const maxTableWidth = pageWidth - marginLeft - marginRight
    
    // TÍTULO
    doc.setFontSize(PDF_CONFIG.FONT_SIZES.TITLE - 2)
    doc.setTextColor(45, 55, 72)
    doc.setFont('helvetica', 'bold')
    doc.text('REPORTE DE OCUPACIÓN DIARIA', pageWidth / 2, 20, { align: 'center' })
    
    doc.setFontSize(PDF_CONFIG.FONT_SIZES.SUBTITLE)
    doc.setTextColor(77, 171, 247)
    doc.text(fecha, pageWidth / 2, 28, { align: 'center' })
    
    // PREPARAR DATOS
    const tableData = ocupacion.map(o => {
      const propiedad = propiedades.find(p => p.id === o.propiedadId)
      // Truncar textos muito longos
      const huesped = o.huesped && o.huesped.length > 25 
        ? o.huesped.substring(0, 22) + '...' 
        : (o.huesped || '-')
        
      const empresa = o.empresa && o.empresa.length > 20
        ? o.empresa.substring(0, 17) + '...'
        : (o.empresa || '-')
      
      return [
        propiedad?.numero || 'N/A',
        huesped,
        o.estado,
        o.entrada || '-',
        o.salida || '-',
        empresa,
        `Bs ${formatNumber(o.precioNoche || 0)}`,
        o.pagado ? 'Sí' : 'No'
      ]
    })
    
    // Definir larguras proporcionais para landscape
    const columnWidths = [
      maxTableWidth * 0.06,  // APTO
      maxTableWidth * 0.16,  // HUÉSPED
      maxTableWidth * 0.10,  // ESTADO
      maxTableWidth * 0.10,  // ENTRADA
      maxTableWidth * 0.10,  // SALIDA
      maxTableWidth * 0.13,  // EMPRESA
      maxTableWidth * 0.12,  // PRECIO
      maxTableWidth * 0.08,  // PAGADO
    ]
    
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
        fontSize: PDF_CONFIG.FONT_SIZES.BODY - 1,
        cellPadding: 3,
      },
      styles: {
        fontSize: PDF_CONFIG.FONT_SIZES.SMALL,
        cellPadding: 2,
        textColor: [73, 80, 87],
        overflow: 'linebreak'
      },
      columnStyles: {
        0: { cellWidth: columnWidths[0], halign: 'center' },
        1: { cellWidth: columnWidths[1] },
        2: { cellWidth: columnWidths[2], halign: 'center' },
        3: { cellWidth: columnWidths[3], halign: 'center' },
        4: { cellWidth: columnWidths[4], halign: 'center' },
        5: { cellWidth: columnWidths[5], halign: 'center' },
        6: { cellWidth: columnWidths[6], halign: 'right' },
        7: { cellWidth: columnWidths[7], halign: 'center' }
      },
      margin: { left: marginLeft, right: marginRight },
      tableWidth: maxTableWidth,
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
    
    doc.setFontSize(PDF_CONFIG.FONT_SIZES.BODY)
    doc.setTextColor(45, 55, 72)
    doc.setFont('helvetica', 'bold')
    doc.text('Resumen:', marginLeft, finalY)
    
    doc.setFontSize(PDF_CONFIG.FONT_SIZES.BODY - 1)
    doc.setTextColor(73, 80, 87)
    doc.setFont('helvetica', 'normal')
    
    const stats = [
      `Total registros: ${ocupacion.length}`,
      `Ocupados: ${totalOcupados}`,
      `Porcentaje de ocupación: ${porcentaje}%`
    ]
    
    stats.forEach((stat, index) => {
      doc.text(stat, marginLeft + 5, finalY + 8 + (index * 6))
    })
    
    // PIE
    doc.setFontSize(PDF_CONFIG.FONT_SIZES.SMALL)
    doc.setTextColor(153, 153, 153)
    doc.setFont('helvetica', 'italic')
    doc.text(
      `Reporte de ocupación diaria • ${new Date().toLocaleDateString('es-BO')}`,
      pageWidth / 2,
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