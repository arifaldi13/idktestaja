// TypeScript type definitions for the subscription platform demo

export type UserRole = 'SALES' | 'ADMIN' | 'CLIENT' | 'FINANCE';

export interface User {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    password: string; // In real app, this would be hashed
}

export type QuotationStatus = 'DRAFT' | 'SENT' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED';

export interface Quotation {
    id: string;
    quotationNumber: string;
    customerName: string;
    contactEmail: string;
    status: QuotationStatus;
    totalAmount: number;
    currency: string;
    validUntil: string;
    createdAt: string;
    items: QuotationItem[];
}

export interface QuotationItem {
    id: string;
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
}

export type SubscriptionStatus = 'ACTIVE' | 'SUSPENDED' | 'CANCELLED' | 'PENDING_ACTIVATION';

export interface Subscription {
    id: string;
    subscriptionCode: string;
    customerName: string;
    status: SubscriptionStatus;
    startDate: string;
    billingPeriod: 'MONTHLY' | 'YEARLY';
    nextBillingDate: string;
    totalAmount: number;
    currency: string;
    items: SubscriptionItem[];
}

export interface SubscriptionItem {
    id: string;
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
}

export type InvoiceStatus = 'DRAFT' | 'PENDING' | 'PAID' | 'OVERDUE' | 'CANCELLED';

export interface Invoice {
    id: string;
    invoiceNumber: string;
    customerName: string;
    subscriptionId: string;
    status: InvoiceStatus;
    totalAmount: number;
    currency: string;
    dueDate: string;
    billingPeriodStart: string;
    billingPeriodEnd: string;
    createdAt: string;
}

export type PaymentStatus = 'PENDING' | 'SUCCESS' | 'FAILED' | 'REFUNDED';

export interface Payment {
    id: string;
    invoiceId: string;
    invoiceNumber: string;
    customerName: string;
    amount: number;
    currency: string;
    paymentDate: string;
    paymentMethod: string;
    status: PaymentStatus;
}

export type ProductCategory = 'GOOGLE_WORKSPACE' | 'GCP' | 'DOMAIN' | 'MANAGED_SERVICE' | 'ADDON';

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
}
