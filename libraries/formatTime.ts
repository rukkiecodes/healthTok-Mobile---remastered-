import { formatDistanceToNow, format } from 'date-fns'

export const formatMessageTime = (createdAt: { seconds: number }) => {
  const now = new Date()
  const createdDate = new Date(createdAt.seconds * 1000)

  // Calculate the difference in time
  const timeDifference = now.getTime() - createdDate.getTime()

  // If the difference is less than 24 hours, show time like 10:20 PM
  if (timeDifference < 86400000) { // 86400000 ms = 24 hours
    return format(createdDate, 'h:mm a') // Formats to 10:20 PM
  }

  // Otherwise, show the time like '1 day ago'
  return formatDistanceToNow(createdDate) + ' ago'
}