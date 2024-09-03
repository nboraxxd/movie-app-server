export function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * Tính số giây phải chờ giữa thời điểm hiện tại và thời điểm nào đó trong tương lai.
 * @param futureTime Thời điểm trong tương lai cần so sánh với thời điểm hiện tại.
 * @returns Số giây phải chờ giữa thời điểm hiện tại và thời điểm futureTime.
 * Nếu futureTime đã qua thì kết quả sẽ là số âm.
 */
export function calculateRemainingTimeInSeconds(futureTime: Date) {
  const now = new Date()
  const remainingTimeInMs = futureTime.getTime() - now.getTime()
  return Math.ceil(remainingTimeInMs / 1000)
}
