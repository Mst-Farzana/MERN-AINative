# 🏥 MediSchedule - Medical Appointment & Scheduling System

A modern, production-ready, full-stack web application designed to streamline medical appointments and schedule management. Built with the **MERN stack** and **TypeScript**, featuring a clean, responsive UI and robust security practices.

![MERN Stack](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

---

## 🚀 Live Demo
🔗 **[Live Application](https://your-live-demo-link-here.com)** *(Replace with your Vercel/Render link)*  
🔑 **Test Credentials:**  
- **Doctor:** doctor@test.com / password123  
- **Patient:** patient@test.com / password123  

---

## ✨ Key Features

- 🔐 **Secure Authentication:** JWT-based login/register with secure password hashing (bcrypt).
- 👥 **Role-Based Access Control (RBAC):** Dedicated dashboards and workflows for Doctors and Patients.
- 📱 **Fully Responsive UI:** Modern, clean interface built with Tailwind CSS, optimized for all devices.
- ⚡ **Type-Safe Development:** Full TypeScript implementation across both frontend and backend for robust, error-free code.
- 🛡️ **Protected Routes:** Frontend route guarding to ensure unauthorized users cannot access protected pages.
- 🌐 **RESTful API:** Well-structured, scalable backend API with proper error handling and validation.

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 18 + Vite
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Routing:** React Router v6
- **HTTP Client:** Axios

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB + Mongoose ODM
- **Authentication:** JSON Web Tokens (JWT) + bcryptjs
- **Environment:** Dotenv

---

## 📂 Project Structure

```text
├── backend/
│   ├── config/         # Database & Env configurations
│   ├── controllers/    # Business logic
│   ├── models/         # Mongoose schemas
│   ├── routes/         # API endpoints
│   └── server.ts       # Entry point
├── frontend/
│   ├── src/
│   │   ├── components/ # Reusable UI components
│   │   ├── pages/      # Route-specific pages
│   │   └── App.tsx     # Main routing setup