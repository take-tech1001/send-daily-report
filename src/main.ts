import './style.css'

const saveStorageValue = (key: string, elem: HTMLTextAreaElement) => {
  if (!elem.value) {
    alert('値を入力してください')
    return
  }

  const storageKey = key
  chrome.storage.sync.set({
    [storageKey]: elem.value
  })

  alert('保存しました')
}

const removeStorageValue = (
  clearButton: HTMLButtonElement,
  value: string,
  index: number
) => {
  clearButton.classList.remove('bg-[#cccccc]')
  clearButton.classList.add('bg-red-500')
  clearButton.style.pointerEvents = 'auto'
  clearButton.addEventListener('click', () => {
    chrome.storage.sync.remove([value + index], () => {
      console.log('削除しました')
    })
  })
}

const handleSaveValue = (
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

const getDailyReportElement = (kind: string, value: string) => {
  return `<div class="${kind}-content grid grid-cols-[1fr,80px] items-center mt-3">
    <textarea
      id="${kind}"
      cols="30"
      rows="3"
      class="border border-gray-800 px-2 rounded-md row-start-1 row-end-3 text-[14px]"
    >${value}</textarea>
    <button
      class="${kind}-clear-button text-[13px] ml-3 mb-[5px] py-[5px] rounded-md bg-[#cccccc] hover:bg-red-400 text-white font-bold pointer-events-none"
    >
      クリア
    </button>
    <button
      class="${kind}-save-button text-[13px] ml-3 py-[5px] rounded-md bg-blue-500 hover:bg-blue-400 text-white font-bold"
    >
      保存する
    </button>
  </div>`
}

const handleSubmit = () => {
  const thinkingItems = document.querySelectorAll<HTMLTextAreaElement>(
    '.thinkings textarea'
  )
  const doNextItems = document.querySelectorAll<HTMLTextAreaElement>(
    '.doNext-list textarea'
  )

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
      text: postContent
    },
    (response) => {
      console.log(response)
      alert(response.message)
    }
  )
}

window.addEventListener('DOMContentLoaded', () => {
  const thinkingCreateButton = document.getElementById('thinking-create-button')
  const thinkings = document.getElementById('thinkings')!
  // const doNextCreateButton = document.getElementById('doNext-create-button')
  // const doNextList = document.getElementById('doNext-list')

  chrome.storage.sync.get(['thinkingElem'], (items) => {
    if (items['thinkingElem']) {
      const thinkingElem = items['thinkingElem']
      thinkingElem.forEach((elem: number) => {
        chrome.storage.sync.get([`thinking${elem}`], (items) => {
          if (items[`thinking${elem}`] !== undefined) {
            // console.log(items[`thinking${elem}`])
            thinkings?.insertAdjacentHTML(
              'beforeend',
              getDailyReportElement('thinkings', items[`thinking${elem}`])
            )
          }
        })
      })
    }
  })

  thinkingCreateButton?.addEventListener('click', (e) => {
    e.preventDefault()
    thinkings?.insertAdjacentHTML(
      'beforeend',
      getDailyReportElement('thinkings', '')
    )
  })

  const callback = (mutations: any): void => {
    mutations.forEach((mutation: any) => {
      const childElementCount: number = thinkings.childElementCount - 1
      mutation.addedNodes.forEach((node: HTMLDivElement) => {
        const textArea = <HTMLTextAreaElement>node.children[0]
        const clearButton = <HTMLButtonElement>node.children[1]
        const saveButton = <HTMLButtonElement>node.children[2]
        saveButton.addEventListener('click', () => {
          saveStorageValue(`thinking${childElementCount}`, textArea)

          chrome.storage.sync.get(['thinkingElem'], (items) => {
            const count = []
            if (items['thinkingElem']) {
              console.log(items['thinkingElem'].indexOf(childElementCount))

              const isExist = items['thinkingElem'].indexOf(childElementCount)
              if (isExist !== -1) {
                console.log(true)
                return
              }
              count.push(...items['thinkingElem'], ...[childElementCount])
            } else {
              console.log(false)
              count.push(childElementCount)
            }

            chrome.storage.sync.set({
              thinkingElem: count
            })
          })
        })

        if (!textArea.value) return

        removeStorageValue(clearButton, 'thinking', childElementCount)
      })
    })
  }
  const mutationObserver = new MutationObserver(callback)

  const option = {
    childList: true,
    subtree: true
  }
  mutationObserver.observe(thinkings, option)

  const thinkingContents =
    document.querySelectorAll<HTMLDivElement>('.thinking-content')
  const doNextContents =
    document.querySelectorAll<HTMLDivElement>('.doNext-content')

  thinkingContents.forEach((content, index) => {
    handleSaveValue(content, 'thinking', index)
  })
  doNextContents.forEach((content, index) => {
    handleSaveValue(content, 'doNext', index)
  })

  const submit = document.getElementById('submit')
  submit?.addEventListener('click', (e) => {
    e.preventDefault()
    handleSubmit()
  })
})
