import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { findUserById } from "../services/userService.js";
import { unauthorized } from "../utils/httpError.js";

export async function authenticate(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;
    if (!token) throw unauthorized("Vui lòng đăng nhập.");

    const payload = jwt.verify(token, env.jwtAccessSecret);
    const user = await findUserById(payload.sub);
    if (!user || user.isActive === false) throw unauthorized("Tài khoản không hợp lệ.");

    req.user = user;
    next();
  } catch (error) {
    next(unauthorized("Phiên đăng nhập đã hết hạn."));
  }
}
