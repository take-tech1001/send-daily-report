import 'crx-hotreload'

import { format } from 'date-fns'

// const POST_MESSAGE_API_URL = 'https://slack.com/api/chat.postMessage'
const FILES_UPLOAD_API_URL = 'https://slack.com/api/files.upload'

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (!message) {
    console.log('message is missing')

    sendResponse({
      status: false,
      reason: 'message is missing'
    })
  } else {
    chrome.storage.sync.get(['token', 'channelID', 'myName'], (items) => {
      const token = items.token
      const channelID = items.channelID
      const myName = items.myName
      console.log(sender)

      if (!token || !channelID) {
        alert('SlackのTokenとチャンネルIDを登録してください。')
        return
      }

      // const param = {
      //   method: 'POST',
      //   body: JSON.stringify({
      //     channel: channelID,
      //     text: message.text
      //   }),
      //   headers: {
      //     'Content-type': 'application/json; charset=UTF-8',
      //     Authorization: token
      //   }
      // }
      // fetch(POST_MESSAGE_API_URL, param)
      //   .then((res) => res.json())
      //   .then((json) => {
      //     console.log('post', json)
      //   })
      //   .catch((e) => console.error(e.message))

      // https://stackoverflow.com/questions/54368616/no-file-data-response-in-slack-file-upload
      const form = new FormData()
      form.append('channels', channelID)
      form.append('content', message.text)
      form.append(
        'title',
        `【日報】${myName} ${format(new Date(), 'yyyy/MM/dd')}`
      )
      form.append('filetype', 'post')

      const param = {
        method: 'POST',
        body: form,
        headers: {
          Authorization: token
        }
      }
      fetch(FILES_UPLOAD_API_URL, param)
        .then((res) => res.json())
        .then((json) => {
          console.log('post', json)
          sendResponse({
            status: true,
            message: '送信しました'
          })
        })
        .catch((e) => console.error(e.message))
    })
  }

  return true
})
