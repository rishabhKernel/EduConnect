# ⚡ Quick Start - Run in 3 Commands

## 1️⃣ Install Everything
```bash
npm run install-all
```

## 2️⃣ Create Backend Environment File
Create `backend/.env` with:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/parent-teacher-portal
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=7d
NODE_ENV=development
```

## 3️⃣ Start the App
```bash
npm run dev
```

## 🌐 Open Browser
- **App**: http://localhost:3000
- **API Health**: http://localhost:5000/api/health

---

**Need help?** See [RUNNING_GUIDE.md](./RUNNING_GUIDE.md) for detailed instructions.

