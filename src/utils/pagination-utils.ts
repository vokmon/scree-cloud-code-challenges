/**
 * Generate pagination related query statement
 * @param {page: number, limit: number}
 * @returns related query statement for pagination query satement
 */
export function getPaginationQueryObject({
  page,
  limit,
}: {
  page: number;
  limit: number;
}) {
  const skip = (page - 1) * limit;
  return {
    skip,
    take: limit,
  };
}

/**
 * Get record index
 * @param {index: number, skip: number}
 * @returns index
 */
export function getRecordIndex({
  index,
  skip,
}: {
  index: number;
  skip: number;
}) {
  return 1 + index + skip;
}

/**
 * Generate pagination object to return in the response
 *
 * @param {data: [], total: number, page: number, limit: number}
 * @returns pagination object to return in the response
 */
export function getPaginationObject({
  data,
  total,
  page,
  limit,
}: {
  data: unknown[];
  total: number;
  page: number;
  limit: number;
}) {
  return data.length > 0
    ? {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      }
    : undefined;
}
