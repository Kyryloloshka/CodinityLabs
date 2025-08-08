import type { Assignment, Submission } from '~/lib/types'

export const useAnalytics = () => {
  const calculateAssignmentStats = (assignments: Assignment[]) => {
    const total = assignments.length
    const active = assignments.filter(a => new Date(a.deadline) > new Date()).length
    const expired = total - active
    
    const avgDifficulty = assignments.length > 0 
      ? assignments.reduce((sum, a) => sum + a.difficulty, 0) / assignments.length 
      : 0
    
    const totalSubmissions = assignments.reduce((sum, a) => sum + a._count.submissions, 0)
    const avgSubmissions = assignments.length > 0 ? totalSubmissions / assignments.length : 0
    
    const totalTests = assignments.reduce((sum, a) => sum + a.testCases.length, 0)
    const avgTests = assignments.length > 0 ? totalTests / assignments.length : 0

    return {
      total,
      active,
      expired,
      avgDifficulty: Math.round(avgDifficulty * 10) / 10,
      totalSubmissions,
      avgSubmissions: Math.round(avgSubmissions * 10) / 10,
      totalTests,
      avgTests: Math.round(avgTests * 10) / 10
    }
  }

  const calculateSubmissionStats = (submissions: Submission[]) => {
    const total = submissions.length
    const completed = submissions.filter(s => s.status === 'COMPLETED').length
    const failed = submissions.filter(s => s.status === 'FAILED').length
    const pending = submissions.filter(s => s.status === 'PENDING').length
    const processing = submissions.filter(s => s.status === 'PROCESSING').length
    
    const avgScore = submissions.length > 0 
      ? submissions.reduce((sum, s) => sum + s.score, 0) / submissions.length 
      : 0
    
    const perfectScores = submissions.filter(s => s.score === 100).length
    const passingScores = submissions.filter(s => s.score >= 60).length
    
    const languageStats = submissions.reduce((acc, s) => {
      const lang = s.language || 'Не вказано'
      acc[lang] = (acc[lang] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return {
      total,
      completed,
      failed,
      pending,
      processing,
      avgScore: Math.round(avgScore * 10) / 10,
      perfectScores,
      passingScores,
      languageStats
    }
  }

  const calculateAssignmentPerformance = (assignment: Assignment, submissions: Submission[]) => {
    const assignmentSubmissions = submissions.filter(s => s.assignmentId === assignment.id)
    
    if (assignmentSubmissions.length === 0) {
      return {
        totalSubmissions: 0,
        avgScore: 0,
        completionRate: 0,
        successRate: 0,
        topScore: 0,
        lowestScore: 0
      }
    }

    const completedSubmissions = assignmentSubmissions.filter(s => s.status === 'COMPLETED')
    const avgScore = completedSubmissions.length > 0 
      ? completedSubmissions.reduce((sum, s) => sum + s.score, 0) / completedSubmissions.length 
      : 0
    
    const topScore = Math.max(...completedSubmissions.map(s => s.score))
    const lowestScore = Math.min(...completedSubmissions.map(s => s.score))
    
    const completionRate = (completedSubmissions.length / assignmentSubmissions.length) * 100
    const successRate = completedSubmissions.length > 0 
      ? (completedSubmissions.filter(s => s.score >= 60).length / completedSubmissions.length) * 100 
      : 0

    return {
      totalSubmissions: assignmentSubmissions.length,
      avgScore: Math.round(avgScore * 10) / 10,
      completionRate: Math.round(completionRate * 10) / 10,
      successRate: Math.round(successRate * 10) / 10,
      topScore,
      lowestScore
    }
  }

  const generateDifficultyDistribution = (assignments: Assignment[]) => {
    const distribution = Array(10).fill(0)
    
    assignments.forEach(assignment => {
      const difficulty = Math.min(Math.max(assignment.difficulty, 1), 10)
      distribution[difficulty - 1]++
    })
    
    return distribution
  }

  const generateScoreDistribution = (submissions: Submission[]) => {
    const completedSubmissions = submissions.filter(s => s.status === 'COMPLETED')
    const distribution = Array(10).fill(0)
    
    completedSubmissions.forEach(submission => {
      const scoreGroup = Math.floor(submission.score / 10)
      distribution[scoreGroup]++
    })
    
    return distribution
  }

  const generateTimeSeriesData = (submissions: Submission[], days: number = 30) => {
    const data = []
    const now = new Date()
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now)
      date.setDate(date.getDate() - i)
      
      const dayStart = new Date(date)
      dayStart.setHours(0, 0, 0, 0)
      
      const dayEnd = new Date(date)
      dayEnd.setHours(23, 59, 59, 999)
      
      const daySubmissions = submissions.filter(s => {
        const submissionDate = new Date(s.createdAt)
        return submissionDate >= dayStart && submissionDate <= dayEnd
      })
      
      data.push({
        date: date.toISOString().split('T')[0],
        submissions: daySubmissions.length,
        avgScore: daySubmissions.length > 0 
          ? daySubmissions.reduce((sum, s) => sum + s.score, 0) / daySubmissions.length 
          : 0
      })
    }
    
    return data
  }

  return {
    calculateAssignmentStats,
    calculateSubmissionStats,
    calculateAssignmentPerformance,
    generateDifficultyDistribution,
    generateScoreDistribution,
    generateTimeSeriesData
  }
} 