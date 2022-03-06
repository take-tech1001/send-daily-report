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
