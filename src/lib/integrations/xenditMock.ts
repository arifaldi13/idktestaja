// Mock Xendit client to keep integrations isolated from UI logic
export function createPaymentLink(invoiceId: string) {
    return `https://pay.xendit.co/${invoiceId}-${Math.random().toString(36).slice(2, 6)}`;
}

export function createXenditSubscription(subscriptionId: string) {
    return {
        id: `xsub-${Math.random().toString(36).slice(2, 8)}`,
        subscriptionId,
        status: 'ACTIVE' as const,
        nextChargeDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    };
}

