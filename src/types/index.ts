// Domain models for subscription platform demo based on docs.md
// This file centralizes all entity definitions so the UI and fake repositories
// can reason about the lifecycle of quotations, invoices, subscriptions, payments,
// provisioning, and webhook simulations.

export type UserRole = 'SALES' | 'ADMIN' | 'CLIENT' | 'FINANCE' | 'SYSTEM';

export interface User {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    password: string; // In a production app passwords are hashed and stored securely.
    customerOrgId?: string; // Link CLIENT users to a customer organization.
}

export interface CustomerOrganization {
    id: string;
    name: string;
    npwp?: string;
    billingAddress?: string;
    industry?: string;
    size?: 'SMALL' | 'MID' | 'ENTERPRISE';
    contactEmail: string;
    contactPhone?: string;
    createdAt: string;
    updatedAt: string;
}

export interface ContactPerson {
    id: string;
    customerOrgId: string;
    name: string;
    email: string;
    phone?: string;
    role: 'IT_MANAGER' | 'FINANCE_CONTACT' | 'OWNER' | 'OTHER';
    isPrimary: boolean;
    createdAt: string;
    updatedAt: string;
}

export type ProductCategory =
    | 'GOOGLE_WORKSPACE'
    | 'GCP'
    | 'DOMAIN'
    | 'MANAGED_SERVICE'
    | 'ADDON';

export interface Product {
    id: string;
    code: string;
    name: string;
    category: ProductCategory;
    billingType: 'RECURRING' | 'ONE_TIME';
    billingPeriod: 'MONTHLY' | 'YEARLY' | 'ONE_TIME';
    basePrice: number;
    currency: string;
    isActive: boolean;
    metadataJson?: Record<string, unknown>;
    createdAt: string;
    updatedAt: string;
}

export interface PriceList {
    id: string;
    name: string;
    description?: string;
    validFrom?: string;
    validUntil?: string;
    createdAt: string;
    updatedAt: string;
}

export interface ProductPrice {
    id: string;
    priceListId: string;
    productId: string;
    price: number;
    currency: string;
    billingPeriodOverride?: 'MONTHLY' | 'YEARLY' | 'ONE_TIME';
    createdAt: string;
    updatedAt: string;
}

export type QuotationStatus = 'DRAFT' | 'SENT' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED';

export interface Quotation {
    id: string;
    quotationNumber: string;
    customerOrgId: string;
    contactPersonId: string;
    priceListId?: string;
    salesUserId: string;
    status: QuotationStatus;
    validUntil: string;
    notes?: string;
    pdfUrl?: string;
    cosmicId?: string;
    createdAt: string;
    updatedAt: string;
}

export interface QuotationItem {
    id: string;
    quotationId: string;
    productId: string;
    description?: string;
    quantity: number;
    unitPrice: number;
    discountAmount?: number;
    discountPercent?: number;
    subtotal: number;
    billingPeriod: 'MONTHLY' | 'YEARLY' | 'ONE_TIME';
    metadataJson?: Record<string, unknown>;
    createdAt: string;
    updatedAt: string;
}

export type SubscriptionStatus =
    | 'PENDING_ACTIVATION'
    | 'ACTIVE'
    | 'SUSPENDED'
    | 'CANCELLED';

export interface Subscription {
    id: string;
    subscriptionCode: string;
    customerOrgId: string;
    quotationId?: string;
    status: SubscriptionStatus;
    startDate: string;
    endDate?: string;
    billingPeriod: 'MONTHLY' | 'YEARLY';
    nextBillingDate: string;
    currency: string;
    notes?: string;
    createdAt: string;
    updatedAt: string;
}

export interface SubscriptionItem {
    id: string;
    subscriptionId: string;
    productId: string;
    quantity: number;
    unitPrice: number;
    billingPeriod: 'MONTHLY' | 'YEARLY' | 'ONE_TIME';
    metadataJson?: Record<string, unknown>;
}

export type InvoiceStatus = 'DRAFT' | 'PENDING' | 'PAID' | 'OVERDUE' | 'CANCELLED';

export interface Invoice {
    id: string;
    invoiceNumber: string;
    subscriptionId?: string;
    quotationId?: string;
    customerOrgId: string;
    status: InvoiceStatus;
    totalAmount: number;
    currency: string;
    dueDate: string;
    billingPeriodStart?: string;
    billingPeriodEnd?: string;
    createdAt: string;
    taxInvoiceUrl?: string;
    invoiceFileUrl?: string;
    paymentLink?: string;
}

export interface InvoiceItem {
    id: string;
    invoiceId: string;
    productId: string;
    description?: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
}

export type PaymentStatus = 'PENDING' | 'SUCCESS' | 'FAILED' | 'REFUNDED';

export interface Payment {
    id: string;
    invoiceId: string;
    amount: number;
    currency: string;
    paymentDate: string;
    paymentMethod: string;
    status: PaymentStatus;
    reference?: string;
}

export interface PaymentAttempt {
    id: string;
    invoiceId: string;
    subscriptionId?: string;
    status: PaymentStatus;
    attemptDate: string;
    failureReason?: string;
    channel: string;
}

export interface XenditCustomer {
    id: string;
    customerOrgId: string;
    email: string;
    referenceId: string;
    createdAt: string;
}

export interface XenditSubscription {
    id: string;
    xenditCustomerId: string;
    subscriptionId: string;
    status: 'ACTIVE' | 'PAUSED' | 'CANCELLED';
    lastChargeDate?: string;
    nextChargeDate?: string;
}

export interface ProvisioningTask {
    id: string;
    subscriptionId: string;
    productId: string;
    type: 'ACTIVATE' | 'SUSPEND' | 'TERMINATE' | 'CHANGE_QUANTITY';
    status: 'PENDING' | 'RUNNING' | 'SUCCESS' | 'FAILED';
    requestedAt: string;
    completedAt?: string;
    note?: string;
}

export interface WebhookEvent {
    id: string;
    source: 'XENDIT';
    eventType: 'PAYMENT_SUCCEEDED' | 'PAYMENT_FAILED' | 'SUBSCRIPTION_CHARGED';
    payload: Record<string, unknown>;
    receivedAt: string;
    processed: boolean;
}

export interface InvoiceRequest {
    id: string;
    quotationId: string;
    requestedAt: string;
    status: 'OPEN' | 'COMPLETED';
    note?: string;
}

export interface SentEmailLog {
    id: string;
    quotationId: string;
    to: string;
    subject: string;
    body: string;
    sentAt: string;
}

export interface ReportsSnapshot {
    revenueByProduct: { productName: string; total: number }[];
    overdueInvoices: Invoice[];
    subscriptionCounts: { status: SubscriptionStatus; count: number }[];
    riskyCustomers: { customerOrgId: string; failures: number }[];
}

export interface DemoDataSnapshot {
    customers: CustomerOrganization[];
    contacts: ContactPerson[];
    products: Product[];
    priceLists: PriceList[];
    productPrices: ProductPrice[];
    quotations: Quotation[];
    quotationItems: QuotationItem[];
    subscriptions: Subscription[];
    subscriptionItems: SubscriptionItem[];
    invoices: Invoice[];
    invoiceItems: InvoiceItem[];
    payments: Payment[];
    paymentAttempts: PaymentAttempt[];
    xenditCustomers: XenditCustomer[];
    xenditSubscriptions: XenditSubscription[];
    provisioningTasks: ProvisioningTask[];
    webhookEvents: WebhookEvent[];
    invoiceRequests: InvoiceRequest[];
    sentEmails: SentEmailLog[];
}

export type Currency = 'IDR' | 'USD';

