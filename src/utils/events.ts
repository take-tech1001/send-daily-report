import { dailyReportElement } from './elements'
import { ISOtoDate } from './functions'
import { removeStorageValue, saveStorageValue } from './setStorage'
import type { reportNames, togglResponses } from './types'

export const handleSaveValue = (
  elem: HTMLDivElement,
  value: string,
  index: number
): void => {
  chrome.storage.sync.get([value + index], (items) => {
    const currentInput = <HTMLTextAreaElement>elem.children[0]
    const currentClearButton = <HTMLButtonElement>elem.children[1]
    const currentSaveButton = <HTMLButtonElement>elem.children[2]
    const storageValue = items[value + index]

    if (storageValue) {
      currentInput.value = storageValue

      removeStorageValue(currentClearButton, value, index)
    }

    currentSaveButton.addEventListener('click', () => {
      saveStorageValue(value + index, currentInput)
    })
  })
}

export const handleIncrementElement = (
  elem: HTMLDivElement,
  name: reportNames,
  incrementButton: HTMLButtonElement
) => {
  incrementButton?.addEventListener('click', (e) => {
    e.preventDefault()
    elem?.insertAdjacentHTML('beforeend', dailyReportElement(name, ''))
  })
}

export const handleDecrementElement = (
  elem: HTMLDivElement,
  name: reportNames,
  decrementButton: HTMLButtonElement
) => {
  decrementButton?.addEventListener('click', (e) => {
    e.preventDefault()
    if (elem.childElementCount >= 2) {
      chrome.storage.sync.get([`${name}Elem`], (items) => {
        const storageElems = items[`${name}Elem`]
        if (storageElems && storageElems.length >= 1) {
          chrome.storage.sync.set({
            [`${name}Elem`]: storageElems.slice(0, -1)
          })
        }
      })

      elem.lastElementChild?.remove()
    } else {
      alert('これ以上削除することはできません')
    }
  })
}

export const showLoadedElement = (elem: HTMLDivElement, name: reportNames) => {
  chrome.storage.sync.get([`${name}Elem`], (items) => {
    const storageElems = items[`${name}Elem`]
    if (storageElems) {
      storageElems.forEach((index: number) => {
        chrome.storage.sync.get([name + index], (items) => {
          const storageValue = items[name + index]
          elem?.insertAdjacentHTML(
            'beforeend',
            dailyReportElement(
              name,
              storageValue !== undefined ? storageValue : ''
            )
          )
        })
      })
    }
  })
}

export const mutationObserve = (elem: HTMLDivElement, name: reportNames) => {
  const callback = (mutations: any): void => {
    mutations.forEach((mutation: any) => {
      const childElementCount: number = elem.childElementCount - 1
      mutation.addedNodes.forEach((node: HTMLDivElement) => {
        const textArea = <HTMLTextAreaElement>node.children[0]
        const clearButton = <HTMLButtonElement>node.children[1]
        const saveButton = <HTMLButtonElement>node.children[2]

        saveButton.addEventListener('click', () => {
          saveStorageValue(name + childElementCount, textArea)

          chrome.storage.sync.get([`${name}Elem`], (items) => {
            const count = []
            const elems = items[`${name}Elem`]
            if (elems) {
              const isExist = elems.includes(childElementCount)

              if (isExist) {
                return
              }

              count.push(...elems, ...[childElementCount])
            } else {
              count.push(childElementCount)
            }

            chrome.storage.sync.set({
              [`${name}Elem`]: count
            })
          })
        })

        if (!textArea.value) return

        removeStorageValue(clearButton, name, childElementCount)
      })
    })
  }
  const mutationObserver = new MutationObserver(callback)

  const option = {
    childList: true,
    subtree: true
  }
  mutationObserver.observe(elem, option)
}

export const handleTogglAlignment = (
  togglButton: HTMLButtonElement,
  goingWork: HTMLInputElement,
  leavingWork: HTMLInputElement
) => {
  togglButton.addEventListener('click', (e: any) => {
    e.preventDefault()

    chrome.runtime.sendMessage(
      {
        type: 'toggl'
      },
      (response: togglResponses) => {
        if (!response.status) {
          alert(response.message)
          return
        }

        const times = <HTMLButtonElement>document.getElementById('times')
        const timeContent = document.querySelectorAll('.time-content')
        timeContent.forEach((content) => content.remove())

        const data = response.data
        const length = data.length
        const elems = [...Array(length)].map((_, i) => i + 1).slice(0, -1)
        const workStart = ISOtoDate(data[0].start)
        const workEnd = ISOtoDate(data[data.length - 1].stop)

        goingWork.value = workStart
        leavingWork.value = workEnd

        chrome.storage.sync.set({
          timeElem: elems,
          goingWork: workStart,
          leavingWork: workEnd
        })

        data.forEach((item, index) => {
          const start = ISOtoDate(item.start)
          const stop = ISOtoDate(item.stop)
          const body = `${item.description}（${start} - ${stop}）`

          chrome.storage.sync.set({
            [`time${index}`]: body
          })
          times?.insertAdjacentHTML(
            'beforeend',
            dailyReportElement('time', body)
          )
        })
      }
    )
  })
}

const dailyReportSubmitEvent = (e: any) => {
  e.preventDefault()

  const thinkingItems: NodeListOf<HTMLTextAreaElement> =
    document.querySelectorAll('.thinkings textarea')
  const doNextItems: NodeListOf<HTMLTextAreaElement> =
    document.querySelectorAll('.doNexts textarea')

  let thinkingText = ''
  let doNextText = ''

  thinkingItems.forEach((item): void => {
    thinkingText += `・${item.value}\n`
  })

  doNextItems.forEach((item): void => {
    doNextText += `・${item.value}\n`
  })

  const postContent = `
      【思ったこと】\n${thinkingText} \n\n 【次やること】\n${doNextText}
      `

  chrome.runtime.sendMessage(
    {
      type: 'daily-report',
      text: postContent
    },
    (response) => {
      console.log(response)
      alert(response.message)
    }
  )
}

export const handleDailyReportSubmit = (submitElem: HTMLButtonElement) => {
  submitElem.addEventListener('click', dailyReportSubmitEvent)
}

export const handleReleaseDailyReportSubmit = (
  submitElem: HTMLButtonElement
) => {
  submitElem.removeEventListener('click', dailyReportSubmitEvent)
}

const timesSubmitEvent = (e: any) => {
  e.preventDefault()

  const goingWork = <HTMLInputElement>document.getElementById('going-work')
  const leavingWork = <HTMLInputElement>document.getElementById('leaving-work')
  const timeItems: NodeListOf<HTMLTextAreaElement> =
    document.querySelectorAll('.times textarea')

  let timesText = ''

  timeItems.forEach((item): void => {
    timesText += `${item.value}\n`
  })

  const dateObj = new Date()
  const month = String(dateObj.getMonth() + 1)
    .toString()
    .padStart(2, '0')
  const date = String(dateObj.getDate().toString().padStart(2, '0'))
  const postContent = `
    ${month}/${date} ${goingWork.value} - ${leavingWork.value}\n${timesText}
  `

  chrome.runtime.sendMessage(
    {
      type: 'times',
      text: postContent
    },
    (response) => {
      console.log(response)
      alert(response.message)
    }
  )
}

export const handleTimesSubmit = (submitElem: HTMLButtonElement) => {
  submitElem.addEventListener('click', timesSubmitEvent)
}

export const handleReleaseTimeSubmit = (submitElem: HTMLButtonElement) => {
  submitElem.removeEventListener('click', timesSubmitEvent)
}
