# PIONEXT Platform

PIONEXT is a hybrid investment platform combining crowdfunding mechanics with automated market making (AMM) through bonding curves. The platform enables builders to raise funds while providing investors with liquid trading opportunities through project-specific app credits.

## Core Features

- **Project Funding**: Builders can raise funds through credit sales
- **Bonding Curves**: Automated price discovery based on supply/demand
- **Credit System**: 
  - Platform credits (PIONEXT) fixed at 1:1 with USD
  - Project-specific credits tradeable through bonding curves
  - Early investors benefit from discounted rates (up to 60% off)
  - Example: Pay 40 PIONEXT ($40) for 100 credits ($100 value)
- **User Authentication**:
  - Secure email/password authentication
  - Session persistence
  - Profile management
  - Protected routes

## Current Implementation

### Authentication System
- **User Management**:
  - Registration with email/password
  - Secure password hashing with bcrypt
  - Session-based authentication
  - Profile viewing and management

- **Protected Features**:
  - Project creation
  - Investment actions
  - Profile access
  - Trading operations

### Project Management
- Browse available projects
- Create new projects
- View project details
- Trading interface (in development)

## Technical Stack

- **Frontend**:
  - Next.js 14 (App Router)
  - React with TypeScript
  - Tailwind CSS for styling
  - Shadcn UI components

- **Backend**:
  - Next.js API Routes
  - File-based data storage (JSON)
  - bcrypt for password hashing
  - Session-based auth

- **Development Tools**:
  - TypeScript for type safety
  - ESLint for code quality
  - Prettier for code formatting

## Project Structure

```
app/
├── api/                 # API routes
│   └── auth/           # Authentication endpoints
├── components/         # Reusable components
├── providers/          # Context providers
├── hooks/             # Custom React hooks
└── data/              # JSON data storage
```

## Getting Started

1. **Installation**
   ```bash
   npm install
   ```

2. **Development**
   ```bash
   npm run dev
   ```

3. **Testing Authentication**
   - Visit `/register` to create an account
   - Visit `/login` to sign in
   - Visit `/profile` to view your profile
   - Protected routes require authentication

## Trading Opportunities

- **Early Investor Advantages**:
  - Buy project credits at lower initial prices
  - Sell credits at higher prices as demand grows
  - Reinvest profits into other early-stage projects
  - Build portfolio value through strategic timing
- **Active Trading**:
  - Trade between different project credits
  - Capitalize on price movements through bonding curves
  - No lock-up periods - trade anytime
  - Use profits to access more projects at early stages

## How It Works

### For Builders
1. Register and verify account
2. Submit project details including:
   - Project description
   - Funding goal
   - App credit economics
   - Supporting materials (pitch deck, videos, demos)
   - Credentials/reputation
3. Once approved, launch credit sales

### For Investors
1. Create account
2. Purchase PIONEXT credits (1 PIONEXT = $1 USD)
3. Invest in project credits
4. Trade credits using bonding curves
   - Prices automatically adjust based on supply/demand
   - Early investors benefit from lower initial prices
   - Credits can be traded anytime through the platform

## Platform Limitations (MVP)

Current limitations include:
- No direct fiat currency integration
- No PIONEXT credit cash-out functionality
- No token-to-fiat conversion
- Simplified token economics
- Basic user profiles

## Upcoming Features

- [ ] Enhanced authentication with OAuth providers
- [ ] Email verification
- [ ] Password reset functionality
- [ ] User profile editing
- [ ] Advanced session management
- [ ] Role-based access control

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

[Add license information here]