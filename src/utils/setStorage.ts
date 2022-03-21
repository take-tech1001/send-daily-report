export const saveStorageValue = (key: string, elem: HTMLTextAreaElement) => {
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

export const removeStorageValue = (
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

export const setReportType = (value: string) => {
  chrome.storage.sync.get(['ReportType'], (items) => {
    const reportType = items.ReportType

    if (reportType && reportType === value) {
      return
    }

    chrome.storage.sync.set({
      ReportType: value
    })
  })
}

export const setWorkTime = (elem: HTMLInputElement, key: string) => {
  chrome.storage.sync.get([key], (item) => {
    const workTime = item[key]

    if (workTime) {
      elem.value = workTime
    }

    elem.addEventListener('change', (e: any) => {
      e.preventDefault()

      chrome.storage.sync.set({
        [key]: e.target.value
      })
    })
  })
}
