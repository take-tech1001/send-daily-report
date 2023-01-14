import '@/style.css'

import { Tabs } from '@components/Tabs'
import { ThemeChange } from '@components/ThemeChange'
import { Theme } from 'react-daisyui'

import { useStorage } from '@plasmohq/storage/hook'

import { DailyReport } from './daily-report'
import { Times } from './times'

function Popup() {
  const [reportType] = useStorage<'日報' | 'times'>('reportType', '日報')

  return (
    <Theme>
      <div className="border border-gray-800">
        <div className="relative bg-gray-800">
          <h1 className="py-2 text-white text-center font-bold">
            Daily report
          </h1>
          <ThemeChange className="absolute top-1/2 right-[20px] transform -translate-y-1/2 min-h-[25px] h-[25px]" />
        </div>

        <Tabs />

        <form className="overflow-y-scroll px-4 pb-4">
          {reportType === '日報' ? <DailyReport /> : <Times />}
        </form>
      </div>
    </Theme>
  )
}

export default Popup
