/**
 * Calculates the total flight cost.
 * @param {string | number}
 * @param {string | number}
 * @returns {number}
 */
export const calculateTotalFlightCost = (cost, returnCost) => {
  const parsedCost = Number.parseFloat(cost, 10) || 0
  const parsedReturnCost = Number.parseFloat(returnCost, 10) || 0
  return parsedCost + parsedReturnCost
}
