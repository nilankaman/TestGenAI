// Export utilities — loaded from CDN at runtime so they
// don't bloat the main bundle.

export async function exportToPdf(testCases, opts = {}) {
  const { default: jsPDF } = await import('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js')
  const doc     = new jsPDF()
  const project = opts.project   || 'TestGen AI'
  const fw      = opts.framework || ''

  doc.setFontSize(18)
  doc.setFont(undefined, 'bold')
  doc.text(project, 14, 20)

  doc.setFontSize(10)
  doc.setFont(undefined, 'normal')
  doc.setTextColor(100)
  doc.text(`Framework: ${fw}  |  Generated: ${new Date().toLocaleString()}  |  ${testCases.length} test cases`, 14, 28)
  doc.setTextColor(0)

  let y = 38
  const pageH = doc.internal.pageSize.height

  testCases.forEach((tc, i) => {
    if (y > pageH - 40) { doc.addPage(); y = 20 }

    doc.setFontSize(11)
    doc.setFont(undefined, 'bold')
    doc.text(`${i + 1}. ${tc.title}`, 14, y)
    y += 6

    doc.setFontSize(9)
    doc.setFont(undefined, 'normal')
    doc.setTextColor(80)
    doc.text(`Type: ${tc.type}   Method: ${tc.methodName || '—'}`, 14, y)
    y += 5

    if (tc.description) {
      doc.setTextColor(60)
      const lines = doc.splitTextToSize(tc.description, 182)
      doc.text(lines, 14, y)
      y += lines.length * 4.5
    }

    doc.setTextColor(0)
    y += 6
  })

  doc.save(`${project.replace(/\s+/g, '-')}-tests.pdf`)
}


export async function exportToExcel(testCases, opts = {}) {
  const XLSX    = await import('https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js')
  const project = opts.project || 'TestGen AI'

  const rows = testCases.map(tc => ({
    Title:        tc.title,
    Type:         tc.type,
    'Method Name':tc.methodName || '',
    Description:  tc.description || '',
    'Code Snippet':tc.codeSnippet || '',
  }))

  const ws  = XLSX.utils.json_to_sheet(rows)
  const wb  = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Test Cases')
  XLSX.writeFile(wb, `${project.replace(/\s+/g, '-')}-tests.xlsx`)
}


export async function captureScreenshot(elementId = 'test-output') {
  const el = document.getElementById(elementId)
  if (!el) {
    alert('Could not find the test output area to screenshot.')
    return
  }

  const { default: html2canvas } = await import('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js')
  const canvas = await html2canvas(el, { scale: 2, useCORS: true })
  const link   = document.createElement('a')
  link.download = 'testgen-screenshot.png'
  link.href     = canvas.toDataURL('image/png')
  link.click()
}
