'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import {
    acceptQuotation,
    addQuotation,
    formatCurrency,
    formatDate,
    generateQuotationPdf,
    sendQuotationEmail,
} from '@/lib/fakeDb';
import { useDemoData } from '@/lib/useDemoData';
import { Product, QuotationStatus } from '@/types';

export default function SalesDashboard() {
    const data = useDemoData();
    const [form, setForm] = useState({ customerOrgId: data.customers[0]?.id, contactPersonId: data.contacts[0]?.id, productId: data.products[0]?.id, quantity: 10 });

    const quotations = data.quotations;
    const totalQuotations = quotations.length;
    const acceptedQuotations = quotations.filter((q) => q.status === 'ACCEPTED').length;
    const sentQuotations = quotations.filter((q) => q.status === 'SENT').length;
    const draftQuotations = quotations.filter((q) => q.status === 'DRAFT').length;

    const getStatusBadgeClass = (status: QuotationStatus) => {
        const statusMap = {
            DRAFT: 'badge-draft',
            SENT: 'badge-sent',
            ACCEPTED: 'badge-accepted',
            REJECTED: 'badge-rejected',
            EXPIRED: 'badge-cancelled',
        } as Record<string, string>;
        return `badge ${statusMap[status] || 'badge-draft'}`;
    };

    const selectedProduct = (productId: string | undefined): Product | undefined =>
        data.products.find((p) => p.id === productId);

    const handleCreateQuotation = () => {
        const product = selectedProduct(form.productId);
        if (!product) return;
        addQuotation({
            customerOrgId: form.customerOrgId!,
            contactPersonId: form.contactPersonId!,
            salesUserId: '1',
            items: [
                {
                    productId: product.id,
                    quantity: Number(form.quantity),
                    unitPrice: product.basePrice,
                    billingPeriod: product.billingPeriod,
                },
            ],
            notes: 'Quick quotation',
        });
    };

    return (
        <DashboardLayout title="Sales Dashboard" allowedRoles={['SALES', 'ADMIN']}>
            <p className="text-sm text-gray-600 mb-4">
                Sales dapat membuat quotation, mengirim email, menandai ACCEPTED (memicu request invoice), serta memantau master
                data pelanggan & kontak.
            </p>

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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className="card lg:col-span-2">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold">Quotations</h3>
                        <span className="text-sm text-gray-600">PDF & email tetap mock</span>
                    </div>
                    <div className="table-container">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Quotation #</th>
                                    <th>Customer</th>
                                    <th>Status</th>
                                    <th>Valid</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {quotations.map((quotation) => {
                                    const customer = data.customers.find((c) => c.id === quotation.customerOrgId);
                                    return (
                                        <tr key={quotation.id}>
                                            <td className="font-medium">{quotation.quotationNumber}</td>
                                            <td>
                                                <div>{customer?.name}</div>
                                                <div className="text-xs text-gray-500">
                                                    {data.contacts.find((c) => c.id === quotation.contactPersonId)?.email}
                                                </div>
                                            </td>
                                            <td>
                                                <span className={getStatusBadgeClass(quotation.status)}>{quotation.status}</span>
                                            </td>
                                            <td>{formatDate(quotation.validUntil)}</td>
                                            <td className="space-x-2">
                                                <button className="text-primary-600" onClick={() => generateQuotationPdf(quotation.id)}>
                                                    Generate PDF
                                                </button>
                                                <button className="text-blue-600" onClick={() => sendQuotationEmail(quotation.id)}>
                                                    Send Email
                                                </button>
                                                <button className="text-green-600" onClick={() => acceptQuotation(quotation.id)}>
                                                    Accept
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="card">
                    <h3 className="text-lg font-semibold mb-3">Quick Quotation Builder</h3>
                    <div className="space-y-3">
                        <div>
                            <label className="text-sm text-gray-600">Customer</label>
                            <select
                                className="input"
                                value={form.customerOrgId}
                                onChange={(e) => setForm({ ...form, customerOrgId: e.target.value })}
                            >
                                {data.customers.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="text-sm text-gray-600">Contact</label>
                            <select
                                className="input"
                                value={form.contactPersonId}
                                onChange={(e) => setForm({ ...form, contactPersonId: e.target.value })}
                            >
                                {data.contacts
                                    .filter((c) => c.customerOrgId === form.customerOrgId)
                                    .map((c) => (
                                        <option key={c.id} value={c.id}>
                                            {c.name}
                                        </option>
                                    ))}
                            </select>
                        </div>
                        <div>
                            <label className="text-sm text-gray-600">Product</label>
                            <select
                                className="input"
                                value={form.productId}
                                onChange={(e) => setForm({ ...form, productId: e.target.value })}
                            >
                                {data.products.map((p) => (
                                    <option key={p.id} value={p.id}>
                                        {p.name} ({formatCurrency(p.basePrice)})
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="text-sm text-gray-600">Quantity</label>
                            <input
                                className="input"
                                type="number"
                                value={form.quantity}
                                onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })}
                            />
                        </div>
                        <button className="btn btn-primary w-full" onClick={handleCreateQuotation}>
                            Create Quotation
                        </button>
                        <p className="text-xs text-gray-500">
                            Setelah quotation di-mark ACCEPTED, Finance akan melihat entri request invoice otomatis.
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className="card lg:col-span-2">
                    <h3 className="text-lg font-semibold mb-3">Sent Emails (simulated)</h3>
                    <div className="space-y-2">
                        {data.sentEmails.length === 0 && <p className="text-sm text-gray-500">Belum ada email terkirim.</p>}
                        {data.sentEmails.map((email) => (
                            <div key={email.id} className="border rounded p-3">
                                <div className="text-sm font-medium">{email.subject}</div>
                                <div className="text-xs text-gray-500">To: {email.to}</div>
                                <div className="text-xs text-gray-500">{formatDate(email.sentAt)}</div>
                                <p className="text-sm mt-1">{email.body}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="card">
                    <h3 className="text-lg font-semibold mb-3">Invoice Requests</h3>
                    <ul className="space-y-2">
                        {data.invoiceRequests.map((req) => {
                            const quotation = data.quotations.find((q) => q.id === req.quotationId);
                            return (
                                <li key={req.id} className="border rounded p-3 text-sm">
                                    <div className="font-semibold">{quotation?.quotationNumber}</div>
                                    <div>Status: {req.status}</div>
                                    <div className="text-gray-500">Requested: {formatDate(req.requestedAt)}</div>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>

            <div className="card">
                <h3 className="text-lg font-semibold mb-3">Customer & Contact Directory</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {data.customers.map((customer) => (
                        <div key={customer.id} className="border rounded p-3">
                            <div className="font-semibold">{customer.name}</div>
                            <div className="text-sm text-gray-500">{customer.billingAddress}</div>
                            <div className="text-sm text-gray-500">{customer.contactEmail}</div>
                            <div className="mt-2 text-xs text-gray-600">Contacts:</div>
                            <ul className="text-xs text-gray-700 list-disc ml-4">
                                {data.contacts
                                    .filter((c) => c.customerOrgId === customer.id)
                                    .map((c) => (
                                        <li key={c.id}>
                                            {c.name} ({c.role}) - {c.email}
                                        </li>
                                    ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </DashboardLayout>
    );
}

