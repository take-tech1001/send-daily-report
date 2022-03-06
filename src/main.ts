import './style.css'

import { initializeDailyReport } from './app'
import { handleDailyReportSubmit } from './utils/events'

window.addEventListener('DOMContentLoaded', () => {
  const channels = document.getElementsByName(
    'channels'
  ) as NodeListOf<HTMLInputElement>
  const dailyReport = <HTMLDivElement>document.getElementById('daily-report')
  const times = <HTMLDivElement>document.getElementById('times-container')
  const submit = <HTMLButtonElement>document.getElementById('submit')

  times.style.display = 'none'

  initializeDailyReport()
  if (channels[0].checked) {
    handleDailyReportSubmit(submit)
  }

  channels.forEach((r: any) => {
    r.addEventListener('click', () => {
      if (channels[0].checked) {
        dailyReport.style.display = ''
        times.style.display = 'none'

        handleDailyReportSubmit(submit)
      } else if (channels[1].checked) {
        dailyReport.style.display = 'none'
        times.style.display = ''
      }
    })
  })
})
