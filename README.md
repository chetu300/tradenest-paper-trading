# TradeNest — Virtual Stock Trading Simulator

**A full-stack MERN paper-trading platform for practicing Indian-equity trades with real-time simulated market data.**

**Developed by Chetna Singh**

<p align="left">
  <img alt="React" src="https://img.shields.io/badge/React-19.3.1-61DAFB?logo=react&logoColor=white">
  <img alt="Vite" src="https://img.shields.io/badge/Vite-8.3.8-646CFF?logo=vite&logoColor=white">
  <img alt="Redux" src="https://img.shields.io/badge/Redux_Toolkit-2.15.0-764ABC?logo=redux&logoColor=white">
  <img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind_CSS-3.4.19-38B2AC?logo=tailwindcss&logoColor=white">
  <img alt="Node.js" src="https://img.shields.io/badge/Node.js-Backend-339933?logo=nodedotjs&logoColor=white">
  <img alt="Express" src="https://img.shields.io/badge/Express-5.3.0-000000?logo=express&logoColor=white">
  <img alt="MongoDB" src="https://img.shields.io/badge/MongoDB-Database-47A248?logo=mongodb&logoColor=white">
  <img alt="Mongoose" src="https://img.shields.io/badge/Mongoose-9.12.3-880000">
  <img alt="Socket.IO" src="https://img.shields.io/badge/Socket.IO-4.8.4-010101?logo=socketdotio&logoColor=white">
  <img alt="JWT" src="https://img.shields.io/badge/JWT-Authentication-000000?logo=jsonwebtokens&logoColor=white">
  <img alt="Chart.js" src="https://img.shields.io/badge/Chart.js-4.6.1-FF6384?logo=chartdotjs&logoColor=white">
</p>

> TradeNest is an educational trading simulator. It does not connect to a real exchange, accept real money, or provide investment advice.

## Overview

TradeNest lets users create accounts, receive a virtual wallet balance, explore Indian-equity instruments, execute simulated buy and sell orders, and monitor portfolio performance. The backend maintains a server-generated price feed and persists accounts, holdings, and completed trades in MongoDB.

### Key Features

- **Account authentication:** Registration and login, bcrypt password hashing, JWT issuance with a seven-day expiry, session restoration, and protected React routes.
- **Virtual brokerage wallet:** New users start with ₹1,00,000; successful buy and sell orders update wallet and holdings.
- **Order execution:** Validates positive whole-number quantities, supported symbols, BUY/SELL direction, available cash, and owned share quantities.
- **Portfolio analytics:** Displays wallet balance, holdings, weighted-average buy price, invested value, current value, unrealized P&L, realized P&L, and total P&L.
- **Trade history:** Retrieves completed BUY/SELL records from MongoDB and supports PDF statement export through jsPDF and jsPDF-AutoTable.
- **Real-time simulated market:** The server updates fifteen Indian-equity prices every 2.5 seconds and broadcasts snapshots with Socket.IO.
- **Market exploration:** Provides searchable markets, stock detail views, live price history, market breadth, movement charts, and allocation charts.
- **Personal watchlist:** Stores account-keyed watchlist selections in browser local storage; it is not synchronized through the backend.
- **Interface personalization:** Includes responsive layouts, mobile navigation, and light/dark theme controls.

## System Architecture

```mermaid
flowchart LR
    Browser["React Client<br/>Vite + Redux Toolkit"]
    REST["Express REST API<br/>JWT Middleware"]
    Socket["Socket.IO Server"]
    Engine["Server-Side Price Engine<br/>15 equities / 2.5 seconds"]
    Mongo[("MongoDB<br/>Mongoose")]

    Browser -->|"Axios API requests<br/>JWT in request header"| REST
    REST -->|"Read / write"| Mongo
    Engine -->|"Update in-memory prices"| Socket
    Socket -->|"prices:update events"| Browser
    Browser -->|"WebSocket / polling"| Socket

    subgraph Client["Frontend"]
        Browser
    end

    subgraph Server["Backend"]
        REST
        Socket
        Engine
        Mongo
    end
```

The price engine runs in server memory and is separate from MongoDB. REST operations persist users and trades, while Socket.IO distributes only the generated market snapshots.

## Database Schema & Relationships

TradeNest uses two Mongoose collections.

