# Online Pharmacy

A full-stack online pharmacy e-commerce application built with the MERN stack. It provides customers with an online shopping experience and administrators with tools to manage products, orders, coupons, and advertisements.

## Features

### Customer

- User registration and login.
- Google OAuth authentication.
- Browse products and view product details.
- Shopping cart management.
- Place and manage orders.
- Apply discount coupons.
- Online payments using Stripe and PayPal.

### Administrator

- Manage products.
- Manage customer orders.
- Create and manage discount coupons.
- Manage advertisements.

## Technology Stack

| Component       | Technologies                   |
| --------------- | ------------------------------ |
| Frontend        | React, Vite, Redux Toolkit     |
| Backend         | Node.js, Express.js            |
| Database        | MongoDB, Mongoose              |
| Authentication  | JWT, Passport.js, Google OAuth |
| Payments        | Stripe, PayPal                 |
| File Management | Cloudinary                     |
| Email           | SendGrid                       |

## Project Structure

```text
online-pharmacy/
│
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   ├── .env.example
│   └── package.json
│
├── server/                 # Express backend
│   ├── config/
│   ├── controllers/
│   ├── helpers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── seeds/
│   ├── utils/
│   ├── __tests__/
│   ├── .env.example
│   └── package.json
│
└── README.md
```

## Getting Started

### Prerequisites

- Node.js and npm
- MongoDB
- Git

### 1. Clone the repository

```bash
git clone <YOUR_REPOSITORY_URL>
cd online-pharmacy-master
```

### 2. Install dependencies

Frontend:

```bash
cd client
npm install
```

Backend:

```bash
cd ../server
npm install
```

### 3. Configure environment variables

Create local environment files using the provided examples:

```bash
cp client/.env.example client/.env
cp server/.env.example server/.env
```

Configure the required values in both files.

### 4. Start MongoDB

Make sure MongoDB is running.

The default backend connection string is:

```text
mongodb://127.0.0.1:27017/online-pharmacy
```

### 5. Start the backend

```bash
cd server
npm run dev
```

The backend runs on port `8000` by default.

### 6. Start the frontend

In another terminal:

```bash
cd client
npm run dev
```

The frontend is available at:

```text
http://localhost:5173
```

## Environment Variables

The project uses separate environment configuration files for the frontend and backend.

### Backend

Some of the main configuration variables:

| Variable               | Description                  |
| ---------------------- | ---------------------------- |
| `PORT`                 | Backend server port          |
| `MONGODB_URI`          | MongoDB connection string    |
| `ACCESS_TOKEN_SECRET`  | Access token signing secret  |
| `REFRESH_TOKEN_SECRET` | Refresh token signing secret |
| `SESSION_SECRET`       | Express session secret       |
| `FRONTEND_URL`         | Frontend application URL     |
| `GOOGLE_AUTH_CLIENTID` | Google OAuth client ID       |
| `GOOGLE_AUTH_SECRET`   | Google OAuth client secret   |
| `STRIPE_SECRET_KEY`    | Stripe API key               |
| `PAYPAL_CLIENT_ID`     | PayPal client ID             |
| `PAYPAL_CLIENT_SECRET` | PayPal client secret         |
| `CLOUDINARY_NAME`      | Cloudinary account name      |
| `SEND_GRID_API_KEY`    | SendGrid API key             |

Refer to `server/.env.example` for the complete configuration.

### Frontend

| Variable                | Description                           |
| ----------------------- | ------------------------------------- |
| `VITE_PAYPAL_CLIENT_ID` | PayPal client ID used by the frontend |

Refer to `client/.env.example` for the frontend configuration.

**Note:** Never commit actual `.env` files or private credentials to the repository.

## Running Tests

The backend uses Jest for automated testing.

```bash
cd server
npm test
```

## License

This project is intended for educational and portfolio purposes.
