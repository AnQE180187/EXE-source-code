import { format, formatDistanceToNow, parseISO } from 'date-fns'
import { vi } from 'date-fns/locale'

export const formatDate = (date: string | Date, formatString: string = 'dd/MM/yyyy') => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return format(dateObj, formatString, { locale: vi })
}

export const formatDateTime = (date: string | Date) => {
  return formatDate(date, 'dd/MM/yyyy HH:mm')
}

export const formatTime = (date: string | Date) => {
  return formatDate(date, 'HH:mm')
}

export const formatRelativeTime = (date: string | Date) => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return formatDistanceToNow(dateObj, { addSuffix: true, locale: vi })
}

export const formatEventDate = (date: string | Date) => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  
  if (format(dateObj, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd')) {
    return 'Hôm nay'
  } else if (format(dateObj, 'yyyy-MM-dd') === format(tomorrow, 'yyyy-MM-dd')) {
    return 'Ngày mai'
  } else {
    return formatDate(date, 'EEEE, dd/MM/yyyy')
  }
} 