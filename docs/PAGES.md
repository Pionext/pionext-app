# Application Pages Documentation

This document provides an overview of the pages available in the application and their functionalities.

## Main Pages

### Home Page (`/`)
- Entry point of the application
- Located at: `app/page.tsx`
- Features:
  - Hero section for main messaging
  - Features showcase
  - How it works explanation
  - Footer with additional information

### Login Page (`/login`)
- User authentication page
- Located at: `app/login/page.tsx`
- Features:
  - Email and password login form
  - Error handling and validation
  - Link to registration page
  - Loading states for form submission

### Registration Page (`/register`)
- New user registration page
- Located at: `app/register/page.tsx`
- Features:
  - User registration form with name, email, and password
  - Error handling and validation
  - Link to login page
  - Loading states for form submission

### Projects Page (`/projects`)
- Overview of all available projects
- Located at: `app/projects/page.tsx`
- Features:
  - Grid display of all projects
  - "Create Project" button for adding new projects
  - Project discovery interface
  - Information about trading credits through bonding curves
  - Early investor benefits explanation

### New Project Page (`/projects/new`)
- Page for creating new projects
- Located at: `app/projects/new`
- Features:
  - Project creation form
  - Project details input

### Project Details Page (`/projects/[id]`)
- Dynamic route for viewing individual project details
- Located at: `app/projects/[id]`
- Features:
  - Detailed project information
  - Project-specific data and metrics
  - Trading functionality

## Directory Structure

```
app/
├── page.tsx (Home page with hero, features, and how it works sections)
├── login/
│   └── page.tsx (Login page)
├── register/
│   └── page.tsx (Registration page)
├── projects/
│   ├── page.tsx (Projects listing with grid view)
│   ├── new/ (New project creation interface)
│   └── [id]/ (Individual project views and trading)
```

## Page Components

### Home Page Components
- Hero: Main banner and call-to-action
- Features: Highlights of platform capabilities
- HowItWorks: Step-by-step platform explanation
- Footer: Navigation and additional links

### Authentication Components
- Login Form: Email and password authentication
- Registration Form: New user account creation
- Auth Error Display: Validation and error messaging

### Projects Page Components
- ProjectGrid: Display of all available projects
- Create Project Button: Quick access to project creation

Note: This documentation is a work in progress and should be updated as new pages and features are added to the application. 