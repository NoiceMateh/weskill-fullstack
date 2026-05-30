import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { badRequest, unauthorized } from "../utils/httpError.js";
import { createUser, findUserWithPasswordByEmail, findUserById, setRefreshToken, verifyRefreshToken } from "./userService.js";

function signAccessToken(user) {
  return jwt.sign({ sub: user.id || user._id, role: user.role }, env.jwtAccessSecret, { expiresIn: env.accessTokenTtl });
}

function signRefreshToken(user) {
  return jwt.sign({ sub: user.id || user._id }, env.jwtRefreshSecret, { expiresIn: env.refreshTokenTtl });
}

export async function registerUser(payload) {
  return createUser(payload);
}

export async function loginUser({ email, password }) {
  if (!email || !password) throw badRequest("Vui lòng nhập email và mật khẩu.");

  const userDoc = await findUserWithPasswordByEmail(email);
  const rawUser = userDoc?.toJSON ? userDoc.toJSON() : userDoc;
  if (!userDoc || rawUser.isActive === false) throw unauthorized("Email hoặc mật khẩu không đúng.");

  const passwordMatches = await bcrypt.compare(password, userDoc.passwordHash);
  if (!passwordMatches) throw unauthorized("Email hoặc mật khẩu không đúng.");

  const user = await findUserById(rawUser.id || rawUser._id);
  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user);
  await setRefreshToken(user.id || user._id, refreshToken);

  return { user, accessToken, refreshToken };
}

export async function refreshSession(refreshToken) {
  if (!refreshToken) throw unauthorized("Thiếu refresh token.");

  let payload;
  try {
    payload = jwt.verify(refreshToken, env.jwtRefreshSecret);
  } catch {
    throw unauthorized("Refresh token không hợp lệ.");
  }

  const user = await verifyRefreshToken(payload.sub, refreshToken);
  if (!user) throw unauthorized("Refresh token không hợp lệ.");

  const accessToken = signAccessToken(user);
  const nextRefreshToken = signRefreshToken(user);
  await setRefreshToken(user.id || user._id, nextRefreshToken);

  return { user, accessToken, refreshToken: nextRefreshToken };
}

export async function logoutUser(userId) {
  if (userId) await setRefreshToken(userId, null);
}
