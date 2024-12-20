/**
 * Function to get the current month in YYYY-MM format
 * @returns current month and year in YYYY-MM format
 */
export const getCurrentMonth = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
};
