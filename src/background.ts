import {
  CHANGE_STATUS_API_URL,
  FILES_UPLOAD_API_URL,
  POST_MESSAGE_API_URL,
  TIME_DESIGNER_API_URL
} from '@consts'
import { formatTime, removeDabbleQuote } from '@utils'
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

  if (
    request.type === 'daily-report' ||
    request.type === 'daily-report-director'
  ) {
    chrome.storage.sync.get(
      ['token', 'channelID', 'myName', 'fileType'],
      (result) => {
        const token = removeDabbleQuote(result.token ?? '')
        const channelID = removeDabbleQuote(result.channelID ?? '')
        const myName = removeDabbleQuote(result.myName ?? '')
        const fileType =
          request.type === 'daily-report-director'
            ? 'markdown'
            : removeDabbleQuote(result.fileType ?? 'markdown')

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

        form.append('filetype', fileType)

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
        const token = removeDabbleQuote(result.token ?? '')
        const timesChannelID = removeDabbleQuote(result.timesChannelID ?? '')
        const fileType = request.fileType ?? 'markdown'

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

        if (fileType === 'markdown') {
          const form = new FormData()
          form.append('channels', timesChannelID)
          form.append('content', request.text)
          form.append('filetype', fileType)
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

  if (request.type === 'time-designer') {
    chrome.storage.sync.get(['timeDesignerToken'], (result) => {
      const token = removeDabbleQuote(result.timeDesignerToken ?? '')
      if (!token) {
        sendResponse({
          status: false,
          message: 'time designerのトークンを登録してください。'
        })
        return
      }

      const username = 'api_token'
      const password = token
      const encoded = btoa(`${username}:${password}`)
      const auth = 'Basic ' + encoded
      const headers = new Headers()

      headers.append('Accept', 'application/json')
      headers.append('Authorization', auth)

      const timeEntriesUrl = new URL(`time-entries`, TIME_DESIGNER_API_URL)
      const params = new URLSearchParams({
        since: new Date(`${request.date} 00:00:00`).toISOString(),
        until: new Date(`${request.date} 23:59:59`).toISOString()
        // since: new Date(`2023-03-17 00:00:00`).toISOString(),
        // until: new Date(`2023-03-17 23:59:59`).toISOString()
      })

      timeEntriesUrl.search = params.toString()

      fetch(timeEntriesUrl, {
        method: 'GET',
        headers: headers
      })
        .then((response) => {
          return response.json()
        })
        .then((data) => {
          if (data.items == null || data.total_count === 0) {
            sendResponse({
              status: false,
              message: 'データが存在しませんでした。'
            })
            return
          }

          const taskList = data.items
            .sort((a, b) => {
              if (new Date(a.start_date_time) < new Date(b.end_date_time)) {
                return -1
              } else {
                return 1
              }
            })
            .map(async (item) => {
              const taskId = item.task.id
              const tasksUrl = new URL(`tasks/${taskId}`, TIME_DESIGNER_API_URL)
              const response = await fetch(tasksUrl, {
                method: 'GET',
                headers: headers
              })
              const task = await response.json()

              return {
                project: task.project.name,
                title: task.title,
                workTimeSec: item.working_time_sec,
                startDateTime: item.start_date_time,
                endDateTime: item.end_date_time
              }
            })

          Promise.all(taskList).then((list) => {
            let timeline = '### Activity Timeline\n'
            let totalWorkTime = '### Total\n'

            const workTimes = {}
            for (const item of list) {
              const {
                project,
                title,
                workTimeSec,
                startDateTime,
                endDateTime
              } = item

              timeline += `${formatTime(
                startDateTime,
                endDateTime
              )} ${project} / ${title}\n`

              if (workTimes[project]) {
                workTimes[project] += workTimeSec
              } else {
                workTimes[project] = workTimeSec
              }
            }

            Object.keys(workTimes).forEach((project, i) => {
              const lastIndex = Object.keys(workTimes).length - 1
              const hours = Math.floor(workTimes[project] / 3600)
              const minutes = Math.floor((workTimes[project] % 3600) / 60)
              const time = `${hours.toString().padStart(2, '0')}:${minutes
                .toString()
                .padStart(2, '0')}`

              totalWorkTime +=
                i === lastIndex
                  ? `${project}（${time}）`
                  : `${project}（${time}）\n`
            })

            sendResponse({
              status: true,
              message: 'ok',
              data: `${timeline}\n${totalWorkTime}`
            })
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
