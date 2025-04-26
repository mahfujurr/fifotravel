/**
 * Calculates the number of days between two dates.
 * @param {string} checkInDate - The check-in date.
 * @param {string} checkOutDate - The check-out date.
 * @returns {number} - The total number of days between the two dates.
 */
export const calculateTotalDays = (checkInDate, checkOutDate) => {
  const checkIn = new Date(checkInDate)
  const checkOut = new Date(checkOutDate)
  if (isNaN(checkIn.getTime()) || isNaN(checkOut.getTime())) {
    return 0
  }
  const differenceInTime = checkOut.getTime() - checkIn.getTime()
  const differenceInDays = differenceInTime / (1000 * 3600 * 24)
  return Math.max(differenceInDays, 0)
}

export const formatDateToDMY = (date) => {
  const obj = new Date(date)

  if (isNaN(obj)) {
    return ""
  }
  const day = obj.getDate().toString().padStart(2, "0")
  const month = (obj.getMonth() + 1).toString().padStart(2, "0")
  const year = obj.getFullYear()

  return `${day}/${month}/${year}`
}

export const ToAMPM = (time) => {
  if (!time) return ""

  const [hours, minutes] = time.split(":").map(Number)

  if (isNaN(hours) || isNaN(minutes)) return ""

  const period = hours >= 12 ? "PM" : "AM"
  const adjustedHours = hours % 12 || 12

  return `${adjustedHours}:${minutes.toString().padStart(2, "0")} ${period}`
}
