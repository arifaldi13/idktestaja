// Mock data for demonstration purposes
// In a production app, this would come from a database

import {
    Product,
    Quotation,
    Subscription,
    Invoice,
    Payment,
} from '@/types';

/**
 * MOCK PRODUCTS
 * Based on docs.md: Google Workspace, GCP, Domain, Managed Services
 */
export const MOCK_PRODUCTS: Product[] = [
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
    },
    {
        id: 'prod-3',
        code: 'GWS_BUSINESS_PLUS',
        name: 'Google Workspace Business Plus',
        category: 'GOOGLE_WORKSPACE',
        billingType: 'RECURRING',
        billingPeriod: 'MONTHLY',
        basePrice: 216000,
        currency: 'IDR',
        isActive: true,
    },
    {
        id: 'prod-4',
        code: 'GCP_COMPUTE',
        name: 'Google Cloud Platform - Compute Engine',
        category: 'GCP',
        billingType: 'RECURRING',
        billingPeriod: 'MONTHLY',
        basePrice: 5000000,
        currency: 'IDR',
        isActive: true,
    },
    {
        id: 'prod-5',
        code: 'DOMAIN_COM',
        name: 'Domain Registration (.com)',
        category: 'DOMAIN',
        billingType: 'RECURRING',
        billingPeriod: 'YEARLY',
        basePrice: 180000,
        currency: 'IDR',
        isActive: true,
    },
    {
        id: 'prod-6',
        code: 'MANAGED_SERVICE',
        name: 'Managed Service Fee',
        category: 'MANAGED_SERVICE',
        billingType: 'RECURRING',
        billingPeriod: 'MONTHLY',
        basePrice: 2500000,
        currency: 'IDR',
        isActive: true,
    },
];

/**
 * MOCK QUOTATIONS
 * For SALES dashboard
 */
export const MOCK_QUOTATIONS: Quotation[] = [
    {
        id: 'quot-1',
        quotationNumber: 'Q-2025-00123',
        customerName: 'PT Teknologi Maju',
        contactEmail: 'it@teknologimaju.co.id',
        status: 'SENT',
        totalAmount: 10800000,
        currency: 'IDR',
        validUntil: '2025-12-31',
        createdAt: '2025-11-15',
        items: [
            {
                id: 'qi-1',
                productId: 'prod-2',
                productName: 'Google Workspace Business Standard',
                quantity: 50,
                unitPrice: 144000,
                subtotal: 7200000,
            },
            {
                id: 'qi-2',
                productId: 'prod-5',
                productName: 'Domain Registration (.com)',
                quantity: 2,
                unitPrice: 180000,
                subtotal: 360000,
            },
            {
                id: 'qi-3',
                productId: 'prod-6',
                productName: 'Managed Service Fee',
                quantity: 1,
                unitPrice: 2500000,
                subtotal: 2500000,
            },
        ],
    },
    {
        id: 'quot-2',
        quotationNumber: 'Q-2025-00124',
        customerName: 'CV Digital Indonesia',
        contactEmail: 'admin@digitalindonesia.com',
        status: 'ACCEPTED',
        totalAmount: 3600000,
        currency: 'IDR',
        validUntil: '2025-12-20',
        createdAt: '2025-11-20',
        items: [
            {
                id: 'qi-4',
                productId: 'prod-1',
                productName: 'Google Workspace Business Starter',
                quantity: 25,
                unitPrice: 72000,
                subtotal: 1800000,
            },
        ],
    },
    {
        id: 'quot-3',
        quotationNumber: 'Q-2025-00125',
        customerName: 'PT Solusi Bisnis',
        contactEmail: 'procurement@solusibisnis.id',
        status: 'DRAFT',
        totalAmount: 15800000,
        currency: 'IDR',
        validUntil: '2026-01-15',
        createdAt: '2025-12-01',
        items: [
            {
                id: 'qi-5',
                productId: 'prod-3',
                productName: 'Google Workspace Business Plus',
                quantity: 30,
                unitPrice: 216000,
                subtotal: 6480000,
            },
            {
                id: 'qi-6',
                productId: 'prod-4',
                productName: 'Google Cloud Platform - Compute Engine',
                quantity: 1,
                unitPrice: 5000000,
                subtotal: 5000000,
            },
        ],
    },
    {
        id: 'quot-4',
        quotationNumber: 'Q-2025-00122',
        customerName: 'PT Nusantara Tech',
        contactEmail: 'contact@nusantaratech.co.id',
        status: 'REJECTED',
        totalAmount: 8640000,
        currency: 'IDR',
        validUntil: '2025-11-30',
        createdAt: '2025-11-10',
        items: [],
    },
];

/**
 * MOCK SUBSCRIPTIONS
 * For ADMIN and CLIENT dashboards
 */
