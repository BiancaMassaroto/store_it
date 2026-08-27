<div align="center">

<img src="public/assets/icons/logo-full-brand.svg" alt="StoreIt" width="220" />

### The one place for all your files.

Secure, fast, and simple cloud storage — built with Next.js and Appwrite.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Appwrite](https://img.shields.io/badge/Appwrite-Backend-FD366E?logo=appwrite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind-4-38BDF8?logo=tailwindcss&logoColor=white)

</div>

---

## ✨ Overview

**StoreIt** is a modern file storage and sharing platform where you can upload, organize,
preview, rename, share, and manage every file you own from one clean dashboard. Sign in is
completely **passwordless** — just an email and a one-time code.

Followed this tutorial for reference: https://youtu.be/lie0cr3wESQ?si=jNQYnJ44Ct5SXlUU

## 🚀 Features

- 🔐 **Passwordless auth** — sign up / sign in with email OTP verification, no passwords to remember
- 📤 **Drag-and-drop uploads** — powered by `react-dropzone`, with a 50MB per-file limit and live upload feedback
- 🗂️ **Smart organization** — files are automatically grouped into Documents, Images, Media, and Others
- 🔍 **Search & sort** — instant search plus sorting by date, name, or size
- 📊 **Usage dashboard** — storage breakdown by file type with a visual usage chart and recent uploads
- 🖼️ **Rich previews** — type-aware thumbnails for images, videos, audio, PDFs, and documents
- ✏️ **File actions** — rename, view details, share with other users, download, or delete
- 📱 **Responsive UI** — full sidebar navigation on desktop, mobile drawer navigation on smaller screens

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 16](https://nextjs.org) (App Router) + [React 19](https://react.dev) |
| Language | [TypeScript](https://www.typescriptlang.org) |
| Styling | [Tailwind CSS 4](https://tailwindcss.com) + [shadcn/ui](https://ui.shadcn.com) |
| Backend / BaaS | [Appwrite](https://appwrite.io) (Auth, Database, Storage) |
| Forms & Validation | [React Hook Form](https://react-hook-form.com) + [Zod](https://zod.dev) |
| Charts | [Recharts](https://recharts.org) |
| Uploads | [react-dropzone](https://react-dropzone.js.org) |

## 📁 Project Structure

```
app/
├── (auth)/           # Sign-in & sign-up routes
├── (root)/           # Dashboard + file type views ([type])
components/           # UI building blocks (uploader, cards, sidebar, chart...)
components/ui/        # shadcn/ui primitives
lib/
├── actions/          # Server actions (file.actions, user.actions)
└── appwrite/         # Appwrite client/server config
constants/            # Nav items, sort options, app-wide constants
types/                # Shared TypeScript types
```

## ⚙️ Getting Started

### Prerequisites

- Node.js 18+
- An [Appwrite](https://appwrite.io) project with a database, a `users` collection, a `files`
  collection, and a storage bucket set up

### 1. Clone & install

```bash
git clone <repo-url>
cd store_it
npm install
```

### 2. Configure environment variables

Create a `.env.local` file in the project root:

```bash
NEXT_PUBLIC_APPWRITE_PROJECT_ID=
NEXT_PUBLIC_APPWRITE_PROJECT_NAME=
NEXT_PUBLIC_APPWRITE_ENDPOINT=
NEXT_PUBLIC_APPWRITE_DATABASE=
NEXT_PUBLIC_APPWRITE_USERS_COLLECTION=
NEXT_PUBLIC_APPWRITE_FILES_COLLECTION=
NEXT_PUBLIC_APPWRITE_BUCKET=
NEXT_APPWRITE_SECRET=
```

### 3. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## 📜 Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Build for production |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint |
