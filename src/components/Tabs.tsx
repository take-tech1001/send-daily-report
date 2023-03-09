// import { useStorage } from '@hooks/useStorage'

import type { ReportType } from '@types'
import { useEffect, useState } from 'react'
import { Tabs as DaisyTabs } from 'react-daisyui'

import { useStorage } from '@plasmohq/storage/hook'

export const Tabs = () => {
  const [tabValue, setTabValue] = useState('daily-report')
  const [reportValue, setReportType] = useStorage<ReportType>('reportType')
  const { Tab } = DaisyTabs

  const handleChange = (value: ReportType) => {
    setReportType(value)
    setTabValue(value)
  }

  useEffect(() => {
    if (reportValue === undefined) return
    setTabValue(reportValue)
  }, [reportValue])

  return (
    <DaisyTabs
      value={tabValue}
      onChange={handleChange}
      // boxed={true}
      variant="bordered"
      className="grid grid-cols-[1fr,1fr,1fr] mt-4">
      <Tab value="daily-report" className="">
        日報(engineer)
      </Tab>
      <Tab value="daily-report-dir" className="">
        日報(director)
      </Tab>
      <Tab value="times" className="">
        times
      </Tab>
    </DaisyTabs>
  )
}
