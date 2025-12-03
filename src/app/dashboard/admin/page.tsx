'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import {
    advanceProvisioning,
    changeSubscriptionQuantity,
    formatCurrency,
    formatDate,
    getReports,
    runDunningProcess,
    runRecurringBillingCron,
    simulatePaymentWebhook,
    updateSubscriptionStatus,
} from '@/lib/fakeDb';
import { useDemoData } from '@/lib/useDemoData';

export default function AdminDashboard() {
    const data = useDemoData();
    const [reports, setReports] = useState(getReports());
    const [quantityChange, setQuantityChange] = useState<{ subId?: string; productId?: string; qty: number }>({ qty: 1 });

    const refreshReports = () => setReports(getReports());

    return (
        <DashboardLayout title="Admin / Backoffice" allowedRoles={['ADMIN', 'SYSTEM']}>
            <p className="text-sm text-gray-600 mb-4">
                Admin mengelola master data, subscription manual override, provisioning tasks, webhook events, recurring billing,
                dunning, serta laporan bisnis sederhana.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <div className="card">
                    <h3 className="font-semibold">Products (master data)</h3>
                    <ul className="text-sm mt-2 space-y-1">
                        {data.products.map((p) => (
                            <li key={p.id} className="flex justify-between">
                                <span>
                                    {p.name} ({p.category})
                                </span>
                                <span className="text-gray-600">{formatCurrency(p.basePrice)}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="card">
                    <h3 className="font-semibold">Recurring Billing</h3>
                    <p className="text-xs text-gray-600 mb-2">Cek next_billing_date dan generate invoice + payment attempt.</p>
                    <button className="btn btn-primary w-full mb-2" onClick={() => runRecurringBillingCron()}>
                        Run recurring billing cron
                    </button>
                    <button className="btn btn-secondary w-full" onClick={() => runDunningProcess()}>
                        Run dunning (auto suspend)
                    </button>
                </div>

                <div className="card">
                    <h3 className="font-semibold">Reports</h3>
                    <button className="btn btn-secondary text-xs mb-2" onClick={refreshReports}>
                        Refresh snapshot
                    </button>
                    <div className="text-xs text-gray-700 space-y-2">
                        <div>
                            <div className="font-semibold">Revenue by product</div>
                            <ul>
                                {reports.revenueByProduct.map((r) => (
                                    <li key={r.productName}>
                                        {r.productName}: {formatCurrency(r.total)}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <div className="font-semibold">Overdue invoices</div>
                            <ul>
                                {reports.overdueInvoices.map((inv) => (
                                    <li key={inv.id}>
                                        {inv.invoiceNumber} - {formatDate(inv.dueDate)}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <div className="font-semibold">Subscriptions</div>
                            <ul>
                                {reports.subscriptionCounts.map((s) => (
                                    <li key={s.status}>
                                        {s.status}: {s.count}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <div className="font-semibold">Dunning targets</div>
                            <ul>
                                {reports.riskyCustomers.map((c) => (
                                    <li key={c.customerOrgId}>
                                        {data.customers.find((cust) => cust.id === c.customerOrgId)?.name} ({c.failures} failed)
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card mb-6">
                <h3 className="font-semibold mb-3">Subscriptions Manual Override</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    {data.subscriptions.map((sub) => (
                        <div key={sub.id} className="border rounded p-3">
                            <div className="font-semibold">{sub.subscriptionCode}</div>
                            <div>Status: {sub.status}</div>
                            <div>Next billing: {formatDate(sub.nextBillingDate)}</div>
                            <div className="text-xs text-gray-500">Customer: {data.customers.find((c) => c.id === sub.customerOrgId)?.name}</div>
                            <div className="mt-2 text-xs">Items:</div>
                            <ul className="list-disc ml-4">
                                {data.subscriptionItems
                                    .filter((i) => i.subscriptionId === sub.id)
                                    .map((item) => (
                                        <li key={item.id}>
                                            {data.products.find((p) => p.id === item.productId)?.name} - qty {item.quantity}
                                        </li>
                                    ))}
                            </ul>
                            <div className="mt-2 space-x-2">
                                <button
                                    className="btn btn-secondary text-xs"
                                    onClick={() => updateSubscriptionStatus(sub.id, 'CANCELLED')}
                                >
                                    Cancel
                                </button>
                                <button className="btn btn-primary text-xs" onClick={() => updateSubscriptionStatus(sub.id, 'ACTIVE')}>
                                    Activate
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="mt-4 flex gap-2 items-end">
                    <div>
                        <label className="text-xs text-gray-600">Subscription</label>
                        <select
                            className="input"
                            onChange={(e) => setQuantityChange({ ...quantityChange, subId: e.target.value })}
                        >
                            <option value="">Select</option>
                            {data.subscriptions.map((s) => (
                                <option key={s.id} value={s.id}>
                                    {s.subscriptionCode}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="text-xs text-gray-600">Product</label>
                        <select
                            className="input"
                            onChange={(e) => setQuantityChange({ ...quantityChange, productId: e.target.value })}
                        >
                            <option value="">Select</option>
                            {data.products.map((p) => (
                                <option key={p.id} value={p.id}>
                                    {p.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="text-xs text-gray-600">Qty</label>
                        <input
                            className="input"
                            type="number"
                            value={quantityChange.qty}
                            onChange={(e) => setQuantityChange({ ...quantityChange, qty: Number(e.target.value) })}
                        />
                    </div>
                    <button
                        className="btn btn-primary"
                        onClick={() =>
                            quantityChange.subId &&
                            quantityChange.productId &&
                            changeSubscriptionQuantity(quantityChange.subId, quantityChange.productId, quantityChange.qty)
                        }
                    >
                        Change qty (upsell/downsell)
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div className="card">
                    <h3 className="font-semibold mb-3">Provisioning Tasks (GWS/GCP)</h3>
                    <ul className="space-y-2 text-sm">
                        {data.provisioningTasks.map((task) => (
                            <li key={task.id} className="border rounded p-3">
                                <div className="font-semibold">{task.type}</div>
                                <div>Status: {task.status}</div>
                                <div className="text-xs text-gray-500">Sub: {task.subscriptionId}</div>
                                <button
                                    className="btn btn-secondary text-xs mt-2"
                                    onClick={() => advanceProvisioning(task.id, task.status === 'PENDING' ? 'RUNNING' : 'SUCCESS')}
                                >
                                    Advance status
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="card">
                    <h3 className="font-semibold mb-3">Webhook Events (Xendit mock)</h3>
                    <div className="space-y-2 text-sm">
                        {data.webhookEvents.map((ev) => (
                            <div key={ev.id} className="border rounded p-3">
                                <div className="font-semibold">{ev.eventType}</div>
                                <div className="text-xs text-gray-500">{formatDate(ev.receivedAt)}</div>
                                <pre className="text-xs bg-gray-50 p-2 rounded mt-1">{JSON.stringify(ev.payload)}</pre>
                            </div>
                        ))}
                        <button
                            className="btn btn-primary text-xs"
                            onClick={() => simulatePaymentWebhook(data.invoices[0]?.id, true)}
                        >
                            Simulate PAYMENT_SUCCEEDED
                        </button>
                        <button
                            className="btn btn-secondary text-xs"
                            onClick={() => simulatePaymentWebhook(data.invoices[0]?.id, false)}
                        >
                            Simulate PAYMENT_FAILED
                        </button>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

