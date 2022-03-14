import * as events from './utils/events'
import { setReportType, setWorkTime } from './utils/setStorage'
import type { initializeAppProps, reportNames } from './utils/types'

const handleRegisterEvents = (name: reportNames) => {
  const elements: any = {
    [`${name}s`]: document.getElementById(`${name}s`),
    [`${name}IncrementButton`]: document.getElementById(
      `${name}-create-button`
    ),
    [`${name}DecrementButton`]: document.getElementById(
      `${name}-remove-button`
    ),
    [`${name}Contents`]: document.querySelectorAll(`.${name}-content`)
  }

  events.showLoadedElement(elements[`${name}s`], name)
  events.handleIncrementElement(
    elements[`${name}s`],
    name,
    elements[`${name}IncrementButton`]
  )
  events.handleDecrementElement(
    elements[`${name}s`],
    name,
    elements[`${name}DecrementButton`]
  )
  events.mutationObserve(elements[`${name}s`], name)
  elements[`${name}Contents`].forEach(
    (content: HTMLDivElement, index: number) => {
      events.handleSaveValue(content, name, index)
    }
  )
}

export const initializeApp = (props: initializeAppProps) => {
  const {
    channels,
    dailyReport,
    dailyReportSubmit,
    times,
    timesSubmit,
    goingWork,
    leavingWork
  } = props
  setWorkTime(goingWork, 'goingWork')
  setWorkTime(leavingWork, 'leavingWork')
  chrome.storage.sync.get(['ReportType'], (items) => {
    const reportType = items.ReportType

    if (reportType === 'times') {
      channels[1].checked = true
      dailyReport.style.display = 'none'
      times.style.display = ''
      setReportType('times')
      events.handleTimesSubmit(timesSubmit)
    } else {
      channels[0].checked = true
      times.style.display = 'none'
      dailyReport.style.display = ''
      setReportType('dailyReport')
      events.handleDailyReportSubmit(dailyReportSubmit)
    }
  })
  ;['thinking', 'doNext', 'time'].forEach((name) => {
    handleRegisterEvents(name as reportNames)
  })
}
