import { isMongoReady } from "../config/db.js";
import { Category } from "../models/Category.js";
import { memory, clone } from "../data/memoryStore.js";
import { paginateArray, getPagination } from "../utils/pagination.js";

export async function listCategories(query = {}) {
  if (isMongoReady()) {
    const { page, limit, skip } = getPagination(query);
    const [results, totalResults] = await Promise.all([
      Category.find().sort({ name: 1 }).skip(skip).limit(limit),
      Category.countDocuments(),
    ]);
    return { results: results.map((item) => item.toJSON()), page, limit, totalResults, totalPages: Math.ceil(totalResults / limit) || 1 };
  }

  const items = memory.categories.map((item) => clone(item));
  return paginateArray(items, query);
}
