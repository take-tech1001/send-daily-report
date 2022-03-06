import type { reportNames } from './types'

export const dailyReportElement = (name: reportNames, value: string) => {
  return `<div class="${name}-content grid grid-cols-[1fr,80px] items-center mt-3">
    <textarea
      id="${name}"
      cols="30"
      rows="3"
      class="border border-gray-800 px-2 rounded-md row-start-1 row-end-3 text-[14px]"
    >${value}</textarea>
    <button
      class="${name}-clear-button text-[13px] ml-3 mb-[5px] py-[5px] rounded-md bg-[#cccccc] hover:bg-red-400 text-white font-bold pointer-events-none"
    >
      クリア
    </button>
    <button
      class="${name}-save-button text-[13px] ml-3 py-[5px] rounded-md bg-blue-500 hover:bg-blue-400 text-white font-bold"
    >
      保存する
    </button>
  </div>`
}
