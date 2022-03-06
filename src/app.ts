import * as events from './utils/events'
import type { reportNames } from './utils/types'

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

export const initializeDailyReport = () => {
  ;['thinking', 'doNext'].forEach((name) => {
    handleRegisterEvents(name as reportNames)
  })
}
