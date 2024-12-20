/**
 * Get order by statement
 * @param criteria
 * @param fieldMapping
 * @returns order statement
 */
export function getOrderBy<TCriteria, TOrderBy>(
  criteria: TCriteria,
  fieldMapping: Record<string, (orderDirection: string) => any>,
): TOrderBy[] {
  const { orderBy, orderDirection } = criteria as any; // Assume these fields exist in TCriteria

  const orderByCriteria = orderBy
    ? orderBy.map((field: string) => {
        const mapping = fieldMapping[field];
        if (mapping) {
          return mapping(orderDirection);
        }
      })
    : [];
  return orderByCriteria.filter(Boolean); // Remove undefined entries
}
