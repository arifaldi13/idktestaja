'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
    const router = useRouter();

    useEffect(() => {
        // Check if user is logged in
        const userStr = localStorage.getItem('currentUser');

        if (userStr) {
            try {
                const user = JSON.parse(userStr);
                // Redirect to role-specific dashboard
                switch (user.role) {
                    case 'SALES':
                        router.push('/dashboard/sales');
                        break;
                    case 'ADMIN':
                        router.push('/dashboard/admin');
                        break;
                    case 'FINANCE':
                        router.push('/dashboard/finance');
                        break;
                    case 'CLIENT':
                        router.push('/dashboard/client');
                        break;
                    default:
                        router.push('/login');
                }
            } catch {
                router.push('/login');
            }
        } else {
            router.push('/login');
        }
    }, [router]);

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="animate-pulse text-gray-600">Loading...</div>
        </div>
    );
}
