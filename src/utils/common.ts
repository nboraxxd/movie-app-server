import envVariables from '@/schemas/env-variables.schema'

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

export const escapeHtml = (text: string) => {
  const map: Record<string, string> = {
    '<': '&lt;',
    '>': '&gt;',
    '&': '&amp;',
    "'": '&#39;',
    '"': '&quot;',
    '/': '&#47;',
  }
  return text.replace(/[<>&'"\\/]/g, (char: string): string => map[char])
}

export function buildTMDBImageUrl({
  imagePath,
  imageType,
}: {
  imagePath: string | null
  imageType: 'backdrop' | 'poster' | 'profile'
}) {
  const baseUrls = {
    backdrop: envVariables.TMDB_IMAGE_W1920_URL,
    poster: envVariables.TMDB_IMAGE_W500_URL,
    profile: envVariables.TMDB_IMAGE_W276_H350_URL,
  }

  const baseUrl = baseUrls[imageType]

  return imagePath ? `${baseUrl}${imagePath}` : null
}
