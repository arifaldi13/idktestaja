'use client';

import DashboardLayout from '@/components/DashboardLayout';
import {
    attachPaymentLink,
    createInvoiceFromQuotation,
    formatCurrency,
    formatDate,
    refundPayment,
    recordPaymentAttempt,
    simulatePaymentWebhook,
    uploadInvoiceFiles,
} from '@/lib/fakeDb';
import { useDemoData } from '@/lib/useDemoData';
import { createPaymentLink } from '@/lib/integrations/xenditMock';

export default function FinanceDashboard() {
    const data = useDemoData();

    const openInvoiceRequests = data.invoiceRequests.filter((r) => r.status === 'OPEN');

    return (
        <DashboardLayout title="Finance Dashboard" allowedRoles={['FINANCE', 'ADMIN']}>
            <p className="text-sm text-gray-600 mb-4">
                Finance menerima request invoice, mengunggah invoice/tax invoice, mengelola pembayaran manual/melalui mock Xendit,
                serta melihat payment attempts dan refund.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className="card lg:col-span-2">
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="font-semibold">Invoice Requests from Sales</h3>
                        <span className="text-xs text-gray-500">ACCEPTED quotations only</span>
                    </div>
                    <ul className="space-y-2">
                        {openInvoiceRequests.map((req) => {
                            const quotation = data.quotations.find((q) => q.id === req.quotationId);
                            const customer = data.customers.find((c) => c.id === quotation?.customerOrgId);
                            return (
                                <li key={req.id} className="border rounded p-3 text-sm flex justify-between items-center">
                                    <div>
                                        <div className="font-semibold">{quotation?.quotationNumber}</div>
                                        <div className="text-gray-500">{customer?.name}</div>
                                    </div>
                                    <button className="btn btn-primary text-xs" onClick={() => createInvoiceFromQuotation(req.quotationId)}>
                                        Create Invoice
                                    </button>
                                </li>
                            );
                        })}
                        {openInvoiceRequests.length === 0 && <p className="text-sm text-gray-500">No open requests.</p>}
                    </ul>
                </div>

                <div className="card">
                    <h3 className="font-semibold mb-2">Xendit (mock)</h3>
                    <p className="text-xs text-gray-600 mb-3">Generate payment link and push to invoice.</p>
                    <div className="space-y-2">
                        {data.invoices.map((inv) => (
                            <div key={inv.id} className="border rounded p-2 text-xs">
                                <div className="font-semibold">{inv.invoiceNumber}</div>
                                <div>Status: {inv.status}</div>
                                <button
                                    className="btn btn-secondary w-full mt-1"
                                    onClick={() => attachPaymentLink(inv.id, createPaymentLink(inv.id))}
                                >
                                    Generate payment link
                                </button>
                                {inv.paymentLink && <div className="text-blue-600 break-all">{inv.paymentLink}</div>}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="card mb-8">
                <h3 className="text-lg font-semibold mb-3">Invoices</h3>
                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Invoice</th>
                                <th>Customer</th>
                                <th>Status</th>
                                <th>Due</th>
                                <th>Total</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.invoices.map((inv) => {
                                const customer = data.customers.find((c) => c.id === inv.customerOrgId);
                                return (
                                    <tr key={inv.id}>
                                        <td className="font-medium">{inv.invoiceNumber}</td>
                                        <td>{customer?.name}</td>
                                        <td>{inv.status}</td>
                                        <td>{formatDate(inv.dueDate)}</td>
                                        <td>{formatCurrency(inv.totalAmount)}</td>
                                        <td className="space-x-2 text-xs">
                                            <button className="text-blue-600" onClick={() => uploadInvoiceFiles(inv.id)}>
                                                Upload PDFs
                                            </button>
                                            <button className="text-green-600" onClick={() => simulatePaymentWebhook(inv.id, true)}>
                                                Mark Paid
                                            </button>
                                            <button className="text-red-600" onClick={() => simulatePaymentWebhook(inv.id, false)}>
                                                Fail Payment
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className="card">
                    <h3 className="font-semibold mb-3">Payments</h3>
                    <div className="space-y-2 text-sm">
                        {data.payments.map((pmt) => {
                            const invoice = data.invoices.find((i) => i.id === pmt.invoiceId);
                            return (
                                <div key={pmt.id} className="border rounded p-3">
                                    <div className="font-semibold">{invoice?.invoiceNumber}</div>
                                    <div>{formatCurrency(pmt.amount)}</div>
                                    <div>Status: {pmt.status}</div>
                                    <button className="btn btn-secondary mt-2 text-xs" onClick={() => refundPayment(pmt.id)}>
                                        Refund
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="card">
                    <h3 className="font-semibold mb-3">Payment Attempts</h3>
                    <div className="space-y-2 text-sm">
                        {data.paymentAttempts.map((att) => {
                            const invoice = data.invoices.find((i) => i.id === att.invoiceId);
                            return (
                                <div key={att.id} className="border rounded p-3">
                                    <div className="font-semibold">{invoice?.invoiceNumber}</div>
                                    <div>Status: {att.status}</div>
                                    <div>Channel: {att.channel}</div>
                                    {att.failureReason && <div className="text-red-600">{att.failureReason}</div>}
                                    <button
                                        className="btn btn-secondary mt-2 text-xs"
                                        onClick={() => recordPaymentAttempt(att.invoiceId, 'MANUAL_RETRY', true, att.subscriptionId)}
                                    >
                                        Retry success
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

