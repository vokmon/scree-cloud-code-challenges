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

export function getRecordIndex({
  index,
  skip,
}: {
  index: number;
  skip: number;
}) {
  return 1 + index + skip;
}

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
