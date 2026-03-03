# 🚀 Project Setup Guide

Hey, Suyog here to tell you about the basic working and fixing errors for this repository.

This is the **2nd repo** (created to avoid dependency conflicts and unnecessary errors) of our main website.  
In this repo, your task is simple:

> 🎯 You only have to design **one page**.

Keep it clean. Keep it structured. No unnecessary complexity.

---

# 📦 Before Running the Project

Please follow these steps **carefully** before hitting `npm run dev`.

---

## 1️⃣ Check if Node.js is Installed

Open terminal and run:

```bash
node -v
```

and

```bash
npm -v
```

If versions are displayed, you're good.

If not installed, download and install Node.js from:  
https://nodejs.org/

Recommended version: **Node 18+**

---

## 2️⃣ Make Sure You're in the Correct Folder

Navigate to the project directory:

```bash
cd project-folder-name
```

Make sure you see:

- `package.json`
- `app/` or `pages/`
- `node_modules` (after install)

If you don’t see `package.json`, you are in the wrong folder.

---

## 3️⃣ Install Dependencies (Important Step)

Run:

```bash
npm install --legacy-peer-deps
```

### Why `--legacy-peer-deps`?

Some libraries (especially 3D libraries and UI components) may have peer dependency conflicts.  
This flag helps avoid unnecessary installation errors.

Wait until installation completes successfully.

---

## 4️⃣ Run Development Server

Now start the project:

```bash
npm run dev
```

Then open:

```
http://localhost:3000
```

---

# 🧱 What You Are Expected To Do

- Design **only one page**
- Keep structure clean
- Follow folder conventions
- Avoid modifying core config files unless necessary

---

# 🛠️ Adding More Libraries

You are allowed to install additional libraries if required.

### For 3D:
```bash
npm install three @react-three/fiber @react-three/drei
```

### For UI / Components:
```bash
npm install framer-motion
npm install gsap
npm install lucide-react
```

### For Styling:
```bash
npm install tailwindcss
```

You may also install helper utilities if needed.

⚠️ Just ensure:

- The project still runs
- No breaking changes are introduced
- No unnecessary heavy packages

---

# ⚠️ Common Errors & Fixes

### ❌ "Module not found"

Run:
```bash
npm install
```

---

### ❌ Port already in use

Kill the running process or use:
```bash
npm run dev -- --port 3001
```

---

### ❌ Dependency conflict error

Use:
```bash
npm install --legacy-peer-deps
```

---

### ❌ Blank screen

- Check browser console (F12)
- Check terminal errors
- Ensure component is properly exported

---

# 📁 Folder Structure Reminder

App Router (Recommended):

```
app/
 ├── page.jsx
 └── sample/
      └── page.jsx
```

Each folder represents a route.

---

# 🧠 Final Notes

- Keep your code structured.
- Keep commits meaningful.
- Avoid unnecessary modifications.
- Focus on design and functionality of your assigned page.

This repo exists to keep development clean and error-free.