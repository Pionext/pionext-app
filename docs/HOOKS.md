# Custom Hooks Documentation

This document describes the custom React hooks used in the application.

## Available Hooks

### useAuth
- Location: `hooks/use-auth.ts`
- Purpose: Manages user authentication state and operations
- Features:
  - User login functionality
  - User registration
  - Logout handling
  - Authentication state management
  - Error handling
- Usage Example:
```typescript
const { user, login, register, logout, isLoading, error } = useAuth();

// Login
await login({ email: "user@example.com", password: "password" });

// Register
await register({ name: "User Name", email: "user@example.com", password: "password" });

// Logout
await logout();
```

### useCredits
- Location: `contexts/credits-context.tsx`
- Purpose: Manages Pionext credits state and operations
- Features:
  - Credit balance tracking
  - Credit purchase functionality
  - Transaction history
  - Real-time balance updates
- Usage Example:
```typescript
const { balance, transactions, purchaseCredits, isLoading } = useCredits();

// Purchase credits
await purchaseCredits(100); // Purchase 100 PIONEXT credits

// Access balance
console.log(`Current balance: ${balance} PIONEXT`);
```

### usePionextCredits
- Location: `hooks/use-pionext-credits.ts`
- Purpose: Manages Pionext credits balance and transactions
- Features:
  - Fetches and tracks user credit balance
  - Handles credit purchases
  - Maintains transaction history
  - Real-time balance updates
- Usage Example:
```typescript
const { balance, transactions, purchaseCredits, isLoading } = usePionextCredits();

// Purchase credits
await purchaseCredits(100); // Purchase 100 credits

// Access balance and transactions
console.log(`Current balance: ${balance}`);
console.log('Recent transactions:', transactions);
```

### useCreateProject
- Location: `hooks/use-create-project.ts`
- Purpose: Manages project creation functionality
- Features:
  - Project creation logic
  - Form handling
  - Submission processing

### useProject
- Location: `hooks/use-project.ts`
- Purpose: Manages individual project data and operations
- Features:
  - Project data fetching
  - Project state management
  - Project updates

### useProjectCredits
- Location: `hooks/use-project-credits.ts`
- Purpose: Handles project-specific credit operations
- Features:
  - Credit data management
  - Credit-related calculations
  - Credit state updates

## Hook Dependencies

```
useAuth
    └─> (Independent)

useCredits
    └─> useAuth

useCreateProject
    └─> useProject
           └─> useProjectCredits
```

## Usage Examples

### Authentication
```typescript
const { login, register, logout, user } = useAuth();
```

### Credits Management
```typescript
const { balance, purchaseCredits } = useCredits();
```

### Project Creation
```typescript
const { createProject, isLoading } = useCreateProject();
```

### Project Data Access
```typescript
const { project, isLoading } = useProject(projectId);
```

### Credit Management
```typescript
const { credits, updateCredits } = useProjectCredits(projectId);
```

Note: This documentation should be updated as new hooks are added or existing hooks are modified. 