import {
  getPaginationObject,
  getPaginationQueryObject,
  getRecordIndex,
} from '@src/utils/pagination-utils';
import { describe, it, expect } from 'vitest';

describe('getPaginationQueryObject', () => {
  it('should return correct skip and take values', () => {
    const result = getPaginationQueryObject({ page: 2, limit: 10 });
    expect(result).toEqual({ skip: 10, take: 10 });

    const result2 = getPaginationQueryObject({ page: 1, limit: 5 });
    expect(result2).toEqual({ skip: 0, take: 5 });
  });

  it('should handle edge cases like page 1 and limit 0', () => {
    const result = getPaginationQueryObject({ page: 1, limit: 0 });
    expect(result).toEqual({ skip: 0, take: 0 });
  });
});

describe('getRecordIndex', () => {
  it('should return the correct index for records', () => {
    const result = getRecordIndex({ index: 0, skip: 10 });
    expect(result).toBe(11);

    const result2 = getRecordIndex({ index: 5, skip: 20 });
    expect(result2).toBe(26);
  });

  it('should handle edge cases with zero index and skip', () => {
    const result = getRecordIndex({ index: 0, skip: 0 });
    expect(result).toBe(1);
  });
});

describe('getPaginationObject', () => {
  it('should return a valid pagination object when data is not empty', () => {
    const result = getPaginationObject({
      data: [1, 2, 3],
      total: 10,
      page: 2,
      limit: 5,
    });
    expect(result).toEqual({
      total: 10,
      page: 2,
      limit: 5,
      totalPages: 2,
    });
  });

  it('should return undefined when data is empty', () => {
    const result = getPaginationObject({
      data: [],
      total: 10,
      page: 1,
      limit: 5,
    });
    expect(result).toBeUndefined();
  });

  it('should calculate totalPages correctly', () => {
    const result = getPaginationObject({
      data: [1, 2],
      total: 6,
      page: 2,
      limit: 2,
    });
    expect(result).toEqual({
      total: 6,
      page: 2,
      limit: 2,
      totalPages: 3,
    });
  });
});
