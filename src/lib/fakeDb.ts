import {
    CustomerOrganization,
    ContactPerson,
    DemoDataSnapshot,
    Invoice,
    InvoiceItem,
    InvoiceRequest,
    Payment,
    PaymentAttempt,
    PriceList,
    Product,
    ProductPrice,
    ProvisioningTask,
    Quotation,
    QuotationItem,
    SentEmailLog,
    Subscription,
    SubscriptionItem,
    WebhookEvent,
    XenditCustomer,
    XenditSubscription,
} from '@/types';

// Simple in-memory data store with subscription support for UI updates

const today = new Date();

function uid(prefix: string) {
    return `${prefix}-${Math.random().toString(36).slice(2, 8)}-${Date.now().toString(36)}`;
}

function addDays(date: Date, days: number) {
    const next = new Date(date);
    next.setDate(next.getDate() + days);
    return next.toISOString();
}

const nowIso = today.toISOString();

// seed data
const data: DemoDataSnapshot = {
    customers: [
        {
            id: 'cust-1',
            name: 'PT Teknologi Maju',
            npwp: '01.234.567.8-999.000',
            billingAddress: 'Jl. Sudirman No. 1 Jakarta',
            industry: 'Technology',
            size: 'MID',
            contactEmail: 'billing@teknologimaju.co.id',
            contactPhone: '+62-21-12345678',
            createdAt: nowIso,
            updatedAt: nowIso,
        },
        {
            id: 'cust-2',
            name: 'CV Digital Indonesia',
            billingAddress: 'Jl. Mangga No. 8 Bandung',
            industry: 'Services',
            size: 'SMALL',
            contactEmail: 'finance@digitalindonesia.com',
            contactPhone: '+62-22-9876543',
            createdAt: nowIso,
            updatedAt: nowIso,
        },
    ],
    contacts: [
        {
            id: 'contact-1',
            customerOrgId: 'cust-1',
            name: 'Arif Rahman',
            email: 'it@teknologimaju.co.id',
            role: 'IT_MANAGER',
            isPrimary: true,
            createdAt: nowIso,
            updatedAt: nowIso,
        },
        {
            id: 'contact-2',
            customerOrgId: 'cust-1',
            name: 'Siti Finance',
            email: 'finance@teknologimaju.co.id',
            role: 'FINANCE_CONTACT',
            isPrimary: false,
            createdAt: nowIso,
            updatedAt: nowIso,
        },
        {
            id: 'contact-3',
            customerOrgId: 'cust-2',
            name: 'Budi Owner',
            email: 'owner@digitalindonesia.com',
            role: 'OWNER',
            isPrimary: true,
            createdAt: nowIso,
            updatedAt: nowIso,
        },
    ],
    products: [
        {
            id: 'prod-1',
            code: 'GWS_BUSINESS_STARTER',
            name: 'Google Workspace Business Starter',
            category: 'GOOGLE_WORKSPACE',
            billingType: 'RECURRING',
            billingPeriod: 'MONTHLY',
            basePrice: 72000,
            currency: 'IDR',
            isActive: true,
            createdAt: nowIso,
            updatedAt: nowIso,
        },
        {
            id: 'prod-2',
            code: 'GWS_BUSINESS_STANDARD',
            name: 'Google Workspace Business Standard',
            category: 'GOOGLE_WORKSPACE',
            billingType: 'RECURRING',
            billingPeriod: 'MONTHLY',
            basePrice: 144000,
            currency: 'IDR',
            isActive: true,
            createdAt: nowIso,
            updatedAt: nowIso,
        },
        {
            id: 'prod-3',
            code: 'GCP_COMPUTE',
            name: 'Google Cloud Platform - Compute Engine',
            category: 'GCP',
            billingType: 'RECURRING',
            billingPeriod: 'MONTHLY',
            basePrice: 5000000,
            currency: 'IDR',
            isActive: true,
            createdAt: nowIso,
            updatedAt: nowIso,
        },
        {
            id: 'prod-4',
            code: 'DOMAIN_COM',
            name: 'Domain Registration (.com)',
            category: 'DOMAIN',
            billingType: 'RECURRING',
            billingPeriod: 'YEARLY',
            basePrice: 180000,
            currency: 'IDR',
            isActive: true,
            createdAt: nowIso,
            updatedAt: nowIso,
        },
        {
            id: 'prod-5',
            code: 'MANAGED_SERVICE',
            name: 'Managed Service Fee',
            category: 'MANAGED_SERVICE',
            billingType: 'RECURRING',
            billingPeriod: 'MONTHLY',
            basePrice: 2500000,
            currency: 'IDR',
            isActive: true,
            createdAt: nowIso,
            updatedAt: nowIso,
        },
    ],
    priceLists: [
        {
            id: 'pl-1',
            name: 'Default 2025',
            description: 'Harga standar',
            createdAt: nowIso,
            updatedAt: nowIso,
        },
    ],
    productPrices: [
        {
            id: 'pp-1',
            priceListId: 'pl-1',
            productId: 'prod-1',
            price: 72000,
            currency: 'IDR',
            createdAt: nowIso,
            updatedAt: nowIso,
        },
        {
            id: 'pp-2',
            priceListId: 'pl-1',
            productId: 'prod-2',
            price: 144000,
            currency: 'IDR',
            createdAt: nowIso,
            updatedAt: nowIso,
        },
    ],
    quotations: [
        {
            id: 'quot-1',
            quotationNumber: 'Q-2025-00123',
            customerOrgId: 'cust-1',
            contactPersonId: 'contact-1',
            priceListId: 'pl-1',
            salesUserId: '1',
            status: 'SENT',
            validUntil: addDays(today, 30),
            notes: 'Penawaran paket workspace',
            createdAt: nowIso,
            updatedAt: nowIso,
        },
        {
            id: 'quot-2',
            quotationNumber: 'Q-2025-00124',
            customerOrgId: 'cust-2',
            contactPersonId: 'contact-3',
            priceListId: 'pl-1',
            salesUserId: '1',
            status: 'ACCEPTED',
            validUntil: addDays(today, 20),
            notes: 'Starter plan',
            createdAt: nowIso,
            updatedAt: nowIso,
        },
    ],
    quotationItems: [
        {
            id: 'qi-1',
            quotationId: 'quot-1',
            productId: 'prod-2',
            description: '50 user Business Standard',
            quantity: 50,
            unitPrice: 144000,
            subtotal: 7200000,
            billingPeriod: 'MONTHLY',
            createdAt: nowIso,
            updatedAt: nowIso,
        },
        {
            id: 'qi-2',
            quotationId: 'quot-1',
            productId: 'prod-5',
            description: 'Managed service',
            quantity: 1,
            unitPrice: 2500000,
            subtotal: 2500000,
            billingPeriod: 'MONTHLY',
            createdAt: nowIso,
            updatedAt: nowIso,
        },
        {
            id: 'qi-3',
            quotationId: 'quot-2',
            productId: 'prod-1',
            description: '25 user Starter',
            quantity: 25,
            unitPrice: 72000,
            subtotal: 1800000,
            billingPeriod: 'MONTHLY',
            createdAt: nowIso,
            updatedAt: nowIso,
        },
    ],
    subscriptions: [
        {
            id: 'sub-1',
            subscriptionCode: 'SUB-2025-001',
            customerOrgId: 'cust-1',
            quotationId: 'quot-1',
            status: 'ACTIVE',
            startDate: addDays(today, -60),
            billingPeriod: 'MONTHLY',
            nextBillingDate: addDays(today, 5),
            currency: 'IDR',
            createdAt: nowIso,
            updatedAt: nowIso,
        },
        {
            id: 'sub-2',
            subscriptionCode: 'SUB-2025-002',
            customerOrgId: 'cust-2',
            quotationId: 'quot-2',
            status: 'SUSPENDED',
            startDate: addDays(today, -90),
            billingPeriod: 'MONTHLY',
            nextBillingDate: addDays(today, -1),
            currency: 'IDR',
            createdAt: nowIso,
            updatedAt: nowIso,
        },
    ],
    subscriptionItems: [
        {
            id: 'si-1',
            subscriptionId: 'sub-1',
            productId: 'prod-2',
            quantity: 50,
            unitPrice: 144000,
            billingPeriod: 'MONTHLY',
        },
        {
            id: 'si-2',
            subscriptionId: 'sub-1',
            productId: 'prod-5',
            quantity: 1,
            unitPrice: 2500000,
            billingPeriod: 'MONTHLY',
        },
        {
            id: 'si-3',
            subscriptionId: 'sub-2',
            productId: 'prod-1',
            quantity: 25,
            unitPrice: 72000,
            billingPeriod: 'MONTHLY',
        },
    ],
    invoices: [
        {
            id: 'inv-1',
            invoiceNumber: 'INV-2025-000345',
            subscriptionId: 'sub-1',
            quotationId: 'quot-1',
            customerOrgId: 'cust-1',
            status: 'PAID',
            totalAmount: 9700000,
            currency: 'IDR',
            dueDate: addDays(today, -20),
            billingPeriodStart: addDays(today, -30),
            billingPeriodEnd: addDays(today, 0),
            createdAt: nowIso,
            invoiceFileUrl: 'https://example.com/invoice345.pdf',
            taxInvoiceUrl: 'https://example.com/tax345.pdf',
        },
        {
            id: 'inv-2',
            invoiceNumber: 'INV-2025-000346',
            subscriptionId: 'sub-2',
            quotationId: 'quot-2',
            customerOrgId: 'cust-2',
            status: 'OVERDUE',
            totalAmount: 1800000,
            currency: 'IDR',
            dueDate: addDays(today, -10),
            billingPeriodStart: addDays(today, -30),
            billingPeriodEnd: addDays(today, 0),
            createdAt: nowIso,
        },
    ],
    invoiceItems: [
        {
            id: 'ii-1',
            invoiceId: 'inv-1',
            productId: 'prod-2',
            description: '50 user Business Standard',
            quantity: 50,
            unitPrice: 144000,
            subtotal: 7200000,
        },
        {
            id: 'ii-2',
            invoiceId: 'inv-1',
            productId: 'prod-5',
            description: 'Managed service',
            quantity: 1,
            unitPrice: 2500000,
            subtotal: 2500000,
        },
        {
            id: 'ii-3',
            invoiceId: 'inv-2',
            productId: 'prod-1',
            description: '25 user starter',
            quantity: 25,
            unitPrice: 72000,
            subtotal: 1800000,
        },
    ],
    payments: [
        {
            id: 'pay-1',
            invoiceId: 'inv-1',
            amount: 9700000,
            currency: 'IDR',
            paymentDate: addDays(today, -18),
            paymentMethod: 'Virtual Account BCA',
            status: 'SUCCESS',
            reference: 'XENDIT-VA-123',
        },
    ],
    paymentAttempts: [
        {
            id: 'pat-1',
            invoiceId: 'inv-2',
            subscriptionId: 'sub-2',
            status: 'FAILED',
            attemptDate: addDays(today, -9),
            failureReason: 'Insufficient funds',
            channel: 'CARD',
        },
    ],
    xenditCustomers: [
        {
            id: 'xcust-1',
            customerOrgId: 'cust-1',
            email: 'billing@teknologimaju.co.id',
            referenceId: 'X-CUST-001',
            createdAt: nowIso,
        },
    ],
    xenditSubscriptions: [
        {
            id: 'xsub-1',
            xenditCustomerId: 'xcust-1',
            subscriptionId: 'sub-1',
            status: 'ACTIVE',
            lastChargeDate: addDays(today, -30),
            nextChargeDate: addDays(today, 5),
        },
    ],
    provisioningTasks: [
        {
            id: 'prov-1',
            subscriptionId: 'sub-1',
            productId: 'prod-2',
            type: 'ACTIVATE',
            status: 'SUCCESS',
            requestedAt: addDays(today, -60),
            completedAt: addDays(today, -59),
            note: 'Google Workspace activated',
        },
        {
            id: 'prov-2',
            subscriptionId: 'sub-2',
            productId: 'prod-1',
            type: 'SUSPEND',
            status: 'PENDING',
            requestedAt: addDays(today, -1),
            note: 'Suspend due to overdue invoice',
        },
    ],
    webhookEvents: [
        {
            id: 'wh-1',
            source: 'XENDIT',
            eventType: 'PAYMENT_FAILED',
            payload: { invoiceId: 'inv-2', reason: 'Insufficient funds' },
            receivedAt: addDays(today, -9),
            processed: true,
        },
    ],
    invoiceRequests: [
        {
            id: 'req-1',
            quotationId: 'quot-2',
            requestedAt: addDays(today, -2),
            status: 'OPEN',
            note: 'Quotation accepted by client',
        },
    ],
    sentEmails: [],
};

