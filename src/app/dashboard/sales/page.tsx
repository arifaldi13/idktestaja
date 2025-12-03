'use client';

import DashboardLayout from '@/components/DashboardLayout';
import { MOCK_QUOTATIONS, formatCurrency, formatDate } from '@/lib/mockData';
import { QuotationStatus } from '@/types';

export default function SalesDashboard() {
    const quotations = MOCK_QUOTATIONS;

    // Calculate summary statistics
    const totalQuotations = quotations.length;
    const acceptedQuotations = quotations.filter(q => q.status === 'ACCEPTED').length;
    const sentQuotations = quotations.filter(q => q.status === 'SENT').length;
    const draftQuotations = quotations.filter(q => q.status === 'DRAFT').length;

    const getStatusBadgeClass = (status: QuotationStatus) => {
        const statusMap = {
            'DRAFT': 'badge-draft',
            'SENT': 'badge-sent',
            'ACCEPTED': 'badge-accepted',
            'REJECTED': 'badge-rejected',
            'EXPIRED': 'badge-cancelled',
        };
        return `badge ${statusMap[status] || 'badge-draft'}`;
    };

    return (
        <DashboardLayout title="Sales Dashboard">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="card">
                    <div className="text-sm text-gray-600 mb-1">Total Quotations</div>
                    <div className="text-3xl font-bold text-gray-900">{totalQuotations}</div>
                </div>

                <div className="card">
                    <div className="text-sm text-gray-600 mb-1">Accepted</div>
                    <div className="text-3xl font-bold text-green-600">{acceptedQuotations}</div>
                </div>

                <div className="card">
                    <div className="text-sm text-gray-600 mb-1">Sent</div>
                    <div className="text-3xl font-bold text-blue-600">{sentQuotations}</div>
                </div>

                <div className="card">
                    <div className="text-sm text-gray-600 mb-1">Draft</div>
                    <div className="text-3xl font-bold text-gray-600">{draftQuotations}</div>
                </div>
            </div>

            {/* Quotations List */}
            <div className="card">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Quotations</h3>
                    <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium">
                        + New Quotation
                    </button>
                </div>

                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Quotation #</th>
                                <th>Customer</th>
                                <th>Status</th>
                                <th>Amount</th>
                                <th>Valid Until</th>
                                <th>Created</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {quotations.map((quotation) => (
                                <tr key={quotation.id}>
                                    <td className="font-medium">{quotation.quotationNumber}</td>
                                    <td>
                                        <div>{quotation.customerName}</div>
                                        <div className="text-xs text-gray-500">{quotation.contactEmail}</div>
                                    </td>
                                    <td>
                                        <span className={getStatusBadgeClass(quotation.status)}>
                                            {quotation.status}
                                        </span>
                                    </td>
                                    <td className="font-medium">
                                        {formatCurrency(quotation.totalAmount, quotation.currency)}
                                    </td>
                                    <td>{formatDate(quotation.validUntil)}</td>
                                    <td>{formatDate(quotation.createdAt)}</td>
                                    <td>
                                        <div className="flex gap-2">
                                            <button className="text-primary-600 hover:text-primary-800 text-sm font-medium">
                                                View
                                            </button>
                                            {quotation.status === 'DRAFT' && (
                                                <button className="text-green-600 hover:text-green-800 text-sm font-medium">
                                                    Send
                                                </button>
                                            )}
                                            {quotation.status === 'SENT' && (
                                                <button className="text-green-600 hover:text-green-800 text-sm font-medium">
                                                    Accept
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
        </DashboardLayout>
    );
}
