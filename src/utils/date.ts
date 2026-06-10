const TZ_ARG = 'America/Argentina/Buenos_Aires'

export function parseApiDate(dateStr: string): Date {
  const [datePart, timePart = '00:00'] = dateStr.split(' ')
  const [month, day, year] = datePart.split('/')
  const [hour, minute] = timePart.split(':')
  return new Date(Date.UTC(+year, +month - 1, +day, +hour, +minute))
}

export function formatInArgentina(
  dateStr: string,
  options?: Intl.DateTimeFormatOptions,
): string {
  const d = parseApiDate(dateStr)
  return d.toLocaleDateString('es-AR', { timeZone: TZ_ARG, ...options })
}

export function isTodayInArgentina(dateStr: string): boolean {
  const d = parseApiDate(dateStr)
  const fmt = new Intl.DateTimeFormat('en-CA', {
    timeZone: TZ_ARG,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
  return fmt.format(d) === fmt.format(new Date())
}
