import { describe, it, expect } from 'vitest';
import { getRandomNumbers } from '@src/utils/number-utils';

describe('getRandomNumbers', () => {
  it('should return an array of correct length', () => {
    const result = getRandomNumbers(5, 10);
    expect(result.length).toBe(5);
  });

  it('should return unique numbers', () => {
    const result = getRandomNumbers(10, 100);
    const uniqueResult = [...new Set(result)];
    expect(uniqueResult.length).toBe(result.length); // Ensures no duplicates
  });

  it('should return numbers within the specified range', () => {
    const result = getRandomNumbers(10, 100);
    result.forEach((num) => {
      expect(num).toBeGreaterThanOrEqual(1);
      expect(num).toBeLessThanOrEqual(100);
    });
  });

  it('should throw an error if x is greater than totalCount', () => {
    expect(() => getRandomNumbers(10, 5)).toThrowError(
      'Invalid input values. Ensure x <= totalCount and both are positive integers.',
    );
  });

  it('should throw an error if x or totalCount is less than or equal to 0', () => {
    expect(() => getRandomNumbers(0, 10)).toThrowError(
      'Invalid input values. Ensure x <= totalCount and both are positive integers.',
    );
    expect(() => getRandomNumbers(10, 0)).toThrowError(
      'Invalid input values. Ensure x <= totalCount and both are positive integers.',
    );
    expect(() => getRandomNumbers(-1, 10)).toThrowError(
      'Invalid input values. Ensure x <= totalCount and both are positive integers.',
    );
    expect(() => getRandomNumbers(10, -1)).toThrowError(
      'Invalid input values. Ensure x <= totalCount and both are positive integers.',
    );
  });
});
