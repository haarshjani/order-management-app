# 🚀 Food order APP

A brief description of your project goes here.

---

## 📦 Prerequisites

Make sure you have the following installed:

- Node.js (v18 or later recommended)
- npm
- A running database (SQLITE /PostgreSQL / MySQL / MongoDB — as configured in Prisma)
- Git

---

## 🛠 Installation & Setup

Follow these steps to set up and run the project in development mode.

---

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

---

### 2️⃣ Install Dependencies

```bash
npm install
```

---

### 3️⃣ Setup Environment Variables

Create a `.env` file in the root directory and add:

```env
DATABASE_URL="your_database_connection_string"
```

Make sure your database is running before continuing.

---

### 4️⃣ Generate Prisma Client

```bash
npx prisma generate
```

---

### 5️⃣ Push Database Schema

```bash
npx prisma db push
```

---

### 6️⃣ Seed the Database

```bash
npx prisma db seed
```

---

### 7️⃣ Start Development Server

```bash
npm run dev
```

Your application should now be running at:

```
http://localhost:3000
```

---

## 🗄 Prisma Commands Reference

| Command | Description |
|----------|------------|
| `npx prisma generate` | Generate Prisma Client |
| `npx prisma db push` | Push schema to database |
| `npx prisma db seed` | Seed the database |
| `npx prisma studio` | Open Prisma Studio |
| `npx prisma migrate dev` | Create and apply migration |

---


## ⚠️ Important Notes

- Always run `npx prisma generate` after modifying `schema.prisma`.
- Make sure your database service is running before executing Prisma commands.
- If you face dependency issues, try:
  
```bash
rm -rf node_modules package-lock.json
npm install
```

---

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first.

---

## 📄 License

This project is licensed under the MIT License.

---

⭐ If you like this project, don't forget to star the repository!
