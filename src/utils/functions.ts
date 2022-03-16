export const dateToISO = (date: Date) => {
  return encodeURIComponent(date.toISOString())
}

export const ISOtoDate = (time: string) => {
  const date = Date.parse(time)
  const dateObj = new Date(date)
  const hours = dateObj.getHours().toString().padStart(2, '0')
  const minutes = dateObj.getMinutes().toString().padStart(2, '0')
  return `${hours}:${minutes}`
}
