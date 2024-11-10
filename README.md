# Task management Backend API

A robust and scalable Node.js backend for Task management built with Express.js, featuring authentication, database integration, and self comprehensive API.

## 🚀 Features

- Express.js framework
- MongoDB database integration
- JWT authentication
- Error handling middleware
- Role base access
- Environment variable configuration

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- MongoDB (local or Atlas URI)
- Git

## 🛠️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Abdurrahman-Alizada/task-managment-backend.git
cd task-managment-backend-main
```

### 2. Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Configure the following variables in your `.env` file:

```env
NODE_ENV=development
PORT=8000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=30d
```

### 3. Install Dependencies & Run

```bash
# Install packages
npm install

# Run in development mode
npm run dev

# Run in production mode
npm start
```

## 🚀 Deployment

### GitHub

1. Create a new repository on GitHub
2. Push your code:
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### Deploy on Render

1. Go to [render.com](https://render.com)
2. Connect your GitHub repository
3. Create a new Web Service
4. Select your repository
5. Configure the following:
   - Environment: `Node`
   - Build Command: `npm install`
   - Start Command: `npm start`
6. Add environment variables in Render dashboard
7. Deploy your application
