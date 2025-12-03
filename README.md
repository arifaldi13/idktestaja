# Subscription Platform Demo

A minimal Next.js demonstration application for a subscription management platform with role-based authentication and dashboards. This demo implements key concepts from the subscription platform specification (docs.md) including quotations, subscriptions, invoices, and payments.

## Features

- **Role-Based Authentication**: Four user roles with different dashboard views
  - **SALES**: Manage quotations and track deals
  - **ADMIN**: Manage products and subscriptions
  - **FINANCE**: View invoices and payment history
  - **CLIENT**: View subscriptions and invoices

- **Mock Data**: Realistic Indonesian business data including:
  - Google Workspace products
  - Google Cloud Platform services
  - Domain registration
  - Managed services
  - Quotations, subscriptions, invoices, and payments

- **Clean Business UI**: Professional design suitable for business demonstrations

## Quick Start

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Demo User Accounts

Click the quick login buttons on the login page or use these credentials:

| Role | Email | Password |
|------|-------|----------|
| SALES | sales@demo.com | password |
| ADMIN | admin@demo.com | password |
| CLIENT | client@demo.com | password |
| FINANCE | finance@demo.com | password |

## Project Structure

```
src/
├── app/
│   ├── dashboard/
│   │   ├── sales/       # Sales dashboard
│   │   ├── admin/       # Admin dashboard
│   │   ├── finance/     # Finance dashboard
│   │   └── client/      # Client dashboard
│   ├── login/           # Login page
│   ├── globals.css      # Global styles
│   ├── layout.tsx       # Root layout
│   └── page.tsx         # Home page (redirects)
├── components/
│   └── DashboardLayout.tsx  # Reusable dashboard layout
├── lib/
│   ├── auth.ts          # Authentication logic
│   └── mockData.ts      # Mock data
└── types/
    └── index.ts         # TypeScript type definitions
```

## Customization

### How to Add or Modify Demo Users

Edit `src/lib/auth.ts` and modify the `DEMO_USERS` array:

```typescript
export const DEMO_USERS: User[] = [
  {
    id: '5',
    email: 'newuser@demo.com',
    name: 'New User',
    role: 'SALES', // or 'ADMIN', 'CLIENT', 'FINANCE'
    password: 'password',
  },
  // ... existing users
];
```

### How to Modify Mock Data

Edit `src/lib/mockData.ts` to customize:

- **Products**: `MOCK_PRODUCTS` array
- **Quotations**: `MOCK_QUOTATIONS` array
- **Subscriptions**: `MOCK_SUBSCRIPTIONS` array
- **Invoices**: `MOCK_INVOICES` array
- **Payments**: `MOCK_PAYMENTS` array

### How to Add New Roles

1. Update the `UserRole` type in `src/types/index.ts`:
```typescript
export type UserRole = 'SALES' | 'ADMIN' | 'CLIENT' | 'FINANCE' | 'NEW_ROLE';
```

2. Add the route mapping in `src/lib/auth.ts`:
```typescript
export function getDashboardRoute(role: string): string {
  switch (role) {
    // ... existing cases
    case 'NEW_ROLE':
      return '/dashboard/newrole';
    default:
      return '/login';
  }
}
```

3. Create a new dashboard page at `src/app/dashboard/newrole/page.tsx`

## Deployment to Vercel

### Option 1: Deploy via Vercel Dashboard

1. Push this code to a GitHub repository
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Click "Deploy"

### Option 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Option 3: One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=YOUR_REPO_URL)

## Build for Production

```bash
# Create production build
npm run build

# Start production server locally
npm start
```

## Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **Authentication**: Simple in-memory (demo only)
- **Data**: Mock data (no database)

## Important Notes

⚠️ **This is a DEMO application**:
- Uses in-memory authentication (not secure for production)
- Uses mock data (no real database)
- No real payment integrations
- Suitable for demonstrations and prototypes only

## Next Steps for Production

To make this production-ready, you would need to:

1. **Authentication**: Implement proper authentication (e.g., NextAuth.js)
2. **Database**: Add a real database (e.g., PostgreSQL with Prisma)
3. **API**: Create API routes for data operations
4. **Security**: Add proper security measures (CSRF protection, etc.)
5. **Payment Integration**: Integrate with Xendit or other payment gateways
6. **External Services**: Integrate with Google Workspace, GCP APIs
7. **Email**: Add email notifications
8. **Testing**: Add unit and integration tests

## License

This is a demo application for demonstration purposes only.