const listeners = new Set<(snapshot: DemoDataSnapshot) => void>();

function emit() {
    const snapshot = getSnapshot();
    listeners.forEach((l) => l(snapshot));
}

export function subscribe(listener: (snapshot: DemoDataSnapshot) => void): () => void {
    listeners.add(listener);
    return () => {
        listeners.delete(listener);
    };
}

export function getSnapshot(): DemoDataSnapshot {
    return JSON.parse(JSON.stringify(data));
}

export function formatCurrency(amount: number, currency: string = 'IDR') {
    if (currency === 'IDR') {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    }
    return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
}

export function formatDate(dateString: string) {
    return new Intl.DateTimeFormat('id-ID', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    }).format(new Date(dateString));
}

// CRUD-style helpers and workflow simulators
export function addQuotation(payload: {
    customerOrgId: string;
    contactPersonId: string;
    salesUserId: string;
    items: { productId: string; quantity: number; unitPrice: number; billingPeriod: 'MONTHLY' | 'YEARLY' | 'ONE_TIME' }[];
    notes?: string;
}) {
    const quotationId = uid('quot');
    const quotation: Quotation = {
        id: quotationId,
        quotationNumber: `Q-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)}`,
        customerOrgId: payload.customerOrgId,
        contactPersonId: payload.contactPersonId,
        priceListId: 'pl-1',
        salesUserId: payload.salesUserId,
        status: 'DRAFT',
        validUntil: addDays(today, 30),
        notes: payload.notes,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
    data.quotations.push(quotation);
    payload.items.forEach((item) => {
        data.quotationItems.push({
            id: uid('qi'),
            quotationId,
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            subtotal: item.quantity * item.unitPrice,
            billingPeriod: item.billingPeriod,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        });
    });
    emit();
    return quotation;
}

export function generateQuotationPdf(quotationId: string) {
    const quotation = data.quotations.find((q) => q.id === quotationId);
    if (!quotation) return;
    quotation.pdfUrl = `https://storage.mock/quotation/${quotationId}.pdf`;
    quotation.cosmicId = `cosmic-${quotationId}`;
    quotation.updatedAt = new Date().toISOString();
    emit();
}

export function sendQuotationEmail(quotationId: string) {
    const quotation = data.quotations.find((q) => q.id === quotationId);
    if (!quotation) return;
    const contact = data.contacts.find((c) => c.id === quotation.contactPersonId);
    const log: SentEmailLog = {
        id: uid('email'),
        quotationId,
        to: contact?.email || 'unknown',
        subject: `Penawaran ${quotation.quotationNumber}`,
        body: quotation.notes || 'Penawaran terbaru',
        sentAt: new Date().toISOString(),
    };
    data.sentEmails.push(log);
    quotation.status = 'SENT';
    quotation.updatedAt = new Date().toISOString();
    emit();
}

export function acceptQuotation(quotationId: string) {
    const quotation = data.quotations.find((q) => q.id === quotationId);
    if (!quotation) return;
    quotation.status = 'ACCEPTED';
    quotation.updatedAt = new Date().toISOString();
    data.invoiceRequests.push({
        id: uid('req'),
        quotationId,
        requestedAt: new Date().toISOString(),
        status: 'OPEN',
        note: 'Sales menandai quotation accepted',
    });
    emit();
}

function calculateInvoiceTotal(items: InvoiceItem[]) {
    return items.reduce((sum, item) => sum + item.subtotal, 0);
}

export function createInvoiceFromQuotation(quotationId: string) {
    const quotation = data.quotations.find((q) => q.id === quotationId);
    if (!quotation) return;
    const items = data.quotationItems.filter((qi) => qi.quotationId === quotationId);
    const invoiceId = uid('inv');
    const invoiceItems: InvoiceItem[] = items.map((item) => ({
        id: uid('ii'),
        invoiceId,
        productId: item.productId,
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        subtotal: item.subtotal,
    }));
    data.invoiceItems.push(...invoiceItems);
    const invoice: Invoice = {
        id: invoiceId,
        invoiceNumber: `INV-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)}`,
        subscriptionId: undefined,
        quotationId,
        customerOrgId: quotation.customerOrgId,
        status: 'PENDING',
        totalAmount: calculateInvoiceTotal(invoiceItems),
        currency: 'IDR',
        dueDate: addDays(today, 14),
        createdAt: new Date().toISOString(),
    };
    data.invoices.push(invoice);
    const req = data.invoiceRequests.find((r) => r.quotationId === quotationId);
    if (req) req.status = 'COMPLETED';
    emit();
    return invoice;
}

export function uploadInvoiceFiles(invoiceId: string) {
    const invoice = data.invoices.find((i) => i.id === invoiceId);
    if (!invoice) return;
    invoice.invoiceFileUrl = `https://storage.mock/invoices/${invoiceId}.pdf`;
    invoice.taxInvoiceUrl = `https://storage.mock/tax/${invoiceId}.pdf`;
    emit();
}

export function attachPaymentLink(invoiceId: string, link: string) {
    const invoice = data.invoices.find((i) => i.id === invoiceId);
    if (!invoice) return;
    invoice.paymentLink = link;
    emit();
}

export function recordPaymentAttempt(invoiceId: string, channel: string, success: boolean, subscriptionId?: string) {
    const attempt: PaymentAttempt = {
        id: uid('pat'),
        invoiceId,
        subscriptionId,
        status: success ? 'SUCCESS' : 'FAILED',
        attemptDate: new Date().toISOString(),
        failureReason: success ? undefined : 'Simulated failure',
        channel,
    };
    data.paymentAttempts.push(attempt);
    emit();
    return attempt;
}

export function simulatePaymentWebhook(invoiceId: string, success: boolean) {
    const invoice = data.invoices.find((i) => i.id === invoiceId);
    if (!invoice) return;
    const event: WebhookEvent = {
        id: uid('wh'),
        source: 'XENDIT',
        eventType: success ? 'PAYMENT_SUCCEEDED' : 'PAYMENT_FAILED',
        payload: { invoiceId },
        receivedAt: new Date().toISOString(),
        processed: true,
    };
    data.webhookEvents.push(event);
    const attempt = recordPaymentAttempt(invoiceId, 'MOCK_WEBHOOK', success, invoice.subscriptionId);
    if (success) {
        invoice.status = 'PAID';
        data.payments.push({
            id: uid('pay'),
            invoiceId,
            amount: invoice.totalAmount,
            currency: invoice.currency,
            paymentDate: new Date().toISOString(),
            paymentMethod: 'Xendit Payment Link',
            status: 'SUCCESS',
            reference: attempt.id,
        });
        if (!invoice.subscriptionId) {
            createSubscriptionFromQuotation(invoice.quotationId, invoiceId);
        }
    } else {
        invoice.status = 'OVERDUE';
    }
    emit();
}

export function createSubscriptionFromQuotation(quotationId?: string, invoiceId?: string) {
    if (!quotationId) return;
    const quotation = data.quotations.find((q) => q.id === quotationId);
    if (!quotation) return;
    const subscriptionId = uid('sub');
    const subscription: Subscription = {
        id: subscriptionId,
        subscriptionCode: `SUB-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)}`,
        customerOrgId: quotation.customerOrgId,
        quotationId,
        status: 'PENDING_ACTIVATION',
        startDate: new Date().toISOString(),
        billingPeriod: 'MONTHLY',
        nextBillingDate: addDays(today, 30),
        currency: 'IDR',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
    data.subscriptions.push(subscription);
    const items = data.quotationItems.filter((qi) => qi.quotationId === quotationId);
    items.forEach((item) => {
        data.subscriptionItems.push({
            id: uid('si'),
            subscriptionId,
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            billingPeriod: item.billingPeriod,
        });
        data.provisioningTasks.push({
            id: uid('prov'),
            subscriptionId,
            productId: item.productId,
            type: 'ACTIVATE',
            status: 'PENDING',
            requestedAt: new Date().toISOString(),
        });
    });
    if (invoiceId) {
        const invoice = data.invoices.find((inv) => inv.id === invoiceId);
        if (invoice) invoice.subscriptionId = subscriptionId;
    }
    emit();
    return subscription;
}

export function advanceProvisioning(taskId: string, status: ProvisioningTask['status']) {
    const task = data.provisioningTasks.find((t) => t.id === taskId);
    if (!task) return;
    task.status = status;
    if (status === 'SUCCESS' || status === 'FAILED') {
        task.completedAt = new Date().toISOString();
    }
    emit();
}

export function updateSubscriptionStatus(subscriptionId: string, status: Subscription['status']) {
    const sub = data.subscriptions.find((s) => s.id === subscriptionId);
    if (!sub) return;
    sub.status = status;
    sub.updatedAt = new Date().toISOString();
    if (status === 'CANCELLED') {
        sub.endDate = new Date().toISOString();
        data.provisioningTasks.push({
            id: uid('prov'),
            subscriptionId,
            productId: data.subscriptionItems.find((i) => i.subscriptionId === subscriptionId)?.productId || 'unknown',
            type: 'TERMINATE',
            status: 'PENDING',
            requestedAt: new Date().toISOString(),
            note: 'Termination after cancellation',
        });
    }
    emit();
}

export function changeSubscriptionQuantity(subscriptionId: string, productId: string, quantity: number) {
    const item = data.subscriptionItems.find((si) => si.subscriptionId === subscriptionId && si.productId === productId);
    if (!item) return;
    item.quantity = quantity;
    data.provisioningTasks.push({
        id: uid('prov'),
        subscriptionId,
        productId,
        type: 'CHANGE_QUANTITY',
        status: 'RUNNING',
        requestedAt: new Date().toISOString(),
        note: `Change quantity to ${quantity}`,
    });
    emit();
}

export function runRecurringBillingCron() {
    const now = new Date();
    data.subscriptions
        .filter((s) => s.status === 'ACTIVE' && new Date(s.nextBillingDate) <= now)
        .forEach((sub) => {
            const invoiceId = uid('inv');
            const items = data.subscriptionItems.filter((i) => i.subscriptionId === sub.id);
            const invoiceItems: InvoiceItem[] = items.map((item) => ({
                id: uid('ii'),
                invoiceId,
                productId: item.productId,
                description: 'Recurring charge',
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                subtotal: item.quantity * item.unitPrice,
            }));
            data.invoiceItems.push(...invoiceItems);
            const invoice: Invoice = {
                id: invoiceId,
                invoiceNumber: `INV-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)}`,
                subscriptionId: sub.id,
                customerOrgId: sub.customerOrgId,
                status: 'PENDING',
                totalAmount: calculateInvoiceTotal(invoiceItems),
                currency: 'IDR',
                dueDate: addDays(now, 14),
                billingPeriodStart: now.toISOString(),
                billingPeriodEnd: addDays(now, 30),
                createdAt: now.toISOString(),
            };
            data.invoices.push(invoice);
            recordPaymentAttempt(invoiceId, 'AUTO_RECURRING', true, sub.id);
            data.webhookEvents.push({
                id: uid('wh'),
                source: 'XENDIT',
                eventType: 'SUBSCRIPTION_CHARGED',
                payload: { invoiceId, subscriptionId: sub.id },
                receivedAt: now.toISOString(),
                processed: true,
            });
            sub.nextBillingDate = addDays(now, 30);
        });
    emit();
}

export function runDunningProcess() {
    const failedBySubscription: Record<string, number> = {};
    data.paymentAttempts
        .filter((p) => p.status === 'FAILED')
        .forEach((p) => {
            if (p.subscriptionId) {
                failedBySubscription[p.subscriptionId] = (failedBySubscription[p.subscriptionId] || 0) + 1;
            }
        });
    Object.entries(failedBySubscription).forEach(([subscriptionId, failures]) => {
        if (failures >= 2) {
            updateSubscriptionStatus(subscriptionId, 'SUSPENDED');
            const relatedItems = data.subscriptionItems.filter((i) => i.subscriptionId === subscriptionId);
            relatedItems.forEach((item) => {
    data.provisioningTasks.push({
        id: uid('prov'),
                    subscriptionId,
                    productId: item.productId,
                    type: 'SUSPEND',
                    status: 'PENDING',
                    requestedAt: new Date().toISOString(),
                    note: 'Auto-suspend after dunning',
                });
            });
        }
    });
    emit();
}

export function refundPayment(paymentId: string) {
    const payment = data.payments.find((p) => p.id === paymentId);
    if (!payment) return;
    payment.status = 'REFUNDED';
    emit();
}

export function getReports(): {
    revenueByProduct: { productName: string; total: number }[];
    overdueInvoices: Invoice[];
    subscriptionCounts: { status: string; count: number }[];
    riskyCustomers: { customerOrgId: string; failures: number }[];
} {
    const productTotals: Record<string, number> = {};
    data.invoiceItems.forEach((item) => {
        const invoice = data.invoices.find((inv) => inv.id === item.invoiceId);
        if (invoice?.status === 'PAID') {
            productTotals[item.productId] = (productTotals[item.productId] || 0) + item.subtotal;
        }
    });
    const revenueByProduct = Object.entries(productTotals).map(([productId, total]) => ({
        productName: data.products.find((p) => p.id === productId)?.name || productId,
        total,
    }));
    const overdueInvoices = data.invoices.filter((i) => i.status === 'OVERDUE');
    const subscriptionCounts = ['PENDING_ACTIVATION', 'ACTIVE', 'SUSPENDED', 'CANCELLED'].map((status) => ({
        status,
        count: data.subscriptions.filter((s) => s.status === status).length,
    }));
    const failedByCustomer: Record<string, number> = {};
    data.paymentAttempts
        .filter((p) => p.status === 'FAILED')
        .forEach((p) => {
            const invoice = data.invoices.find((i) => i.id === p.invoiceId);
            if (invoice) {
                failedByCustomer[invoice.customerOrgId] = (failedByCustomer[invoice.customerOrgId] || 0) + 1;
            }
        });
    const riskyCustomers = Object.entries(failedByCustomer).map(([customerOrgId, failures]) => ({
        customerOrgId,
        failures,
    }));
    return { revenueByProduct, overdueInvoices, subscriptionCounts, riskyCustomers };
}

