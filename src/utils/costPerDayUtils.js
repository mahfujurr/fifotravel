export const formatToTwoDecimals = (cost, days) => {
  const totalCost = Number.parseFloat(cost) || 0
  const number = totalCost
  return number.toFixed(2)
}

export const TwoDecimals = (number) => {
  if (isNaN(number)) {
    return "0.00"
  }
  return Number(number).toFixed(2)
}
