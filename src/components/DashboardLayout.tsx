'use client';

import { useRouter } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react';
import { User } from '@/types';

interface DashboardLayoutProps {
    children: ReactNode;
    title: string;
}

export default function DashboardLayout({ children, title }: DashboardLayoutProps) {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const userStr = localStorage.getItem('currentUser');
        if (!userStr) {
            router.push('/login');
            return;
        }

        try {
            const userData = JSON.parse(userStr);
            setUser(userData);
        } catch {
            router.push('/login');
        }
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem('currentUser');
        router.push('/login');
    };

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-pulse text-gray-600">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Top Navigation */}
            <nav className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center">
                            <h1 className="text-xl font-bold text-gray-900">
                                Subscription Platform
                            </h1>
                            <span className="ml-4 px-3 py-1 bg-primary-100 text-primary-800 text-sm font-medium rounded-full">
                                {user.role}
                            </span>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="text-sm">
                                <div className="font-medium text-gray-900">{user.name}</div>
                                <div className="text-gray-500">{user.email}</div>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
                </div>

                {children}
            </main>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-200 mt-auto">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <p className="text-center text-sm text-gray-500">
                        Demo Application - Mock Data Only
                    </p>
                </div>
            </footer>
        </div>
    );
}
