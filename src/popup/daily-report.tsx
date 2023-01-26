import { Loading } from '@components/Loading'
import { TextAreaWithButton } from '@components/TextAreaWithButton'
import { useToast } from '@hooks/useToast'
import type { ReportType } from '@types'
import { range, toBoolean } from '@utils'
import { useState } from 'react'
import { Input, InputGroup } from 'react-daisyui'

import { useStorage } from '@plasmohq/storage/hook'

export const DailyReport = () => {
  const [thinkingNum, setThinkingNum] = useStorage('thinkingNum', 1)
  const [doNextNum, setDoNextNum] = useStorage('doNextNum', 1)
  const [thinkingList, setThinkingList] = useStorage<{
    [key: number]: string
  }>(`thinkingList`)
  const [doNextList, setDoNextList] = useStorage<{
    [key: number]: string
  }>(`doNextList`)
  const [fileType, setFileType] = useStorage('fileType', 'false')
  const [loading, setLoading] = useState(false)
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))

  const { Toast, handleToast } = useToast()

  const handleIncrement = (
    e: React.MouseEvent<HTMLButtonElement>,
    type: Omit<ReportType, 'times'>
  ) => {
    e.preventDefault()

    switch (type) {
      case 'thinking':
        console.log(thinkingList)
        setThinkingNum(thinkingNum + 1)
        break

      case 'doNext':
        setDoNextNum(doNextNum + 1)
        break

      default:
        break
    }
  }

  const handleDecrement = (
    e: React.MouseEvent<HTMLButtonElement>,
    type: Omit<ReportType, 'times'>
  ) => {
    e.preventDefault()

    switch (type) {
      case 'thinking':
        if (thinkingNum === 1) return
        setThinkingNum(thinkingNum - 1)

        if (Object.keys(thinkingList).length >= thinkingNum) {
          const thinkingLast = Object.keys(thinkingList).pop()
          delete thinkingList[thinkingLast]
          setThinkingList(thinkingList)
        }
        break

      case 'doNext':
        if (doNextNum === 1) return
        setDoNextNum(doNextNum - 1)

        if (Object.keys(doNextList).length >= doNextNum) {
          const doNextLast = Object.keys(doNextList).pop()
          delete doNextList[doNextLast]
          setDoNextList(doNextList)
        }
        break

      default:
        break
    }
  }

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setLoading(true)
    console.log(thinkingList, doNextList)

    let thinkingText = ''
    let doNextText = ''

    if (thinkingList != null) {
      const thinkingKeys = Object.keys(thinkingList)
      thinkingKeys?.forEach((key) => {
        thinkingText += `・${thinkingList[key]}\n`
      })
    }

    if (doNextList != null) {
      const doNextKeys = Object.keys(doNextList)
      doNextKeys?.forEach((key) => {
        doNextText += `・${doNextList[key]}\n`
      })
    }

    const postContent = `【思ったこと】\n${thinkingText} \n【次やること】\n${doNextText}`

    chrome.runtime.sendMessage(
      {
        type: 'daily-report',
        date: date,
        text: postContent,
        fileType: fileType ?? 'false'
      },
      (res) => {
        if (!res.status) {
          alert(res.message)
          setLoading(false)
          return
        }

        console.log(res)
        setLoading(false)
        handleToast()
      }
    )
  }

  return (
    <div id="daily-report">
      <div className="mr-[20px] mt-[20px]">
        <InputGroup size="sm">
          <span>日付</span>
          <Input
            type="date"
            defaultValue={date}
            size="sm"
            onBlur={(e) => setDate(e.target.value)}
            name="date"
            bordered
            className="w-[125px]"
          />
        </InputGroup>
      </div>

      <div className="flex items-center justify-between mt-5">
        <label htmlFor="thinking" className="block font-bold">
          思ったこと
        </label>
        <div className="flex">
          <button
            className="hover:opacity-80"
            onClick={(e) => handleIncrement(e, 'thinking')}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-[30px] h-[30px] text-[#6a7280]">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          <button
            className="hover:opacity-80 ml-[4px]"
            onClick={(e) => handleDecrement(e, 'thinking')}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-[30px] h-[30px] text-[#6a7280]"
              viewBox="0 0 20 20"
              fill="currentColor">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
      <div className="thinkings flex flex-col mt-3 gap-y-3" id="thinkings">
        {[...range(0, thinkingNum)].map((i) => (
          <TextAreaWithButton type="thinking" id={i} key={i} />
        ))}
      </div>

      <div className="mt-8 flex items-center justify-between">
        <label htmlFor="doNext" className="block font-bold">
          次やること
        </label>
        <div>
          <button
            className="hover:opacity-80"
            onClick={(e) => handleIncrement(e, 'doNext')}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-[30px] h-[30px] text-[#6a7280]">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          <button
            className="hover:opacity-80"
            onClick={(e) => handleDecrement(e, 'doNext')}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-[30px] h-[30px] text-[#6a7280]"
              viewBox="0 0 20 20"
              fill="currentColor">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
      <div className="doNexts flex flex-col mt-3 gap-y-3" id="doNexts">
        {[...range(0, doNextNum)].map((i) => (
          <TextAreaWithButton type="doNext" id={i} key={i} />
        ))}
      </div>

      <label className="flex items-center justify-center mt-4">
        <input
          type="checkbox"
          name=""
          checked={toBoolean(fileType)}
          onChange={() =>
            setFileType((prev) => (prev === 'true' ? 'false' : 'true'))
          }
        />
        <p className="select-none ml-[5px] text-[14px]">
          マークダウンファイルで投稿する
        </p>
      </label>

      <div className="w-full mt-12 mb-4 flex justify-center">
        <button
          className="relative min-w-[300px] py-3 bg-blue-500 hover:bg-blue-400 text-white font-semibold rounded-3xl flex items-center justify-center gap-x-2"
          onClick={handleSubmit}>
          {loading && <Loading className="absolute top-[17px] left-[95px]" />}
          <span>送信する</span>
        </button>
      </div>

      <Toast message="送信しました" />
    </div>
  )
}
