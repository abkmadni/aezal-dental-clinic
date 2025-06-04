# Aezal Dental Clinic MERN Application

A full-stack MERN (MongoDB, Express, React, Node.js) application for managing patient appointments, treatments, and user authentication at the Aezal Dental Clinic.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running Locally](#running-locally)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- **User Authentication:** JWT-based signup, login, and role-based access control (admin vs. user).
- **Appointment Management:** Create, read, update, and delete patient appointments.
- **Treatment Management:** CRUD operations for dental treatments offered by the clinic.
- **Protected Routes:** Middleware enforces authentication and authorization for sensitive endpoints.
- **Responsive Frontend:** React SPA consuming the Express API with client-side routing.

---

## Tech Stack

- **Frontend:** React, React Router, Tailwind CSS  
- **Backend:** Node.js, Express.js, Mongoose  
- **Database:** MongoDB Atlas  
- **Deployment:** Vercel (frontend & serverless backend)  

---

## Prerequisites

- Node.js (>=14.x)  
- npm or yarn  
- MongoDB Atlas account (or local MongoDB)

---

## Installation

1. **Clone the repository**  
   ```bash
   git clone https://github.com/<your-username>/aezal-dental-clinic.git
   cd aezal-dental-clinic
   ```

2. **Install dependencies**  
   ```bash
   # Backend
   cd backend
   npm install

   # Frontend
   cd ../frontend
   npm install
   ```

---

## Environment Variables

Create a `.env` file in the `backend/` folder with the following variables:

```ini
MONGO_URI=<your-mongodb-connection-string>
JWT_SECRET=<your-jwt-secret>
FRONTEND_URL=http://localhost:3000
```

For production (Vercel), add the same keys in your project settings under **Environment Variables**.

---

## Running Locally

1. **Start the backend server**  
   ```bash
   cd backend
   npm start
   ```
   The API will run at `http://localhost:5000`.

2. **Start the frontend**  
   ```bash
   cd frontend
   npm start
   ```
   The React app will be available at `http://localhost:3000`.

3. **Proxy setup**  
   The React dev server proxies `/api` requests to the backend via the `proxy` field in `frontend/package.json`:

   ```json
   {
     "proxy": "http://localhost:5000"
   }
   ```

---

## API Documentation

### Auth & Users

| Method | Endpoint             | Description                     |
| ------ | -------------------- | ------------------------------- |
| POST   | `/api/users/signup`  | Register a new user             |
| POST   | `/api/users/login`   | Authenticate and return a token |
| GET    | `/api/users/me`      | Get current user profile (auth) |

### Appointments

| Method | Endpoint                    | Description                         |
| ------ | --------------------------- | ----------------------------------- |
| GET    | `/api/appointments`         | List all appointments (admin only)  |
| POST   | `/api/appointments`         | Create a new appointment            |
| GET    | `/api/appointments/:id`     | Get appointment by ID               |
| PUT    | `/api/appointments/:id`     | Update appointment (owner/admin)    |
| DELETE | `/api/appointments/:id`     | Delete appointment (owner/admin)    |

### Treatments

| Method | Endpoint                  | Description                       |
| ------ | ------------------------- | --------------------------------- |
| GET    | `/api/treatments`         | List all treatments               |
| POST   | `/api/treatments`         | Create new treatment (admin only) |
| GET    | `/api/treatments/:id`     | Get treatment by ID               |
| PUT    | `/api/treatments/:id`     | Update treatment (admin only)     |
| DELETE | `/api/treatments/:id`     | Delete treatment (admin only)     |

---

## Deployment

This project is configured to deploy both frontend and backend on Vercel:

1. **Frontend**: `@vercel/static-build` reads from `frontend/build` (or `frontend/dist` if you’re using Vite).  
2. **Backend**: `@vercel/node` serves your Express API under `/api/*`.  
3. **Routes** in `vercel.json`:
   - Proxy `/api/*` to the Express function  
   - Serve static files via Vercel’s CDN  
   - SPA fallback: `/.*` → `/index.html`

---

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
