'use client';

import DashboardLayout from '@/components/DashboardLayout';
import { MOCK_SUBSCRIPTIONS, MOCK_INVOICES, formatCurrency, formatDate } from '@/lib/mockData';

export default function ClientDashboard() {
    // In a real app, filter by current client's customer org ID
    // For demo, we'll show first subscription and related invoices
    const clientSubscription = MOCK_SUBSCRIPTIONS[0]; // PT Teknologi Maju
    const clientInvoices = MOCK_INVOICES.filter(
        inv => inv.subscriptionId === clientSubscription.id
    );

    const getInvoiceStatusBadgeClass = (status: string) => {
        const statusMap: Record<string, string> = {
            'DRAFT': 'badge-draft',
            'PENDING': 'badge-pending',
            'PAID': 'badge-paid',
            'OVERDUE': 'badge-overdue',
            'CANCELLED': 'badge-cancelled',
        };
        return `badge ${statusMap[status] || 'badge-draft'}`;
    };

    const getSubscriptionStatusBadgeClass = (status: string) => {
        const statusMap: Record<string, string> = {
            'ACTIVE': 'badge-active',
            'SUSPENDED': 'badge-suspended',
            'CANCELLED': 'badge-cancelled',
            'PENDING_ACTIVATION': 'badge-pending',
        };
        return `badge ${statusMap[status] || 'badge-draft'}`;
    };

    return (
        <DashboardLayout title="My Subscriptions">
            {/* Subscription Overview */}
            <div className="card mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Subscription</h3>

                <div className="space-y-4">
                    <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                        <div>
                            <div className="text-sm text-gray-600">Subscription Code</div>
                            <div className="text-lg font-semibold">{clientSubscription.subscriptionCode}</div>
                        </div>
                        <span className={getSubscriptionStatusBadgeClass(clientSubscription.status)}>
                            {clientSubscription.status}
                        </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <div className="text-sm text-gray-600 mb-1">Start Date</div>
                            <div className="font-medium">{formatDate(clientSubscription.startDate)}</div>
                        </div>
                        <div>
                            <div className="text-sm text-gray-600 mb-1">Billing Period</div>
                            <div className="font-medium">{clientSubscription.billingPeriod}</div>
                        </div>
                        <div>
                            <div className="text-sm text-gray-600 mb-1">Next Billing Date</div>
                            <div className="font-medium">{formatDate(clientSubscription.nextBillingDate)}</div>
                        </div>
                    </div>

                    <div>
                        <div className="text-sm text-gray-600 mb-1">Monthly Amount</div>
                        <div className="text-2xl font-bold text-primary-600">
                            {formatCurrency(clientSubscription.totalAmount, clientSubscription.currency)}
                        </div>
                    </div>
                </div>
            </div>

            {/* Subscription Items */}
            <div className="card mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Services</h3>

                <div className="space-y-3">
                    {clientSubscription.items.map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div>
                                <div className="font-medium">{item.productName}</div>
                                <div className="text-sm text-gray-600">
                                    Quantity: {item.quantity} × {formatCurrency(item.unitPrice)}
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="font-semibold">
                                    {formatCurrency(item.quantity * item.unitPrice)}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Invoices & Payment History */}
            <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Invoice & Payment History</h3>

                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Invoice #</th>
                                <th>Billing Period</th>
                                <th>Amount</th>
                                <th>Due Date</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {clientInvoices.map((invoice) => (
                                <tr key={invoice.id}>
                                    <td className="font-medium">{invoice.invoiceNumber}</td>
                                    <td className="text-sm">
                                        {formatDate(invoice.billingPeriodStart)} - {formatDate(invoice.billingPeriodEnd)}
                                    </td>
                                    <td className="font-medium">
                                        {formatCurrency(invoice.totalAmount, invoice.currency)}
                                    </td>
                                    <td>{formatDate(invoice.dueDate)}</td>
                                    <td>
                                        <span className={getInvoiceStatusBadgeClass(invoice.status)}>
                                            {invoice.status}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="flex gap-2">
                                            <button className="text-primary-600 hover:text-primary-800 text-sm font-medium">
                                                Download
                                            </button>
                                            {invoice.status === 'PENDING' && (
                                                <button className="text-green-600 hover:text-green-800 text-sm font-medium">
                                                    Pay Now
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Payment Method Info */}
            <div className="card mt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Method</h3>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-8 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold">
                            VISA
                        </div>
                        <div>
                            <div className="font-medium">Virtual Account (BCA)</div>
                            <div className="text-sm text-gray-600">**** **** **** 1234</div>
                        </div>
                    </div>
                    <button className="text-primary-600 hover:text-primary-800 text-sm font-medium">
                        Update
                    </button>
                </div>
            </div>
        </DashboardLayout>
    );
}
