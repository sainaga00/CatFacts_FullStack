# 🐾 CatFacts Full-Stack App

A fun and interactive full-stack web application where users can view and submit cat facts! Built with **React** for the frontend and **FastAPI** for the backend. Admins can approve or reject submitted facts.

---

## 🚀 Live Demo

- **Frontend**: [https://cat-facts-full-stack.vercel.app/](https://cat-facts-full-stack.vercel.app/)
- **Backend (API)**: [https://catfacts-fullstack.onrender.com/catfacts/](https://catfacts-fullstack.onrender.com/catfacts/)

> 🐢 **Note:** Make sure the backend is awake before testing the frontend. Render may put the backend to sleep after ~15 minutes of inactivity.

---

## 🧩 Tech Stack

- ⚛️ **Frontend**: React + Tailwind CSS
- 🐍 **Backend**: FastAPI + SQLite
- 🌐 **Deployment**: 
  - Frontend hosted on **Vercel**
  - Backend hosted on **Render**

---

## 💡 Features

- 🔍 View a random cat fact on page load
- ➕ Submit your own cat facts (with login)
- 🛡 Admin dashboard to approve or reject submitted facts
- ✨ Fun animations and cat-themed UI using Tailwind

---

## 🛠️ Getting Started

### 🔧 Prerequisites

- Node.js ≥ 14
- Python ≥ 3.9
- `pip` for Python package management

---

## 🖥️ Setup Instructions

### 📦 Setup

```bash
### Frontend Setup
git clone https://github.com/sainaga00/CatFacts_FullStack.git
cd CatFacts_FullStack/frontend
npm install
npm start

### Backend Setup
cd CatFacts_FullStack/backend
pip install -r requirements.txt
uvicorn main:app --reload
