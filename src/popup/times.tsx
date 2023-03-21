import { Loading } from '@components/Loading'
import { TextAreaWithButton } from '@components/TextAreaWithButton'
import { useToast } from '@hooks/useToast'
import { range } from '@utils'
import { useState } from 'react'
import { Input, InputGroup } from 'react-daisyui'

import { useStorage } from '@plasmohq/storage/hook'

export const Times = () => {
  const [timesNum, setTimesNum] = useStorage('timesNum', 1)
  const [timesList, setTimesList] = useStorage<{
    [key: number]: string
  }>(`timesList`)
  const [goingWorkTime, setGoingWorkTime] = useStorage('goingWorkTime', '')
  const [leavingWorkTime, setLeavingWorkTime] = useStorage(
    'leavingWorkTime',
    ''
  )
  const [timesFileType, setTimesFileType] = useStorage('timesFileType', 'text')
  const [loading, setLoading] = useState(false)
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [isEdit, setIsEdit] = useState<{
    [key: number]: boolean
  }>()

  const { Toast, handleToast } = useToast()

  const handleIncrement = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setTimesNum(timesNum + 1)
  }

  const handleDecrement = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    if (timesNum === 1) return
    setTimesNum(timesNum - 1)

    if (timesList != null && Object.keys(timesList).length >= timesNum) {
      const timesLast = Object.keys(timesList).pop()
      delete timesList[timesLast]
      setTimesList(timesList)
    }
  }

  const handleSetEdit = (id: number, isEdit: boolean) => {
    setIsEdit((prev) => {
      if (prev == null) return { [`times${id}`]: isEdit }
      return { ...prev, [`times${id}`]: isEdit }
    })
  }

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setLoading(true)

    if (isEdit != null && Object.values(isEdit).includes(true)) {
      const isConfirm = confirm('編集中の項目があります。送信しますか？')

      if (!isConfirm) {
        setLoading(false)
        return
      }
    }

    let timesText = ''

    if (timesList == null) {
      alert('値を入力し保存してください。')
      setLoading(false)
      return
    }

    Object.keys(timesList).forEach((key) => {
      timesText += `・${timesList[key]}\n`
    })

    const dateObj = new Date(date)
    const month = String(dateObj.getMonth() + 1)
      .toString()
      .padStart(2, '0')
    const dateStr = String(dateObj.getDate().toString().padStart(2, '0'))
    const workTime =
      goingWorkTime !== '' && leavingWorkTime !== ''
        ? `${goingWorkTime} - ${leavingWorkTime}`
        : ''

    const title =
      workTime !== ''
        ? `${month}/${dateStr} ${workTime}`
        : `${month}/${dateStr}`

    chrome.runtime.sendMessage(
      {
        type: 'times',
        text: timesText,
        fileType: timesFileType,
        title
      },
      (res) => {
        console.log(res)

        if (!res.status) {
          alert(res.message)
          setLoading(false)
          return
        }

        setLoading(false)
        handleToast()
      }
    )
  }

  return (
    <div>
      <div className="relative mt-8">
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
        <div className="flex items-center gap-x-3 mt-[10px]">
          <InputGroup size="sm" className="w-auto">
            <span>出勤</span>
            <Input
              type="time"
              value={goingWorkTime}
              size="sm"
              onChange={(e) => setGoingWorkTime(e.target.value)}
              name="going-work"
              bordered
            />
          </InputGroup>
          <span>〜</span>
          <InputGroup size="sm" className="w-auto">
            <span>退勤</span>
            <Input
              type="time"
              value={leavingWorkTime}
              onChange={(e) => setLeavingWorkTime(e.target.value)}
              size="sm"
              name="leaving-work"
              bordered
            />
          </InputGroup>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <label htmlFor="time" className="block font-bold">
          times
        </label>
        <div>
          <button className="hover:opacity-80" onClick={handleIncrement}>
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
          <button className="hover:opacity-80" onClick={handleDecrement}>
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
      <div className="flex flex-col mt-3 gap-y-3" id="times">
        {[...range(0, timesNum)].map((i) => (
          <TextAreaWithButton
            type="times"
            id={i}
            key={i}
            onSetEdit={handleSetEdit}
          />
        ))}
      </div>

      <label className="flex items-center justify-center mt-4">
        <input
          type="checkbox"
          name="timesFileType"
          checked={timesFileType === 'markdown'}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            e.target.checked
              ? setTimesFileType('markdown')
              : setTimesFileType('text')
          }}
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
