# Data Models Documentation

This document describes the data structures and models used in the application.

## User Data

### Users (`users.json`)
- Contains user authentication and profile information
- Used for user management, authentication, and profile data
- Key data points:
  - User ID (unique identifier)
  - Email (unique)
  - Password hash (bcrypt)
  - Username
  - Name
  - Bio
  - Role (user/builder)
  - Joined timestamp
- Example:
```json
{
  "users": [
    {
      "id": "user123",
      "email": "user@example.com",
      "passwordHash": "$2b$10$...",
      "username": "johndoe",
      "name": "John Doe",
      "bio": "Experienced developer...",
      "role": "builder",
      "joinedAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

## Platform Credits

### Pionext Balances (`pionext_balances.json`)
- Platform-wide credit balances for purchasing project credits
- Used for tracking user credit balances
- Key data points:
  - User balances
  - Last update timestamps
- Example:
```json
{
  "balances": [
    {
      "userId": "user123",
      "balance": 1000,
      "lastUpdated": "2024-03-20T12:00:00Z"
    }
  ]
}
```

### Pionext Transactions (`pionext_transactions.json`)
- Platform-wide credit transaction history
- Used for tracking credit purchases and trades
- Key data points:
  - Transaction history
  - Purchase records
- Example:
```json
{
  "transactions": [
    {
      "id": "txn_1",
      "userId": "user123",
      "type": "purchase",
      "amount": 1000,
      "timestamp": "2024-03-20T12:00:00Z"
    }
  ]
}
```

## Project Data

### Projects (`projects.json`)
- Contains project information and metadata
- Used for displaying project listings and details
- Key data points:
  - Project details
  - Project metadata
  - Project status

### Credits (`credits.json`)
- Credit-related information
- Used for managing project credits and trading
- Key data points:
  - Credit types
  - Credit values
  - Current supply
  - Maximum supply
  - Target price

### Credit Transactions (`credit_transactions.json`)
- Trading history and transactions
- Used for tracking credit exchanges
- Key data points:
  - Trade history
  - Transaction details
  - Trading metrics

### Credit Balances (`credit_balances.json`)
- Current credit ownership data
- Used for tracking credit ownership
- Key data points:
  - Current holdings
  - Ownership records
  - Balance information

## Data Flow

```
Projects <-> Credits <-> Credit Transactions
    ↑           ↑
    └─── Users ─┴─> Credit Balances
         ↓
    Pionext Balances/Transactions
```

## Authentication Flow

```
Login/Register -> User Created/Updated -> Session Created
       ↑                                      ↓
       └──────────── Session Check ──────────┘
```

Note: This documentation should be updated as data models evolve or new data structures are added.