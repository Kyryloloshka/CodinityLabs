import type { CheckCodeResponse, TestResult, LintError } from '~/lib/types'

export const useTestResults = () => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'success'
    if (score >= 60) return 'warning'
    return 'error'
  }

  const getSeverityColor = (severity: number) => {
    switch (severity) {
      case 0:
        return 'info'
      case 1:
        return 'warning'
      case 2:
        return 'error'
      default:
        return 'secondary'
    }
  }

  const getSeverityLabel = (severity: number) => {
    switch (severity) {
      case 0:
        return 'Інфо'
      case 1:
        return 'Попередження'
      case 2:
        return 'Помилка'
      default:
        return 'Невідомо'
    }
  }

  const getPassedTestsCount = (tests: TestResult[]) => {
    return tests.filter(test => test.passed).length
  }

  const getFailedTestsCount = (tests: TestResult[]) => {
    return tests.filter(test => !test.passed).length
  }

  const getTimeoutTestsCount = (tests: TestResult[]) => {
    return tests.filter(test => test.timeout).length
  }

  const getLintErrorsCount = (lint: LintError[]) => {
    return lint.filter(error => error.severity === 2).length
  }

  const getLintWarningsCount = (lint: LintError[]) => {
    return lint.filter(error => error.severity === 1).length
  }

  const getLintInfoCount = (lint: LintError[]) => {
    return lint.filter(error => error.severity === 0).length
  }

  return {
    getScoreColor,
    getSeverityColor,
    getSeverityLabel,
    getPassedTestsCount,
    getFailedTestsCount,
    getTimeoutTestsCount,
    getLintErrorsCount,
    getLintWarningsCount,
    getLintInfoCount
  }
} 