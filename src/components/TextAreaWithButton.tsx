import { useToast } from '@hooks/useToast'
import type { ReportType } from '@types'
import clsx from 'clsx'
import { useCallback, useEffect, useState } from 'react'

import { useStorage } from '@plasmohq/storage/hook'

type Props = {
  type: ReportType
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

  const handleSave = useCallback(
    (e) => {
      e.preventDefault()
      setStorage({ ...storage, [id]: value })
      onSetEdit(id, false)
      handleToast()
    },
    [storage, value]
  )

  const handleClear = useCallback(
    (e) => {
      e.preventDefault()
      e.target.previousSibling.value = ''
      setStorage({ ...storage, [id]: '' })
      setValue('')
    },
    [storage, value]
  )

  useEffect(() => {
    if (storage[id] === undefined) return
    setValue(storage[id])
  }, [storage[id]])

  return (
    <div className={clsx('grid grid-cols-[1fr,80px] items-center', className)}>
      <textarea
        id={type + id}
        cols={30}
        rows={3}
        className="border border-gray-800 px-2 rounded-md row-start-1 row-end-3 text-[14px]"
        defaultValue={value}
        onBlur={(e) => {
          if (value === '' && e.target.value === '') return
          setValue(e.target.value)
          onSetEdit(id, true)
        }}
      />
      <button
        className={clsx(
          'text-[13px] ml-3 mb-[5px] py-[5px] rounded-md text-white font-bold',
          storage[id] !== undefined && storage[id] !== ''
            ? 'pointer-events-auto bg-red-500 hover:bg-red-400'
            : 'pointer-events-none bg-[#cccccc]'
        )}
        onClick={(e) => handleClear(e)}>
        クリア
      </button>
      <button
        className="text-[13px] ml-3 py-[5px] rounded-md bg-blue-500 hover:bg-blue-400 text-white font-bold"
        onClick={(e) => handleSave(e)}>
        保存する
      </button>

      <Toast message="保村しました" />
    </div>
  )
}
