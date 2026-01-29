# Crypto Nexus Admin 🚧 (In Progress)

![Status](https://img.shields.io/badge/Status-In%20Progress-yellow)
![Tech Stack](https://img.shields.io/badge/Stack-Next.js%20%7C%20MUI%20%7C%20Redux-blue)

## Executive Summary

This project is a high-performance **Backoffice Administration Panel** built to demonstrate "Enterprise-Ready" frontend architecture. It serves as an administrative tool for tracking crypto assets and managing user data.

The project is designed to strictly adhere to specific technical requirements, showcasing proficiency in **Next.js 14 (App Router)**, **Material UI (MUI v5)**, and **Redux Toolkit**.

## 🛠 Tech Stack & Architecture

- **Framework:** Next.js 14 (App Router & Server Actions)
- **Language:** TypeScript (Strict Mode)
- **UI Library:** Material UI (MUI) v5 + MUI X Data Grid
- **State Management:** Redux Toolkit (RTK) - _Used for global UI state & async data handling_
- **Styling Engine:** Emotion (MUI Default) with SSR Registry
- **Authentication:** Supabase Auth (Planned)

## 🚀 Key Features (Planned & Implemented)

- [x] **Project Infrastructure:**
  - Next.js App Router Setup with TypeScript.
  - MUI Theme Registry for SSR compatibility.
  - Redux Store Configuration with Provider wrapper.
- [x] **Layout Architecture:**
  - Nested Layouts (Dashboard vs. Auth).
  - Responsive Sidebar and Header components.
- [ ] **Authentication:**
  - Supabase integration.
  - Protected Routes.
- [ ] **Dashboard Analytics:**
  - Real-time data visualization with Recharts.
- [ ] **User Management:**
  - Data Grid implementation for large datasets.
  - Server-side filtering and pagination via Redux.

## 📂 Project Structure

```bash
src/
├── app/              # Next.js App Router pages & layouts
├── components/       # Reusable UI components (Atomic design principles)
├── lib/              # Configuration files (Theme, Supabase client)
├── store/            # Redux Toolkit (Slices, Store configuration)
└── types/            # TypeScript interfaces and types
```

## 🏃‍♂️ Getting Started

1. **Clone the repository**

2. **Install dependencies:**

   ```bash
    npm install
   ```

3. **Run the development server::**
   ```bash
    npm run dev
   ```

## Author

| [<img src="https://github.com/altundalyusuf.png?size=115" width="115"><br><sub>@altundalyusuf</sub>](https://github.com/altundalyusuf) |
| :------------------------------------------------------------------------------------------------------------------------------------: |
