# 🏦 Bank Ledger — Backend API

> A banking ledger REST API with double-entry bookkeeping, JWT auth, idempotent transactions, and email notifications.

Built with **Node.js** · **Express 5** · **MongoDB** · **Mongoose 9**

---

## Features

- JWT authentication (register / login / logout) with token blacklisting
- Multi-account support per user (ACTIVE / FROZEN / CLOSED)
- Double-entry ledger — every transfer creates a DEBIT + CREDIT entry
- Immutable ledger entries (cannot be updated or deleted)
- Idempotent transactions via client-provided idempotency keys
- Atomic transfers using MongoDB sessions
- Balance derived from ledger (never stored as a static field)
- System user can seed initial funds into any account
- Email notifications on registration & transactions (Gmail OAuth2)

---

## Setup

```bash
git clone https://github.com/Aksh015/bank-ledger.git
cd bank-ledger
npm install
```

Create a `.env` file:

```env
MONGO_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLIENT_ID=your_google_oauth_client_id
CLIENT_SECRET=your_google_oauth_client_secret
REFRESH_TOKEN=your_google_oauth_refresh_token
EMAIL_USER=your_email@gmail.com
```

Run:

```bash
npm run dev     # development (nodemon)
npm start       # production
```

Server runs at `http://localhost:3000`

---

## API Endpoints

> Auth: send JWT via cookie (`token`) or header (`Authorization: Bearer <token>`)

### Auth

| Method | Endpoint             | Auth | Description          |
| ------ | -------------------- | ---- | -------------------- |
| POST   | `/api/auth/register` | No   | Register a new user  |
| POST   | `/api/auth/login`    | No   | Login & get token    |
| POST   | `/api/auth/logout`   | Yes  | Logout & blacklist token |

**Register body:** `{ email, password, name }`
**Login body:** `{ email, password }`

### Accounts

| Method | Endpoint                          | Auth | Description                 |
| ------ | --------------------------------- | ---- | --------------------------- |
| POST   | `/api/accounts/`                  | Yes  | Create a new account        |
| GET    | `/api/accounts/`                  | Yes  | Get all user accounts       |
| GET    | `/api/accounts/balance/:accountId`| Yes  | Get account balance         |

### Transactions

| Method | Endpoint                                   | Auth        | Description                |
| ------ | ------------------------------------------ | ----------- | -------------------------- |
| POST   | `/api/transactions/`                       | Yes         | Transfer funds             |
| POST   | `/api/transactions/system/initial-funds`   | System User | Seed funds into an account |

**Transfer body:** `{ fromAccount, toAccount, amount, idempotencyKey }`
**Initial funds body:** `{ toAccount, amount, idempotencyKey }`

#### Transfer Flow

1. Validate request → 2. Check idempotency key → 3. Verify accounts are ACTIVE → 4. Check balance → 5. Create PENDING transaction → 6. DEBIT sender → 7. CREDIT receiver → 8. Mark COMPLETED → 9. Commit session → 10. Send email

---

## Data Models

```
User        →  email, name, password (hashed), systemUser
Account     →  user (ref), status, currency (INR)
Transaction →  fromAccount, toAccount, amount, status, idempotencyKey
Ledger      →  account, amount, transaction, type (CREDIT/DEBIT)  [immutable]
TokenBlacklist → token, createdAt (TTL: 3 days)
```

**Balance** = `SUM(credits) − SUM(debits)` — always derived from ledger, never stored.

---

## Project Structure

```
server.js                        # Entry point
src/
├── app.js                       # Express app & routes
├── config/db.js                 # MongoDB connection
├── controllers/                 # Auth, Account, Transaction logic
├── middleware/auth.middleware.js # JWT & system-user guards
├── models/                      # Mongoose schemas
├── routes/                      # Route definitions
└── services/email.service.js    # Gmail OAuth2 emails
```

---

## License

ISC