export const MOCK_SUBSCRIPTIONS: Subscription[] = [
    {
        id: 'sub-1',
        subscriptionCode: 'SUB-2025-001',
        customerName: 'PT Teknologi Maju',
        status: 'ACTIVE',
        startDate: '2025-01-01',
        billingPeriod: 'MONTHLY',
        nextBillingDate: '2026-01-01',
        totalAmount: 10800000,
        currency: 'IDR',
        items: [
            {
                id: 'si-1',
                productId: 'prod-2',
                productName: 'Google Workspace Business Standard',
                quantity: 50,
                unitPrice: 144000,
            },
            {
                id: 'si-2',
                productId: 'prod-6',
                productName: 'Managed Service Fee',
                quantity: 1,
                unitPrice: 2500000,
            },
        ],
    },
    {
        id: 'sub-2',
        subscriptionCode: 'SUB-2025-002',
        customerName: 'CV Digital Indonesia',
        status: 'ACTIVE',
        startDate: '2025-02-01',
        billingPeriod: 'MONTHLY',
        nextBillingDate: '2026-02-01',
        totalAmount: 1800000,
        currency: 'IDR',
        items: [
            {
                id: 'si-3',
                productId: 'prod-1',
                productName: 'Google Workspace Business Starter',
                quantity: 25,
                unitPrice: 72000,
            },
        ],
    },
    {
        id: 'sub-3',
        subscriptionCode: 'SUB-2024-015',
        customerName: 'PT Inovasi Digital',
        status: 'SUSPENDED',
        startDate: '2024-06-01',
        billingPeriod: 'MONTHLY',
        nextBillingDate: '2025-12-01',
        totalAmount: 4320000,
        currency: 'IDR',
        items: [
            {
                id: 'si-4',
                productId: 'prod-2',
                productName: 'Google Workspace Business Standard',
                quantity: 30,
                unitPrice: 144000,
            },
        ],
    },
    {
        id: 'sub-4',
        subscriptionCode: 'SUB-2024-008',
        customerName: 'PT Global Solutions',
        status: 'CANCELLED',
        startDate: '2024-03-01',
        billingPeriod: 'YEARLY',
        nextBillingDate: '2025-03-01',
        totalAmount: 12960000,
        currency: 'IDR',
        items: [
            {
                id: 'si-5',
                productId: 'prod-3',
                productName: 'Google Workspace Business Plus',
                quantity: 60,
                unitPrice: 216000,
            },
        ],
    },
];

/**
 * MOCK INVOICES
 * For FINANCE and CLIENT dashboards
 */
export const MOCK_INVOICES: Invoice[] = [
    {
        id: 'inv-1',
        invoiceNumber: 'INV-2025-000345',
        customerName: 'PT Teknologi Maju',
        subscriptionId: 'sub-1',
        status: 'PAID',
        totalAmount: 10800000,
        currency: 'IDR',
        dueDate: '2025-12-15',
        billingPeriodStart: '2025-12-01',
        billingPeriodEnd: '2025-12-31',
        createdAt: '2025-12-01',
    },
    {
        id: 'inv-2',
        invoiceNumber: 'INV-2025-000346',
        customerName: 'CV Digital Indonesia',
        subscriptionId: 'sub-2',
        status: 'PAID',
        totalAmount: 1800000,
        currency: 'IDR',
        dueDate: '2025-12-15',
        billingPeriodStart: '2025-12-01',
        billingPeriodEnd: '2025-12-31',
        createdAt: '2025-12-01',
    },
    {
        id: 'inv-3',
        invoiceNumber: 'INV-2025-000347',
        customerName: 'PT Inovasi Digital',
        subscriptionId: 'sub-3',
        status: 'OVERDUE',
        totalAmount: 4320000,
        currency: 'IDR',
        dueDate: '2025-11-15',
        billingPeriodStart: '2025-11-01',
        billingPeriodEnd: '2025-11-30',
        createdAt: '2025-11-01',
    },
    {
        id: 'inv-4',
        invoiceNumber: 'INV-2026-000001',
        customerName: 'PT Teknologi Maju',
        subscriptionId: 'sub-1',
        status: 'PENDING',
        totalAmount: 10800000,
        currency: 'IDR',
        dueDate: '2026-01-15',
        billingPeriodStart: '2026-01-01',
        billingPeriodEnd: '2026-01-31',
        createdAt: '2026-01-01',
    },
];

/**
 * MOCK PAYMENTS
 * For FINANCE dashboard
 */
export const MOCK_PAYMENTS: Payment[] = [
    {
        id: 'pay-1',
        invoiceId: 'inv-1',
        invoiceNumber: 'INV-2025-000345',
        customerName: 'PT Teknologi Maju',
        amount: 10800000,
        currency: 'IDR',
        paymentDate: '2025-12-10',
        paymentMethod: 'Virtual Account (BCA)',
        status: 'SUCCESS',
    },
    {
        id: 'pay-2',
        invoiceId: 'inv-2',
        invoiceNumber: 'INV-2025-000346',
        customerName: 'CV Digital Indonesia',
        amount: 1800000,
        currency: 'IDR',
        paymentDate: '2025-12-12',
        paymentMethod: 'Credit Card',
        status: 'SUCCESS',
    },
    {
        id: 'pay-3',
        invoiceId: 'inv-3',
        invoiceNumber: 'INV-2025-000347',
        customerName: 'PT Inovasi Digital',
        amount: 4320000,
        currency: 'IDR',
        paymentDate: '2025-11-20',
        paymentMethod: 'Virtual Account (Mandiri)',
        status: 'FAILED',
    },
    {
        id: 'pay-4',
        invoiceId: 'inv-4',
        invoiceNumber: 'INV-2026-000001',
        customerName: 'PT Teknologi Maju',
        amount: 10800000,
        currency: 'IDR',
        paymentDate: '2026-01-05',
        paymentMethod: 'Virtual Account (BCA)',
        status: 'PENDING',
    },
];

/**
 * Utility function to format currency
 */
export function formatCurrency(amount: number, currency: string = 'IDR'): string {
    if (currency === 'IDR') {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    }
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
    }).format(amount);
}

/**
 * Utility function to format date
 */
export function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    }).format(date);
}
