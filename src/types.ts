import type { DIRECTOR_REPORT_NAMES } from './consts'

export type ReportType = 'daily-report' | 'daily-report-dir' | 'times'

export type EngineerReportNames = 'thinking' | 'doNext'
export type DirectorReportNames = typeof DIRECTOR_REPORT_NAMES[number]
export type ReportNames = EngineerReportNames | DirectorReportNames | 'times'

export type togglResponse = {
  id: number
  guid: string
  wid: number
  billable: boolean
  start: string
  stop: string
  duration: number
  description: string
  duronly: boolean
  at: string
  uid: number
}

export type togglResponses = {
  data: togglResponse[]
  status: boolean
  message?: string
}
