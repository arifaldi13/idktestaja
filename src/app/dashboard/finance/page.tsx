'use client';

import DashboardLayout from '@/components/DashboardLayout';
import { MOCK_INVOICES, MOCK_PAYMENTS, formatCurrency, formatDate } from '@/lib/mockData';
import { InvoiceStatus, PaymentStatus } from '@/types';

export default function FinanceDashboard() {
    const invoices = MOCK_INVOICES;
    const payments = MOCK_PAYMENTS;

    // Calculate summary statistics
    const totalRevenue = payments
        .filter(p => p.status === 'SUCCESS')
        .reduce((sum, p) => sum + p.amount, 0);

    const pendingAmount = invoices
        .filter(i => i.status === 'PENDING')
        .reduce((sum, i) => sum + i.totalAmount, 0);

    const overdueAmount = invoices
        .filter(i => i.status === 'OVERDUE')
        .reduce((sum, i) => sum + i.totalAmount, 0);

    const getInvoiceStatusBadgeClass = (status: InvoiceStatus) => {
        const statusMap = {
            'DRAFT': 'badge-draft',
            'PENDING': 'badge-pending',
            'PAID': 'badge-paid',
            'OVERDUE': 'badge-overdue',
            'CANCELLED': 'badge-cancelled',
        };
        return `badge ${statusMap[status] || 'badge-draft'}`;
    };

    const getPaymentStatusBadgeClass = (status: PaymentStatus) => {
        const statusMap = {
            'PENDING': 'badge-pending',
            'SUCCESS': 'badge-success',
            'FAILED': 'badge-failed',
            'REFUNDED': 'badge-cancelled',
        };
        return `badge ${statusMap[status] || 'badge-draft'}`;
    };

    return (
        <DashboardLayout title="Finance Dashboard">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="card">
                    <div className="text-sm text-gray-600 mb-1">Total Revenue</div>
                    <div className="text-2xl font-bold text-green-600">
                        {formatCurrency(totalRevenue)}
                    </div>
                </div>

                <div className="card">
                    <div className="text-sm text-gray-600 mb-1">Pending Payments</div>
                    <div className="text-2xl font-bold text-yellow-600">
                        {formatCurrency(pendingAmount)}
                    </div>
                </div>

                <div className="card">
                    <div className="text-sm text-gray-600 mb-1">Overdue Invoices</div>
                    <div className="text-2xl font-bold text-red-600">
                        {formatCurrency(overdueAmount)}
                    </div>
                </div>
            </div>

            {/* Invoices Section */}
            <div className="card mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Invoices</h3>

                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Invoice #</th>
                                <th>Customer</th>
                                <th>Status</th>
                                <th>Amount</th>
                                <th>Due Date</th>
                                <th>Billing Period</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {invoices.map((invoice) => (
                                <tr key={invoice.id}>
                                    <td className="font-medium">{invoice.invoiceNumber}</td>
                                    <td>{invoice.customerName}</td>
                                    <td>
                                        <span className={getInvoiceStatusBadgeClass(invoice.status)}>
                                            {invoice.status}
                                        </span>
                                    </td>
                                    <td className="font-medium">
                                        {formatCurrency(invoice.totalAmount, invoice.currency)}
                                    </td>
                                    <td>{formatDate(invoice.dueDate)}</td>
                                    <td className="text-xs">
                                        {formatDate(invoice.billingPeriodStart)} - {formatDate(invoice.billingPeriodEnd)}
                                    </td>
                                    <td>
                                        <button className="text-primary-600 hover:text-primary-800 text-sm font-medium">
                                            View Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Payments Section */}
            <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment History</h3>

                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Invoice #</th>
                                <th>Customer</th>
                                <th>Amount</th>
                                <th>Payment Method</th>
                                <th>Payment Date</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {payments.map((payment) => (
                                <tr key={payment.id}>
                                    <td className="font-medium">{payment.invoiceNumber}</td>
                                    <td>{payment.customerName}</td>
                                    <td className="font-medium">
                                        {formatCurrency(payment.amount, payment.currency)}
                                    </td>
                                    <td>{payment.paymentMethod}</td>
                                    <td>{formatDate(payment.paymentDate)}</td>
                                    <td>
                                        <span className={getPaymentStatusBadgeClass(payment.status)}>
                                            {payment.status}
                                        </span>
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
