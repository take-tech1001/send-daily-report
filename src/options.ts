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
  const token = <HTMLInputElement>document.getElementById('token')
  const channelID = <HTMLInputElement>document.getElementById('channelID')
  const timesChannelID = <HTMLInputElement>(
    document.getElementById('timesChannelID')
  )
  const myName = <HTMLInputElement>document.getElementById('myName')
  const toggl = <HTMLInputElement>document.getElementById('toggl')

  if (
    !token.value &&
    !channelID.value &&
    !timesChannelID.value &&
    !myName.value &&
    !toggl.value
  ) {
    alert('値を入力してください')
    return
  }

  chrome.storage.sync.get(
    ['token', 'channelID', 'timesChannelID', 'myName', 'toggl'],
    (items) => {
      console.log('token:' + items.token)
      console.log('channelID:' + items.channelID)
      console.log('timesChannelID:' + items.timesChannelID)
      console.log('myName:' + items.myName)
      console.log('toggl:' + items.toggl)

      chrome.storage.sync.set({
        token: token.value ? `Bearer ${token.value}` : items.token,
        channelID: channelID.value ? channelID.value : items.channelID,
        timesChannelID: timesChannelID.value
          ? timesChannelID.value
          : items.timesChannelID,
        myName: myName.value ? myName.value : items.myName,
        toggl: toggl.value ? toggl.value : items.toggl
      })
    }
  )

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
