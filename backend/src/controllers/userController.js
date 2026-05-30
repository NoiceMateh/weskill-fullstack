import { ok } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { listUsers, updateUser } from "../services/userService.js";

export const index = asyncHandler(async (req, res) => {
  const data = await listUsers(req.query);
  return ok(res, data);
});

export const update = asyncHandler(async (req, res) => {
  const user = await updateUser(req.params.userId, req.body);
  return ok(res, user);
});
