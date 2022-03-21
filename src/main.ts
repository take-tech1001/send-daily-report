import './style.css'

import { initializeApp } from './app'

window.addEventListener('DOMContentLoaded', () => {
  const channels = document.getElementsByName(
    'channels'
  ) as NodeListOf<HTMLInputElement>
  const dailyReport = <HTMLDivElement>document.getElementById('daily-report')
  const times = <HTMLDivElement>document.getElementById('times-container')
  const dailyReportSubmit = <HTMLButtonElement>(
    document.getElementById('daily-report-submit')
  )
  const timesSubmit = <HTMLButtonElement>document.getElementById('times-submit')
  const togglButton = <HTMLButtonElement>document.getElementById('toggl')
  const goingWork = <HTMLInputElement>document.getElementById('going-work')
  const leavingWork = <HTMLInputElement>document.getElementById('leaving-work')

  initializeApp({
    channels,
    dailyReport,
    dailyReportSubmit,
    times,
    timesSubmit,
    goingWork,
    leavingWork,
    togglButton
  })
})
