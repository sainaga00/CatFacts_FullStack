# 🐾 CatFacts Full-Stack App

A fun and interactive full-stack web application where users can view and submit cat facts! Built with **React** for the frontend and **FastAPI** for the backend. Admins can approve or reject submitted facts.

---

## 🚀 Live Demo

- **Frontend**: [https://cat-facts-full-stack.vercel.app/](https://cat-facts-full-stack.vercel.app/)
- **Backend (API)**: [https://catfacts-fullstack.onrender.com/catfacts/](https://catfacts-fullstack.onrender.com/catfacts/)

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
- ➕ Add your own cat facts (admin approval required)
- 🛡 Admin dashboard to approve or reject facts
- ⚡ Fast, responsive, and animated cat-themed UI

---

## 🛠️ Getting Started

### 🔧 Prerequisites

- Node.js ≥ 14
- Python ≥ 3.9
- `pip` for managing Python packages

---

## 🖥 Setup 

```bash

## Frontend Setup 
cd frontend
npm install
npm start

## Backend Setup 
cd backend
pip install -r requirements.txt
uvicorn main:app --reload

