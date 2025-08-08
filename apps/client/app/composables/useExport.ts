export const useExport = () => {
  const exportToCSV = (data: any[], filename: string) => {
    if (data.length === 0) return

    const headers = Object.keys(data[0])
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header]
          // Екрануємо коми та лапки
          const escapedValue = String(value).replace(/"/g, '""')
          return `"${escapedValue}"`
        }).join(',')
      )
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `${filename}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const exportToJSON = (data: any, filename: string) => {
    const jsonContent = JSON.stringify(data, null, 2)
    const blob = new Blob([jsonContent], { type: 'application/json' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `${filename}.json`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const exportAssignmentsToCSV = (assignments: any[]) => {
    const csvData = assignments.map(assignment => ({
      'Назва': assignment.title,
      'Опис': assignment.description,
      'Складність': assignment.difficulty,
      'Дедлайн': new Date(assignment.deadline).toLocaleDateString('uk-UA'),
      'Кількість подань': assignment._count.submissions,
      'Кількість тестів': assignment.testCases.length,
      'Статус': new Date(assignment.deadline) > new Date() ? 'Активне' : 'Завершене'
    }))

    exportToCSV(csvData, 'assignments')
  }

  const exportSubmissionsToCSV = (submissions: any[]) => {
    const csvData = submissions.map(submission => ({
      'ID подання': submission.id,
      'Назва завдання': submission.assignment.title,
      'Бал': submission.score,
      'Статус': submission.status,
      'Мова програмування': submission.language || 'Не вказано',
      'Дата подання': new Date(submission.createdAt).toLocaleDateString('uk-UA'),
      'Дата оновлення': new Date(submission.updatedAt).toLocaleDateString('uk-UA')
    }))

    exportToCSV(csvData, 'submissions')
  }

  const exportAssignmentResultsToCSV = (assignment: any, submissions: any[]) => {
    const csvData = submissions.map(submission => ({
      'ID подання': submission.id,
      'Бал': submission.score,
      'Статус': submission.status,
      'Мова програмування': submission.language || 'Не вказано',
      'Дата подання': new Date(submission.createdAt).toLocaleDateString('uk-UA'),
      'Кількість тестів': submission.testResults?.length || 0,
      'Кількість помилок лінтингу': submission.eslintReport?.length || 0
    }))

    exportToCSV(csvData, `assignment_${assignment.id}_results`)
  }

  const printPage = () => {
    window.print()
  }

  const printElement = (elementId: string) => {
    const element = document.getElementById(elementId)
    if (!element) return

    const printWindow = window.open('', '_blank')
    if (!printWindow) return

    printWindow.document.write(`
      <html>
        <head>
          <title>Друк</title>
          <style>
            body { font-family: Arial, sans-serif; }
            @media print {
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          ${element.outerHTML}
        </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.print()
  }

  return {
    exportToCSV,
    exportToJSON,
    exportAssignmentsToCSV,
    exportSubmissionsToCSV,
    exportAssignmentResultsToCSV,
    printPage,
    printElement
  }
} 