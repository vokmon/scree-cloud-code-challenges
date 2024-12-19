export function getRandomNumbers(x: number, totalCount: number): number[] {
  if (x <= 0 || totalCount <= 0 || x > totalCount) {
    throw new Error(
      'Invalid input values. Ensure x <= totalCount and both are positive integers.',
    );
  }

  const uniqueNumbers = new Set<number>();

  while (uniqueNumbers.size < x) {
    const randomNumber = Math.floor(Math.random() * totalCount) + 1;
    uniqueNumbers.add(randomNumber);
  }

  return Array.from(uniqueNumbers);
}
