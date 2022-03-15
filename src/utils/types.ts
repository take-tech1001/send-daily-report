type reportName = {
  thinking: string
  doNext: string
  time: string
}

export type reportNames = keyof reportName

export type initializeAppProps = {
  channels: NodeListOf<HTMLInputElement>
  dailyReport: HTMLDivElement
  dailyReportSubmit: HTMLButtonElement
  times: HTMLDivElement
  timesSubmit: HTMLButtonElement
  goingWork: HTMLInputElement
  leavingWork: HTMLInputElement
}

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
}
