import './style.css'

// import { WebClient } from '@slack/web-api'

const thinking_items =
  document.querySelectorAll<HTMLInputElement>('.thinkings input')
const doNext_items =
  document.querySelectorAll<HTMLInputElement>('.doNext-list input')
const submit = document.getElementById('submit')

const SLACK_API_TOKEN =
  'Bearer xoxp-1263474917939-1248526562183-3109979672757-341be25ca19fbcf185d8aa32f2d4e359'
const SLACK_CHANNEL_ID = 'C0334AKH8SJ'
const URL = 'https://slack.com/api/chat.postMessage'

// const post_title = ''

const handleSubmit = async () => {
  // const client = new WebClient(SLACK_API_TOKEN)
  let thinking_text = ''
  let doNext_text = ''

  thinking_items.forEach((item): void => {
    thinking_text += `・${item.value}\n`
  })

  doNext_items.forEach((item): void => {
    doNext_text += `・${item.value}\n`
  })

  const post_content = `
  【思ったこと】\n ${thinking_text} \n\n 【次やること】\n ${doNext_text}
  `

  const body = {
    text: post_content,
    channel: SLACK_CHANNEL_ID,
    pretty: 1
  }

  await fetch(URL, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { Authorization: SLACK_API_TOKEN }
  })
    .then(() => {
      alert('送信が完了しました。\n追ってご連絡致します。')
    })
    .catch((error) => {
      console.log(error)
    })
}
submit?.addEventListener('click', handleSubmit)
