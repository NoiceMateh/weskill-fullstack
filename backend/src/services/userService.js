import bcrypt from "bcryptjs";
import { isMongoReady } from "../config/db.js";
import { User } from "../models/User.js";
import { memory, publicUser, makeId, clone } from "../data/memoryStore.js";
import { getPagination, paginateArray } from "../utils/pagination.js";
import { badRequest, notFound } from "../utils/httpError.js";

export async function findUserById(id) {
  if (isMongoReady()) {
    const user = await User.findById(id);
    return user ? user.toJSON() : null;
  }
  const user = memory.users.find((item) => item.id === id);
  return publicUser(user);
}

export async function findUserWithPasswordByEmail(email) {
  const normalized = String(email || "").trim().toLowerCase();
  if (isMongoReady()) {
    return User.findOne({ email: normalized });
  }
  return memory.users.find((item) => item.email === normalized) || null;
}

export async function createUser(payload) {
  const email = String(payload.email || "").trim().toLowerCase();
  if (!email || !payload.password || !payload.firstName) {
    throw badRequest("Vui lòng nhập đầy đủ họ tên, email và mật khẩu.");
  }

  const existing = await findUserWithPasswordByEmail(email);
  if (existing) throw badRequest("Email đã được sử dụng.");

  const passwordHash = await bcrypt.hash(payload.password, 10);

  if (isMongoReady()) {
    const created = await User.create({
      firstName: payload.firstName,
      lastName: payload.lastName || "",
      phone: payload.phone || "",
      email,
      passwordHash,
      role: payload.role || "student",
    });
    return created.toJSON();
  }

  const user = {
    id: makeId("user"),
    firstName: payload.firstName,
    lastName: payload.lastName || "",
    phone: payload.phone || "",
    email,
    passwordHash,
    role: payload.role || "student",
    isActive: true,
    jobStatus: "unknown",
    refreshTokenHash: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  memory.users.push(user);
  return publicUser(user);
}

export async function setRefreshToken(userId, refreshToken) {
  const refreshTokenHash = refreshToken ? await bcrypt.hash(refreshToken, 10) : null;
  if (isMongoReady()) {
    await User.findByIdAndUpdate(userId, { refreshTokenHash });
    return;
  }
  const user = memory.users.find((item) => item.id === userId);
  if (user) user.refreshTokenHash = refreshTokenHash;
}

export async function verifyRefreshToken(userId, refreshToken) {
  const user = await findUserWithPasswordById(userId);
  if (!user?.refreshTokenHash) return null;
  const ok = await bcrypt.compare(refreshToken, user.refreshTokenHash);
  return ok ? publicUser(user.toJSON ? user.toJSON() : user) : null;
}

export async function findUserWithPasswordById(id) {
  if (isMongoReady()) return User.findById(id);
  return memory.users.find((item) => item.id === id) || null;
}

export async function listUsers(query) {
  const search = String(query.search || "").trim().toLowerCase();

  if (isMongoReady()) {
    const { page, limit, skip } = getPagination(query);
    const filter = search
      ? {
          $or: [
            { email: { $regex: search, $options: "i" } },
            { firstName: { $regex: search, $options: "i" } },
            { lastName: { $regex: search, $options: "i" } },
          ],
        }
      : {};
    const [results, totalResults] = await Promise.all([
      User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      User.countDocuments(filter),
    ]);
    return { results: results.map((user) => user.toJSON()), page, limit, totalResults, totalPages: Math.ceil(totalResults / limit) || 1 };
  }

  const filtered = memory.users
    .map(publicUser)
    .filter((user) => !search || `${user.email} ${user.firstName} ${user.lastName}`.toLowerCase().includes(search));
  return paginateArray(filtered, query);
}

export async function updateUser(userId, payload) {
  const allowed = {};
  if (payload.role) allowed.role = payload.role;
  if (payload.isActive !== undefined) allowed.isActive = Boolean(payload.isActive);
  if (!Object.keys(allowed).length) throw badRequest("Không có dữ liệu cập nhật hợp lệ.");

  if (isMongoReady()) {
    const user = await User.findByIdAndUpdate(userId, allowed, { new: true });
    if (!user) throw notFound("Không tìm thấy tài khoản.");
    return user.toJSON();
  }

  const user = memory.users.find((item) => item.id === userId);
  if (!user) throw notFound("Không tìm thấy tài khoản.");
  Object.assign(user, allowed, { updatedAt: new Date().toISOString() });
  return clone(publicUser(user));
}
