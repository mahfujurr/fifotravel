export const formatDateVerbose = (dateInput) => {
  if (!dateInput) return ""

  const date = new Date(dateInput)
  if (isNaN(date.getTime())) return ""

  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }
  return date.toLocaleDateString("en-US", options)
}
