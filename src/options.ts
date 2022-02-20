const formButton = document.getElementById('formButton')!

const appendSavedElement = (): void => {
  const elem = document.createElement('div')
  elem.innerHTML = '保存しました'
  elem.style.fontSize = '14px'
  elem.style.textAlign = 'center'
  elem.style.border = '1px solid blue'
  elem.style.padding = '8px 0'
  elem.style.marginTop = '15px'

  const formElem = document.getElementById('settingForm')
  formElem?.appendChild(elem)
}

formButton.onclick = () => {
  const token: HTMLInputElement = <HTMLInputElement>(
    document.getElementById('token')
  )
  const channelID: HTMLInputElement = <HTMLInputElement>(
    document.getElementById('channelID')
  )
  const myName: HTMLInputElement = <HTMLInputElement>(
    document.getElementById('myName')
  )

  if (!token.value && !channelID.value && !myName.value) return

  chrome.storage.sync.get(['token', 'channelID', 'myName'], (items) => {
    console.log('token:' + items.token)
    console.log('channelID:' + items.channelID)
    console.log('myName:' + items.myName)

    chrome.storage.sync.set({
      token: token.value ? token.value : items.token,
      channelID: channelID.value ? channelID.value : items.channelID,
      myName: myName.value ? myName.value : items.myName
    })
  })

  chrome.storage.onChanged.addListener((changes, namespace) => {
    for (const [key, { oldValue, newValue }] of Object.entries(changes)) {
      console.log(
        `Storage key "${key}" in namespace "${namespace}" changed.`,
        `Old value was "${oldValue}", new value is "${newValue}".`
      )
    }
  })

  appendSavedElement()
}
