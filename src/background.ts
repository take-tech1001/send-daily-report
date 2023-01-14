import {
  CHANGE_STATUS_API_URL,
  FILES_UPLOAD_API_URL,
  POST_MESSAGE_API_URL,
  TOGGL_API_URL
} from '@consts'
import { removeDabbleQuote, toBoolean } from '@utils'
import { format } from 'date-fns'

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (!request) {
    console.log('request is missing')

    sendResponse({
      status: false,
      reason: 'request is missing'
    })

    return
  }

  if (request.type === 'daily-report') {
    chrome.storage.sync.get(
      ['token', 'channelID', 'myName', 'fileType'],
      (result) => {
        const token = removeDabbleQuote(result.token)
        const channelID = removeDabbleQuote(result.channelID)
        const myName = removeDabbleQuote(result.myName)
        const fileType = toBoolean(removeDabbleQuote(request.fileType))

        if (!token) {
          sendResponse({
            status: false,
            message: 'トークンを登録してください。'
          })
          return
        } else if (!channelID) {
          sendResponse({
            status: false,
            message:
              '日報を投稿するチャンネルのチャンネルIDを登録してください。'
          })
          return
        } else if (!myName) {
          sendResponse({
            status: false,
            message: '自分の名前を登録してください。'
          })
          return
        }

        const changeStatusParam = {
          method: 'POST',
          body: JSON.stringify({
            profile: {
              status_text: '退勤',
              status_emoji: ':taikin:',
              status_expiration: 0
            }
          }),
          headers: {
            Authorization: token,
            'Content-Type': 'application/json'
          }
        }

        const form = new FormData()
        form.append('channels', channelID)
        form.append('content', request.text)
        form.append(
          'title',
          `【日報】${myName} ${format(new Date(request.date), 'yyyy/MM/dd')}`
        )

        form.append('filetype', fileType ? 'markdown' : 'post')

        const fileUploadParam = {
          method: 'POST',
          body: form,
          headers: {
            Authorization: token
          }
        }

        Promise.all([
          fetch(CHANGE_STATUS_API_URL, changeStatusParam),
          fetch(FILES_UPLOAD_API_URL, fileUploadParam)
        ])
          .then((responses) => {
            responses.forEach((response) => {
              if (!response.ok) {
                sendResponse({
                  status: false,
                  message: response.statusText
                })
                return
              }
            })

            sendResponse({
              status: true,
              message: '送信しました。'
            })
          })
          .catch((e) => {
            console.error(e.message)
            sendResponse({
              status: false,
              message:
                '送信に失敗しました。拡張機能を更新して再度お試しください。'
            })
          })
      }
    )

    return true
  }

  if (request.type === 'times') {
    chrome.storage.sync.get(
      ['token', 'timesChannelID', 'fileType'],
      (result) => {
        const token = removeDabbleQuote(result.token)
        const timesChannelID = removeDabbleQuote(result.timesChannelID)
        const fileType = toBoolean(removeDabbleQuote(request.fileType))

        if (!token) {
          sendResponse({
            status: false,
            message: 'トークンを登録してください。'
          })
          return
        } else if (!timesChannelID) {
          sendResponse({
            status: false,
            message:
              'timesを投稿するチャンネルのチャンネルIDを登録してください。'
          })
          return
        }

        if (fileType) {
          const form = new FormData()
          form.append('channels', timesChannelID)
          form.append('content', request.text)
          form.append('filetype', 'markdown')
          form.append('title', request.title)

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
              sendResponse({
                status: true,
                message: '送信しました'
              })
            })
            .catch((e) => {
              console.error(e.message)
              sendResponse({
                status: false,
                message:
                  '送信に失敗しました。拡張機能を更新して再度お試しください。'
              })
            })
        } else {
          const param = {
            method: 'POST',
            body: JSON.stringify({
              channel: timesChannelID,
              text: `${request.title}\n${request.text}`
            }),
            headers: {
              'Content-type': 'application/json; charset=UTF-8',
              Authorization: token
            }
          }
          fetch(POST_MESSAGE_API_URL, param)
            .then((res) => res.json())
            .then((json) => {
              console.log('post', json)
              sendResponse({
                status: true,
                message: '送信しました'
              })
            })
            .catch((e) => console.error(e.message))
        }
      }
    )

    return true
  }

  if (request.type === 'toggl') {
    chrome.storage.sync.get(['toggl'], (result) => {
      const toggl = removeDabbleQuote(result.toggl)
      if (!toggl) {
        sendResponse({
          status: false,
          message: 'togglのトークンを登録してください。'
        })
        return
      }

      const password = 'api_token'
      const username = toggl
      const encoded = btoa(`${username}:${password}`)
      const auth = 'Basic ' + encoded
      const headers = new Headers()

      const start = request.start
      const end = request.end

      headers.append('Accept', 'application/json')
      headers.append('Authorization', auth)

      fetch(
        `${TOGGL_API_URL}time_entries?start_date=${start}&end_date=${end}`,
        {
          headers: headers,
          credentials: 'include'
        }
      )
        .then((response) => {
          return response.json()
        })
        .then((data) => {
          if (data.length === 0) {
            sendResponse({
              status: false,
              message: 'データが存在しませんでした。'
            })
            return
          }
          sendResponse({
            status: true,
            message: 'ok',
            data
          })
        })
        .catch((e) => {
          console.log(e)
          sendResponse({
            status: false,
            message: `データが取得できませんでした。\n${e}`
          })
        })
    })

    return true
  }
})
