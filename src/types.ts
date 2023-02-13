export type ReportType = 'thinking' | 'doNext' | 'times'

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
