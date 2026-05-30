import { forbidden } from "../utils/httpError.js";

export function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(forbidden("Bạn không có quyền thực hiện thao tác này."));
    }
    return next();
  };
}
