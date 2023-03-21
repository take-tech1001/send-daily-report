import type { DIRECTOR_REPORT_NAMES } from './consts'

export type ReportType = 'daily-report' | 'daily-report-dir' | 'times'

export type EngineerReportNames = 'thinking' | 'doNext'
export type DirectorReportNames = (typeof DIRECTOR_REPORT_NAMES)[number]
export type ReportNames = EngineerReportNames | DirectorReportNames | 'times'
