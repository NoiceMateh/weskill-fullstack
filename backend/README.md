# WeSkill Backend

Backend Express/Mongoose theo plan: auth, users, courses, payments, enrollments, roadmaps, reviews va site content.

## Cau truc dang dung

```txt
src/
├── app.js
├── server.js
├── config/
├── controllers/
├── data/
├── middlewares/
├── models/
├── routes/
├── scripts/
├── services/
└── utils/
```

Backend dang dung ES modules (`import/export`). Khong dung bo route/controller/model CommonJS cu.

## Chay local

```bash
cd backend
npm install
copy .env.example .env
npm run dev
```

API mac dinh: `http://localhost:4000/v1`.

Neu `MONGODB_URI` de trong, backend tu dung in-memory seed de frontend co the chay thu ngay. Khi co MongoDB Atlas, dien `MONGODB_URI` va chay:

```bash
npm run seed
```

## Tai khoan seed khi dung in-memory hoac seed Mongo

- Admin: `admin@weskill.vn` / `123456`
- Instructor: `mentor@weskill.vn` / `123456`
- Student: `student@weskill.vn` / `123456`

## Loi port 4000 dang bi dung

Kiem tra tien trinh dang giu port:

```powershell
Get-NetTCPConnection -LocalPort 4000 | Select-Object LocalAddress,LocalPort,State,OwningProcess
Get-Process -Id <PID>
```

Dung server cu:

```powershell
Stop-Process -Id <PID> -Force
```

Hoac doi port trong `.env`:

```env
PORT=4001
```