| Collection | Key Fields | Relationships / Behavior |
| --- | --- | --- |
| `users` | `name`, `email`, `password`, `walletBalance`, `holdings[]`, `createdAt`, `updatedAt` | Email is unique and normalized. Holdings are embedded subdocuments containing `symbol`, `quantity`, and `averagePrice`. Password hashes are excluded from normal queries. |
| `trades` | `user` (ObjectId), `symbol`, `side`, `quantity`, `price`, `total`, `createdAt`, `updatedAt` | `Trade.user` references `User._id`. The field has a MongoDB index. Side is constrained to `BUY` or `SELL`. |

```mermaid
erDiagram
    USER ||--o{ TRADE : "owns"
    USER {
        ObjectId _id PK
        string name
        string email UK
        string password
        number walletBalance
        array holdings
    }
    TRADE {
        ObjectId _id PK
        ObjectId user FK
        string symbol
        enum side
        number quantity
        number price
        number total
        date createdAt
    }
```

Notable model rules include:

- Embedded holdings use no separate `_id`.
- `walletBalance` starts at `100000` and cannot be negative.
- Mongoose optimistic concurrency is enabled on `User`.
- The password is hashed with 12 bcrypt rounds only when it changes.
- Trade quantities, prices, totals, and holding quantities have Mongoose minimum constraints.

## Folder Structure

```text
stock-trading-simulator/
├── backend/
│   ├── config/ controllers/ middleware/ models/
│   ├── routes/ sockets/ tests/ utils/
│   ├── .env.example
│   ├── .railwayignore
│   ├── app.js
│   ├── package.json
│   ├── package-lock.json
│   ├── railway.json
│   └── server.js
├── frontend/
│   ├── public/ src/
│   ├── .env.example
│   ├── netlify.toml
│   ├── package.json
│   └── package-lock.json
├── screenshots/
├── .gitignore
├── LICENSE
└── README.md
```

## API Endpoints Reference

| Method | Endpoint | Auth Required | Description |
| --- | --- | --- | --- |
| `GET` | `/api/health` | No | Returns `{ "status": "ok" }` for API availability checks. |
| `POST` | `/api/auth/signup` | No | Validates name, email, and password; creates a user; returns a JWT and public profile. |
| `POST` | `/api/auth/login` | No | Authenticates normalized email and password; returns a JWT and public profile. |
| `GET` | `/api/auth/me` | Yes — JWT | Restores the current account using the authenticated user ID. |
| `POST` | `/api/trades` | Yes — JWT | Executes a validated BUY or SELL and updates the user's wallet and embedded holdings. |
| `GET` | `/api/portfolio` | Yes — JWT | Returns wallet, holdings, P&L totals, and reversed trade history for the authenticated user. |

Protected routes expect:

```http
Authorization: Bearer <JWT>
```

Socket.IO also exposes the `prices:update` event. A newly connected socket receives the current in-memory price snapshot; subsequent updates are emitted every 2.5 seconds.

## Environment Variables

### Backend

| Variable | Required | Description | Example |
| --- | --- | --- | --- |
| `PORT` | No | HTTP and Socket.IO server port. Falls back to `5000`. | `5000` |
| `MONGO_URI` | Yes | MongoDB connection string. | `mongodb://127.0.0.1:27017/stock-trading-simulator` |
| `JWT_SECRET` | Yes | Secret used to sign and verify seven-day JWTs. | `replace-with-a-long-random-secret` |
| `CLIENT_URL` | No | Allowed frontend origin for REST and Socket.IO. Local Vite origins are also allowed in development. | `https://your-site.netlify.app` |

### Frontend

| Variable | Required | Description | Example |
| --- | --- | --- | --- |
| `VITE_API_URL` | No | Base URL for REST requests. Defaults to `http://localhost:5000/api`. | `https://your-api.up.railway.app/api` |
| `VITE_SOCKET_URL` | No | Socket.IO server URL. Defaults to `http://localhost:5000`. | `https://your-api.up.railway.app` |

## Local Setup & Installation

### Prerequisites

- Node.js 20.19 or later
- npm
- MongoDB Community Server or MongoDB Atlas

### 1. Clone the repository

```bash
git clone https://github.com/chetu300/tradenest-paper-trading.git
cd stock-trading-simulator
```

### 2. Configure and start MongoDB

Start a local MongoDB instance, or create a MongoDB Atlas cluster and obtain a connection string.

### 3. Configure the backend

```bash
cd backend
cp .env.example .env
```

Set `MONGO_URI` and `JWT_SECRET` in `backend/.env`. Generate a strong secret, for example:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

