'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { MOCK_PRODUCTS, MOCK_SUBSCRIPTIONS, formatCurrency, formatDate } from '@/lib/mockData';
import { SubscriptionStatus } from '@/types';

export default function AdminDashboard() {
    const products = MOCK_PRODUCTS;
    const [subscriptions, setSubscriptions] = useState(MOCK_SUBSCRIPTIONS);

    // Calculate summary statistics
    const totalProducts = products.filter(p => p.isActive).length;
    const activeSubscriptions = subscriptions.filter(s => s.status === 'ACTIVE').length;
    const suspendedSubscriptions = subscriptions.filter(s => s.status === 'SUSPENDED').length;

    const getStatusBadgeClass = (status: SubscriptionStatus) => {
        const statusMap = {
            'ACTIVE': 'badge-active',
            'SUSPENDED': 'badge-suspended',
            'CANCELLED': 'badge-cancelled',
            'PENDING_ACTIVATION': 'badge-pending',
        };
        return `badge ${statusMap[status] || 'badge-draft'}`;
    };

    const toggleSubscriptionStatus = (subscriptionId: string) => {
        setSubscriptions(subs =>
            subs.map(sub => {
                if (sub.id === subscriptionId) {
                    const newStatus: SubscriptionStatus =
                        sub.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
                    return { ...sub, status: newStatus };
                }
                return sub;
            })
        );
    };

    return (
        <DashboardLayout title="Admin Dashboard">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="card">
                    <div className="text-sm text-gray-600 mb-1">Active Products</div>
                    <div className="text-3xl font-bold text-gray-900">{totalProducts}</div>
                </div>

                <div className="card">
                    <div className="text-sm text-gray-600 mb-1">Active Subscriptions</div>
                    <div className="text-3xl font-bold text-green-600">{activeSubscriptions}</div>
                </div>

                <div className="card">
                    <div className="text-sm text-gray-600 mb-1">Suspended</div>
                    <div className="text-3xl font-bold text-yellow-600">{suspendedSubscriptions}</div>
                </div>
            </div>

            {/* Products Section */}
            <div className="card mb-8">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Products</h3>
                    <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium">
                        + Add Product
                    </button>
                </div>

                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Code</th>
                                <th>Name</th>
                                <th>Category</th>
                                <th>Billing Period</th>
                                <th>Base Price</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product) => (
                                <tr key={product.id}>
                                    <td className="font-mono text-xs">{product.code}</td>
                                    <td className="font-medium">{product.name}</td>
                                    <td>{product.category}</td>
                                    <td>{product.billingPeriod}</td>
                                    <td className="font-medium">
                                        {formatCurrency(product.basePrice, product.currency)}
                                    </td>
                                    <td>
                                        <span className={product.isActive ? 'badge-active' : 'badge-cancelled'}>
                                            {product.isActive ? 'ACTIVE' : 'INACTIVE'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Subscriptions Section */}
            <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Manage Subscriptions</h3>

                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Subscription Code</th>
                                <th>Customer</th>
                                <th>Status</th>
                                <th>Billing Period</th>
                                <th>Amount</th>
                                <th>Next Billing</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {subscriptions.map((subscription) => (
                                <tr key={subscription.id}>
                                    <td className="font-mono text-xs">{subscription.subscriptionCode}</td>
                                    <td className="font-medium">{subscription.customerName}</td>
                                    <td>
                                        <span className={getStatusBadgeClass(subscription.status)}>
                                            {subscription.status}
                                        </span>
                                    </td>
                                    <td>{subscription.billingPeriod}</td>
                                    <td className="font-medium">
                                        {formatCurrency(subscription.totalAmount, subscription.currency)}
                                    </td>
                                    <td>{formatDate(subscription.nextBillingDate)}</td>
                                    <td>
                                        {(subscription.status === 'ACTIVE' || subscription.status === 'SUSPENDED') && (
                                            <button
                                                onClick={() => toggleSubscriptionStatus(subscription.id)}
                                                className={`text-sm font-medium ${subscription.status === 'ACTIVE'
                                                    ? 'text-yellow-600 hover:text-yellow-800'
                                                    : 'text-green-600 hover:text-green-800'
                                                    }`}
                                            >
                                                {subscription.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </DashboardLayout>
    );
}
