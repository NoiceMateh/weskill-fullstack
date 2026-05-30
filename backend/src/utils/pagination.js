export function getPagination(query) {
  const page = Math.max(Number(query.page || 1), 1);
  const limit = Math.min(Math.max(Number(query.limit || 20), 1), 100);
  const skip = (page - 1) * limit;
  return { page, limit, skip };
}

export function paginateArray(items, query) {
  const { page, limit, skip } = getPagination(query);
  const results = items.slice(skip, skip + limit);
  return {
    results,
    page,
    limit,
    totalResults: items.length,
    totalPages: Math.ceil(items.length / limit) || 1,
  };
}
