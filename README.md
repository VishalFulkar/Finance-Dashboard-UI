# 💎  Premium Finance Dashboard UI

A high-end, responsive Personal Finance Management Dashboard built with **React**, **Redux Toolkit**, and **Tailwind CSS**. Designed with a focus on glassmorphism, smooth data transitions, and a "Premium SaaS" aesthetic.

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Redux](https://img.shields.io/badge/Redux-593D88?style=for-the-badge&logo=redux&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Framer](https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)

## ✨ Key Features

### 📊 Advanced Features 
- **Multi-Month Trend Analysis**: Compare wealth progression across January, February, and March.
- **Cumulative Growth Curves**: Logic-driven line charts that show real-time balance accumulation.
- **Spending Breakdown**: Interactive donut charts with category-wise percentage impact.
- **Download CSV**: Added a feature that allows users to download transactions as a CSV file.

### 🔐 Role-Based Access Control (RBAC)
- **Admin Role**: Full CRUD capabilities—Add, Edit, and Delete transactions.
- **Viewer Role**: Read-only access to charts and history.
- **User Switching**: Integrated UI to toggle between profiles seamlessly.

### 📱 Premium UX/UI
- **Responsive Navigation**: A hybrid sidebar that transforms into a smooth Framer Motion drawer on mobile.
- **Glassmorphism Design**: Soft gradients, high-radius corners (`2.5rem`), and subtle backdrop blurs.
- **Localized Formatting**: Automatic `INR` currency formatting (e.g., ₹85,000).

## 🚀 Tech Stack

- **Core**: React 18
- **State**: Redux Toolkit
- **Charts**: Recharts
- **Icons**: Lucide-React
- **Animations**: Framer Motion
- **Routing**: React Router Dom v6

## 🛠️ Installation

1. **Clone the repo**
   ```bash
   git clone https://github.com/VishalFulkar/Finance-Dashboard-UI.git

2. **Install Dependencies**
   ```bash
   npm install

3. Start Development Server
   ```bash
   npm run dev


## 📂 Project Structure
``` text
  FINANCE DASHBOARD UI
├── public/
│   ├── assets/             # Global static images/icons
│   └── vite.svg
├── src/
│   ├── assets/             # Local component assets
│   ├── components/         # Reusable UI components
│   │   ├── modal/          # Transaction CRUD modals
│   │     
│   ├── data/               # Initial seed data
│   │        
│   ├── pages/              # Main view containers
│   │   
│   ├── redux/              # State management
│   │   ├── features/       # Redux slices
│   │
│   ├── App.jsx             # Main routing & layout
│   └── main.jsx            # Application entry point
├── package.json
└── vite.config.js
```

## ---

## 👨‍💻 Developed By

**Vishal Fulkar** 

[![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/VishalFulkar)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/VishalFulkar)

> "Building digital solutions for a better financial future."
