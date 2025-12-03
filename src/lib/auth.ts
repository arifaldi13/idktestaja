// Simple in-memory authentication for demo purposes
// In a production app, use proper authentication like NextAuth.js

import { User } from '@/types';

/**
 * DEMO USERS - Hard-coded for demonstration
 * 
 * To add or modify demo users:
 * 1. Add a new user object to the DEMO_USERS array below
 * 2. Specify: id, email, name, role, and password
 * 3. Available roles: 'SALES', 'ADMIN', 'CLIENT', 'FINANCE', 'SYSTEM'
 * 4. CLIENT users can be linked to a customer organization via customerOrgId
 * 
 * Example:
 * {
 *   id: '5',
 *   email: 'manager@demo.com',
 *   name: 'Manager Demo',
 *   role: 'ADMIN',
 *   password: 'password'
 * }
 */
export const DEMO_USERS: User[] = [
    {
        id: '1',
        email: 'sales@demo.com',
        name: 'Sales Demo',
        role: 'SALES',
        password: 'password',
    },
    {
        id: '2',
        email: 'admin@demo.com',
        name: 'Admin Demo',
        role: 'ADMIN',
        password: 'password',
    },
    {
        id: '3',
        email: 'client@demo.com',
        name: 'Client Demo',
        role: 'CLIENT',
        password: 'password',
        customerOrgId: 'cust-1',
    },
    {
        id: '4',
        email: 'finance@demo.com',
        name: 'Finance Demo',
        role: 'FINANCE',
        password: 'password',
    },
    {
        id: '5',
        email: 'system@demo.com',
        name: 'System Ops',
        role: 'SYSTEM',
        password: 'password',
    },
];

/**
 * Authenticate user with email and password
 * Returns user object if successful, null otherwise
 */
export function authenticateUser(email: string, password: string): User | null {
    const user = DEMO_USERS.find(
        (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (user) {
        // Return user without password
        const { password: _, ...userWithoutPassword } = user;
        return user;
    }

    return null;
}

/**
 * Get user by ID
 */
export function getUserById(id: string): User | null {
    const user = DEMO_USERS.find((u) => u.id === id);
    if (user) {
        const { password: _, ...userWithoutPassword } = user;
        return user;
    }
    return null;
}

/**
 * Get dashboard route for user role
 */
export function getDashboardRoute(role: string): string {
    switch (role) {
        case 'SALES':
            return '/dashboard/sales';
        case 'ADMIN':
            return '/dashboard/admin';
        case 'FINANCE':
            return '/dashboard/finance';
        case 'CLIENT':
            return '/dashboard/client';
        case 'SYSTEM':
            return '/dashboard/admin';
        default:
            return '/login';
    }
}
