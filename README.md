# ZenMarket E-commerce App (MERN Stack)

A full-stack e-commerce application built with the MERN stack (MongoDB, Express, React, Node.js), featuring user authentication, product browsing, cart, wishlist, checkout with PayU, order management, and an admin panel.

## Tech Stack

* **Frontend:** React, Vite, Redux Toolkit, Material UI (MUI), Axios, React Router
* **Backend:** Node.js, Express, MongoDB, Mongoose
* **Authentication:** JWT (JSON Web Tokens), bcrypt
* **Image Handling:** Cloudinary, Multer
* **Payment:** PayU
* **Real-time (Admin):** Socket.IO
* **Other:** Nodemailer (for password reset)

## Project Structure

```
ZenMarket-Ecommerce/
├── backend/      # Node.js/Express API, Mongoose models, etc.
├── frontend/     # React/Vite client application
└── README.md     # This file
```

## Local Setup Instructions

### Prerequisites

* Node.js (v18 or later recommended)
* npm or yarn
* MongoDB (local instance or MongoDB Atlas free tier)
* Cloudinary Account (for image hosting)
* PayU Merchant Account (Test/Sandbox recommended for development)
* Mailtrap Account (or other SMTP service for password reset emails)

### Backend Setup

1.  **Navigate to backend:**
    ```bash
    cd backend
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```
3.  **Create `.env` file:** Create a file named `.env` in the `backend` directory and add the following environment variables, replacing the placeholder values with your actual credentials:
    ```dotenv
    PORT=5000
    MONGOURL=mongodb://your_mongodb_connection_string...
    JWT_SECRET=your_strong_jwt_secret
    SMTP_HOST=sandbox.smtp.mailtrap.io # Or your SMTP host
    SMTP_PORT=2525 # Or your SMTP port
    SMTP_USER=your_smtp_username
    SMTP_PASS=your_smtp_password
    EMAIL_FROM=Your Name <from@example.com> # Email address for password reset

    CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
    CLOUDINARY_API_KEY=your_cloudinary_api_key
    CLOUDINARY_API_SECRET=your_cloudinary_api_secret

    # Payment PayU (Use Test Keys for Development)
    PAYU_MERCHANT_KEY=your_payu_key
    PAYU_MERCHANT_SALT=your_payu_salt
    ```
4.  **(Optional) Seed Database:** To populate with sample data:
    ```bash
    npm run data:import
    ```
5.  **Run Backend:**
    ```bash
    npm run dev
    ```
    The backend server should now be running (usually on `http://localhost:5000`).

### Frontend Setup

1.  **Navigate to frontend:**
    ```bash
    cd frontend
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```
3.  **Create `.env` file:** Create a file named `.env` in the `frontend` directory and add the following:
    ```dotenv
    VITE_API_URL=http://localhost:5000
    ```
    *(Note: For deployment, this URL will need to be changed to your deployed backend URL).*
4.  **Run Frontend:**
    ```bash
    npm run dev
    ```
    The frontend development server should now be running (usually on `http://localhost:5173`).

## Running the Project

* Start the backend server: `cd backend && npm run dev`
* Start the frontend server: `cd frontend && npm run dev`
* Access the application in your browser (typically `http://localhost:5173`).