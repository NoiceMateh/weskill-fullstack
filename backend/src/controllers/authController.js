import { env } from "../config/env.js";
import { created, ok } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { loginUser, logoutUser, refreshSession, registerUser } from "../services/authService.js";

const refreshCookieOptions = {
  httpOnly: true,
  sameSite: "lax",
  secure: env.nodeEnv === "production",
  path: "/v1/auth",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

function setRefreshCookie(res, refreshToken) {
  res.cookie("refreshToken", refreshToken, refreshCookieOptions);
}

export const register = asyncHandler(async (req, res) => {
  const user = await registerUser(req.body);
  return created(res, { user });
});

export const login = asyncHandler(async (req, res) => {
  const session = await loginUser(req.body);
  setRefreshCookie(res, session.refreshToken);
  return ok(res, { user: session.user, accessToken: session.accessToken });
});

export const refresh = asyncHandler(async (req, res) => {
  const session = await refreshSession(req.cookies.refreshToken);
  setRefreshCookie(res, session.refreshToken);
  return ok(res, { user: session.user, accessToken: session.accessToken });
});

export const me = asyncHandler(async (req, res) => ok(res, { user: req.user }));

export const logout = asyncHandler(async (req, res) => {
  await logoutUser(req.user?.id || req.user?._id);
  res.clearCookie("refreshToken", refreshCookieOptions);
  return ok(res, { success: true });
});
