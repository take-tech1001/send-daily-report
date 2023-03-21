import { Loading } from '@components/Loading'
import { DIRECTOR_REPORT_NAMES } from '@consts'
import { useToast } from '@hooks/useToast'
import type { DirectorReportNames } from '@types'
import { range } from '@utils'
import clsx from 'clsx'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Checkbox, Input, InputGroup } from 'react-daisyui'
import TextareaAutosize from 'react-textarea-autosize'

import { useStorage } from '@plasmohq/storage/hook'

type DirectorReportList = Record<DirectorReportNames, { [key: number]: string }>

const INITIAL_DIRECTOR_REPORT_LIST: DirectorReportList = {
  todayTasks: {
    0: ''
  },
  issuesFound: {
    0: ''
  },
  tomorrowPlan: {
    0: ''
  },
  otherThoughts: {
    0: ''
  }
}

export const DailyReportDirector = () => {
  const [directorList, setDirectorList] = useStorage<DirectorReportList>(
    'directorReportList',
    INITIAL_DIRECTOR_REPORT_LIST
  )
  const [isGetSchedule, setIsGetSchedule] = useStorage('isGetSchedule', false)

  const [loading, setLoading] = useState(false)
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))

  const { Toast, handleToast } = useToast()

  const isEdit = useMemo(() => {
    return Object.values(directorList).some((list) => {
      return Object.values(list).some((item) => item === '')
    })
  }, [directorList])

  const handleIncrement = (type: DirectorReportNames) => {
    const handleUpdate = (type: DirectorReportNames) => {
      setDirectorList({
        ...directorList,
        [type]: {
          ...directorList[type],
          [Object.keys(directorList[type]).length]: ''
        }
      })
    }

    handleUpdate(type)
  }

  const handleDecrement = (type: DirectorReportNames) => {
    const num = Object.keys(directorList[type]).length
    if (num === 1) return

    const handleUpdate = (type: DirectorReportNames) => {
      setDirectorList({
        ...directorList,
        [type]: {
          ...Object.fromEntries(
            Object.entries(directorList[type]).slice(0, num - 1)
          )
        }
      })
    }

    handleUpdate(type)
  }

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setLoading(true)

    if (isEdit) {
      const isConfirm = confirm(
        '保存されていない項目があります。\n送信しますか？'
      )

      if (!isConfirm) {
        setLoading(false)
        return
      }
    }

    let todayTasksText = ''
    let issuesFoundText = ''
    let tomorrowPlanText = ''
    let otherThoughtsText = ''

    DIRECTOR_REPORT_NAMES.map((name) => {
      const keys = Object.keys(directorList[name])
      keys?.forEach((key) => {
        switch (name) {
          case 'todayTasks':
            todayTasksText += `・${directorList[name][key]}\n`
            break
          case 'issuesFound':
            issuesFoundText += `・${directorList[name][key]}\n`
            break
          case 'tomorrowPlan':
            tomorrowPlanText += `・${directorList[name][key]}\n`
            break
          case 'otherThoughts':
            otherThoughtsText += `・${directorList[name][key]}\n`
            break
        }
      })
    })

    let postContent = `【今日の対応内容】\n${todayTasksText} \n【見つかった課題（良い悪い困ったこと等振り返り）】\n${issuesFoundText} \n【明日何する？】\n${tomorrowPlanText} \n【他思ったこと】\n${otherThoughtsText}`

    const handleMessage = async (postContent: string) => {
      chrome.runtime.sendMessage(
        {
          type: 'daily-report',
          date: date,
          text: postContent
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

    if (isGetSchedule) {
      chrome.runtime.sendMessage(
        {
          type: 'time-designer',
          date: date
        },
        (res) => {
          if (!res.status) {
            alert(res.message)
            setLoading(false)
            return
          }

          postContent += `\n\n${res.data}`
          handleMessage(postContent)
        }
      )
    } else {
      handleMessage(postContent)
    }
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

      {DIRECTOR_REPORT_NAMES.map((name) => {
        return (
          <div key={name}>
            <div className="flex items-center justify-between mt-5">
              <label htmlFor={name} className="block font-bold">
                {name === 'todayTasks'
                  ? '今日の対応内容'
                  : name === 'issuesFound'
                  ? '見つかった課題（良い悪い困ったこと等振り返り）'
                  : name === 'tomorrowPlan'
                  ? '明日何する？'
                  : name === 'otherThoughts'
                  ? '他思ったこと'
                  : ''}
              </label>

              <div className="flex">
                <button
                  className="hover:opacity-80"
                  type="button"
                  onClick={() => handleIncrement(name)}>
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
                  type="button"
                  onClick={() => handleDecrement(name)}>
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

            <div className="flex flex-col mt-3 gap-y-3" id={name}>
              {[...range(0, Object.keys(directorList[name]).length)].map(
                (i) => (
                  <TextAreaWithButton type={name} id={i} key={i} />
                )
              )}
            </div>
          </div>
        )
      })}

      <div className="mt-4 mx-16">
        <label className="flex items-center">
          <Checkbox
            size="xs"
            name="timeDesigner"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setIsGetSchedule(e.target.checked)
            }
            checked={isGetSchedule}
            color="primary"
          />

          <p className="select-none ml-[5px] text-[14px]">
            1日のスケジュールを追加する
          </p>
        </label>
      </div>

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

const TextAreaWithButton = ({
  type,
  id,
  className
}: {
  type: DirectorReportNames
  id: number
  className?: string
}) => {
  const [storage, setStorage] = useStorage<DirectorReportList>(
    'directorReportList',
    INITIAL_DIRECTOR_REPORT_LIST
  )
  const [value, setValue] = useState<string>()
  const { Toast, handleToast } = useToast()
  const ref = useRef<HTMLTextAreaElement>(null)

  const handleSave = useCallback(() => {
    setStorage({
      ...storage,
      [type]: {
        ...storage[type],
        [id]: value
      }
    })

    handleToast()
  }, [storage, value])

  const handleClear = useCallback(() => {
    ref.current.value = ''
    setStorage({
      ...storage,
      [type]: { ...storage[type], [id]: '' }
    })
    setValue('')
  }, [storage, value])

  const currentStorage = storage?.[type]?.[id] ?? ''

  useEffect(() => {
    if (currentStorage === undefined) return
    setValue(currentStorage)
  }, [currentStorage])

  return (
    <div className={clsx('flex items-center gap-x-3', className)}>
      <TextareaAutosize
        id={type + id}
        cols={30}
        rows={3}
        className="flex-1 border border-gray-800 px-2 rounded-md row-start-1 row-end-3 text-[14px]"
        minRows={3}
        defaultValue={value}
        onBlur={(e) => {
          if (value === '' && e.target.value === '') return
          setValue(e.target.value)
        }}
        ref={ref}
      />
      <div className="w-[65px] flex flex-col gap-y-[5px]">
        <button
          className={clsx(
            'text-[13px] w-full py-[5px] rounded-md text-white font-bold',
            currentStorage !== undefined && currentStorage !== ''
              ? 'pointer-events-auto bg-red-500 hover:bg-red-400'
              : 'pointer-events-none bg-[#cccccc]'
          )}
          onClick={handleClear}
          type="button">
          クリア
        </button>
        <button
          className="text-[13px] w-full py-[5px] rounded-md bg-blue-500 hover:bg-blue-400 text-white font-bold"
          onClick={handleSave}
          type="button">
          保存する
        </button>
      </div>

      <Toast message="保村しました" />
    </div>
  )
}
