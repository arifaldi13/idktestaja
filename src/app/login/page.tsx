'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authenticateUser, DEMO_USERS, getDashboardRoute } from '@/lib/auth';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const user = authenticateUser(email, password);

            if (user) {
                // Store user in localStorage (in real app, use secure session management)
                localStorage.setItem('currentUser', JSON.stringify(user));

                // Redirect to role-specific dashboard
                const dashboardRoute = getDashboardRoute(user.role);
                router.push(dashboardRoute);
            } else {
                setError('Invalid email or password');
            }
        } catch (err) {
            setError('An error occurred during login');
        } finally {
            setLoading(false);
        }
    };

    const handleQuickLogin = (userEmail: string) => {
        const user = DEMO_USERS.find(u => u.email === userEmail);
        if (user) {
            setEmail(user.email);
            setPassword(user.password);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Subscription Platform
                    </h1>
                    <p className="text-gray-600">Demo Application</p>
                </div>

                {/* Login Card */}
                <div className="bg-white rounded-lg shadow-xl p-8">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-6">Login</h2>

                    {/* Quick Login Options */}
                    <div className="mb-6">
                        <p className="text-sm text-gray-600 mb-3">Quick login as:</p>
                        <div className="grid grid-cols-2 gap-2">
                            {DEMO_USERS.map((user) => (
                                <button
                                    key={user.id}
                                    type="button"
                                    onClick={() => handleQuickLogin(user.email)}
                                    className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    {user.role}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="relative mb-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">Or enter credentials</span>
                        </div>
                    </div>

                    {/* Login Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                                {error}
                            </div>
                        )}

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="input"
                                placeholder="user@demo.com"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="input"
                                placeholder="password"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                        >
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                    </form>

                    {/* Demo Credentials Info */}
                    <div className="mt-6 pt-6 border-t border-gray-200">
                        <p className="text-xs text-gray-500 text-center">
                            Demo credentials: Any role email with password &quot;password&quot;
                        </p>
                    </div>
                </div>

                {/* Footer Note */}
                <p className="text-center text-sm text-gray-600 mt-4">
                    This is a demo application with mock data
                </p>
            </div>
        </div>
    );
}
