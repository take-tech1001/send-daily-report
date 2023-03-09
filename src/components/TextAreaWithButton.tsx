import { useToast } from '@hooks/useToast'
import type { ReportNames } from '@types'
import clsx from 'clsx'
import { useCallback, useEffect, useRef, useState } from 'react'
import TextareaAutosize from 'react-textarea-autosize'

import { useStorage } from '@plasmohq/storage/hook'

type Props = {
  type: ReportNames
  id: number
  className?: string
  onSetEdit: (id: number, isEdit: boolean) => void
}

export const TextAreaWithButton = ({
  type,
  id,
  onSetEdit,
  className
}: Props) => {
  const [storage, setStorage] = useStorage<{
    [key: number]: string
  }>(`${type}List`, {})
  const [value, setValue] = useState<string>()
  const { Toast, handleToast } = useToast()
  const ref = useRef<HTMLTextAreaElement>(null)

  const handleSave = useCallback(() => {
    setStorage({ ...storage, [id]: value })
    onSetEdit(id, false)
    handleToast()
  }, [storage, value])

  const handleClear = useCallback(() => {
    ref.current.value = ''
    setStorage({ ...storage, [id]: '' })
    setValue('')
  }, [storage, value])

  useEffect(() => {
    if (storage[id] === undefined) return
    setValue(storage[id])
  }, [storage[id]])

  return (
    <div className={clsx('flex items-center gap-x-3', className)}>
      <TextareaAutosize
        minRows={3}
        id={type + id}
        cols={30}
        rows={3}
        className="flex-1 border border-gray-800 px-2 rounded-md row-start-1 row-end-3 text-[14px]"
        defaultValue={value}
        onBlur={(e) => {
          if (value === '' && e.target.value === '') return
          setValue(e.target.value)
          onSetEdit(id, true)
        }}
        ref={ref}
      />

      <div className="w-[65px] flex flex-col gap-y-[5px]">
        <button
          className={clsx(
            'text-[13px] w-full py-[5px] rounded-md text-white font-bold',
            storage[id] !== undefined && storage[id] !== ''
              ? 'pointer-events-auto bg-red-500 hover:bg-red-400'
              : 'pointer-events-none bg-[#cccccc]'
          )}
          type="button"
          onClick={handleClear}>
          クリア
        </button>
        <button
          className="text-[13px] w-full py-[5px] rounded-md bg-blue-500 hover:bg-blue-400 text-white font-bold"
          type="button"
          onClick={handleSave}>
          保存する
        </button>
      </div>

      <Toast message="保村しました" />
    </div>
  )
}