Install and start the backend:

```bash
npm ci
npm run dev
```

The API and Socket.IO server run at `http://localhost:5000` by default.

### 4. Configure and start the frontend

Open a second terminal:

```bash
cd frontend
cp .env.example .env
npm ci
npm run dev
```

The example frontend environment points to the local backend at `http://localhost:5000`. Open `http://localhost:5173`.

### 5. Verify the setup

```bash
curl http://localhost:5000/api/health
```

### Production build

```bash
npm ci
npm run build
npm run preview
```

Run these commands from the `frontend/` directory. The Vite production bundle is generated in `frontend/dist/`.

### Backend tests

```bash
cd backend
npm test
```

The current Jest/Supertest suite mocks Mongoose models and covers buy/sell execution, insufficient funds, insufficient holdings, and portfolio responses.

## Deploy without GitHub: Netlify + Railway

The frontend is configured for Netlify, and the Express API with Socket.IO is configured for Railway. Deploying uploads the app source to these services; local `.env` files and secrets are excluded. The database must be reachable through a MongoDB Atlas connection string.

### 1. Deploy the backend to Railway

1. Create a Railway account and install the Railway CLI using Railway's official instructions.
2. From the `backend/` directory, run `railway login`, link to a new or existing Railway project, then deploy with `railway up`.
3. In the Railway service variables, set `MONGO_URI` to your MongoDB Atlas connection string and `JWT_SECRET` to a unique long random secret.
4. Generate a public domain for the service and verify `https://YOUR-RAILWAY-DOMAIN/api/health` returns `{"status":"ok"}`.

### 2. Deploy the frontend to Netlify

1. Create a Netlify account and install and log in to the Netlify CLI using Netlify's official instructions.
2. From the `frontend/` directory, run `netlify init` to create or link a site.
3. In the Netlify site's environment settings, add these variables using the Railway public domain:

   ```text
   VITE_API_URL=https://YOUR-RAILWAY-DOMAIN/api
   VITE_SOCKET_URL=https://YOUR-RAILWAY-DOMAIN
   ```

4. Run `netlify deploy --prod` from `frontend/` to build and publish the site.
5. Copy the Netlify site origin into Railway's `CLIENT_URL` variable and redeploy/restart the Railway service.

The `frontend/netlify.toml` file sets the build output and SPA route fallback. Never put `MONGO_URI` or `JWT_SECRET` in Netlify or in frontend code. Keep them only in Railway's backend environment variables.

## Security & Performance Highlights

- **JWT authentication:** Signup and login issue signed, seven-day tokens; protected routes verify a Bearer token in the Authorization header.
- **Password security:** Passwords are hashed with bcryptjs at cost 12 and omitted from normal user reads.
- **Server-side authorization:** Trade and portfolio operations derive the account from the verified JWT rather than a client-supplied user ID.
- **CORS allowlisting:** REST and Socket.IO allow the configured `CLIENT_URL` and local Vite development origins.
- **Request size limit:** Express limits JSON request bodies to 20 KB.
- **Input and domain validation:** Authentication fields, positive whole-number quantities, supported symbols, trade sides, balances, and share ownership are checked on the server.
- **Optimistic concurrency:** Mongoose user documents detect overlapping account updates and return a conflict response.
- **Database indexing:** The trade `user` ObjectId reference is indexed for user-specific portfolio queries.
- **Money rounding:** Trade totals and P&L values are rounded before responses and persisted updates.
- **Efficient market delivery:** Socket.IO broadcasts a full price snapshot at a fixed 2.5-second interval rather than opening external market-feed connections.

The codebase does **not** currently include Helmet or an HTTP rate-limiting middleware. These would be recommended before a public production deployment.

## Live Demo & Screenshots

The application does not seed a demo account. Create a disposable account through sign-up before sharing a live demo.

| Item | Link / details |
| --- | --- |
| Live Demo | Deploy with Netlify and Railway using the steps above. |
| Demo Account | Create an account through the sign-up page. |
| Dashboard Screenshot | [screenshots/dashboard.jpg](./screenshots/dashboard.jpg) |
| Markets Screenshot | [screenshots/markets.jpg](./screenshots/markets.jpg) |
| Portfolio Screenshot | [screenshots/portfolio.jpg](./screenshots/portfolio.jpg) |
| Trade Confirmation Screenshot | [screenshots/trade-confirmation.jpg](./screenshots/trade-confirmation.jpg) |
