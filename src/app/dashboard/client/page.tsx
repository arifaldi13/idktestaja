'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { formatCurrency, formatDate, recordPaymentAttempt, simulatePaymentWebhook } from '@/lib/fakeDb';
import { useDemoData } from '@/lib/useDemoData';
import { User } from '@/types';

export default function ClientDashboard() {
    const data = useDemoData();
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const stored = localStorage.getItem('currentUser');
        if (stored) setUser(JSON.parse(stored));
    }, []);

    const orgId = user?.customerOrgId || data.customers[0]?.id;
    const organization = data.customers.find((c) => c.id === orgId);
    const subscriptions = data.subscriptions.filter((s) => s.customerOrgId === orgId);
    const invoices = data.invoices.filter((i) => i.customerOrgId === orgId);
    const payments = data.payments.filter((p) => invoices.some((inv) => inv.id === p.invoiceId));

    return (
        <DashboardLayout title="Client Portal" allowedRoles={['CLIENT', 'ADMIN']}>
            <p className="text-sm text-gray-600 mb-4">
                Client dapat melihat profil organisasi, subscription, invoice, dan melakukan retry pembayaran (membuat payment
                attempt baru) atau simulasi update metode pembayaran melalui tombol.
            </p>

            <div className="card mb-6">
                <h3 className="text-lg font-semibold">Organization Profile</h3>
                <p className="text-sm text-gray-700">{organization?.name}</p>
                <p className="text-sm text-gray-500">{organization?.billingAddress}</p>
                <p className="text-sm text-gray-500">{organization?.contactEmail}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div className="card">
                    <h3 className="text-lg font-semibold mb-3">Subscriptions</h3>
                    <div className="space-y-3 text-sm">
                        {subscriptions.map((sub) => (
                            <div key={sub.id} className="border rounded p-3">
                                <div className="font-semibold">{sub.subscriptionCode}</div>
                                <div>Status: {sub.status}</div>
                                <div>Next billing: {formatDate(sub.nextBillingDate)}</div>
                                <div className="text-xs text-gray-500">Billing Period: {sub.billingPeriod}</div>
                                <div className="text-xs text-gray-500">Provisioning tasks:</div>
                                <ul className="list-disc ml-4 text-xs">
                                    {data.provisioningTasks
                                        .filter((p) => p.subscriptionId === sub.id)
                                        .map((task) => (
                                            <li key={task.id}>
                                                {task.type} - {task.status}
                                            </li>
                                        ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="card">
                    <h3 className="text-lg font-semibold mb-3">Invoices & Payments</h3>
                    <div className="space-y-2 text-sm">
                        {invoices.map((inv) => (
                            <div key={inv.id} className="border rounded p-3">
                                <div className="font-semibold">{inv.invoiceNumber}</div>
                                <div>Status: {inv.status}</div>
                                <div>Due: {formatDate(inv.dueDate)}</div>
                                <div>Total: {formatCurrency(inv.totalAmount)}</div>
                                <button
                                    className="btn btn-primary w-full mt-2 text-xs"
                                    onClick={() => recordPaymentAttempt(inv.id, 'CLIENT_PORTAL', false)}
                                >
                                    Retry Payment (fails)
                                </button>
                                <button
                                    className="btn btn-secondary w-full mt-2 text-xs"
                                    onClick={() => simulatePaymentWebhook(inv.id, true)}
                                >
                                    Pay now (simulate success)
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="card">
                <h3 className="text-lg font-semibold mb-3">Payment History</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                    {payments.map((pmt) => (
                        <div key={pmt.id} className="border rounded p-3">
                            <div className="font-semibold">{data.invoices.find((i) => i.id === pmt.invoiceId)?.invoiceNumber}</div>
                            <div>{formatCurrency(pmt.amount)}</div>
                            <div>Status: {pmt.status}</div>
                            <div className="text-xs text-gray-500">{formatDate(pmt.paymentDate)}</div>
                        </div>
                    ))}
                </div>
            </div>
        </DashboardLayout>
    );
}

