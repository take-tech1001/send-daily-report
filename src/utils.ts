export function* range(start, end) {
  for (let i = start; i < end; i++) {
    yield i
  }
}

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

export const toBoolean = (value: string) => {
  return value === 'true'
}

export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms))

export const removeDabbleQuote = (str: string) => {
  if (str[0] !== '"' && str[str.length - 1] !== '"') {
    return str
  }

  return str.slice(1, -1)
}
