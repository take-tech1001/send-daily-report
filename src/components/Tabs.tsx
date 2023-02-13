// import { useStorage } from '@hooks/useStorage'
import { useEffect, useState } from 'react'
import { Tabs as DaisyTabs } from 'react-daisyui'

import { useStorage } from '@plasmohq/storage/hook'

export const Tabs = () => {
  const [tabValue, setTabValue] = useState('日報')
  const [reportValue, setReportType] = useStorage<'日報' | 'times'>(
    'reportType'
  )
  const { Tab } = DaisyTabs

  const handleChange = (value: '日報' | 'times') => {
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
      className="w-full mt-4 justify-between">
      <Tab value="日報" className="w-1/2">
        日報
      </Tab>
      <Tab value="times" className="w-1/2">
        times
      </Tab>
    </DaisyTabs>
  )
}
