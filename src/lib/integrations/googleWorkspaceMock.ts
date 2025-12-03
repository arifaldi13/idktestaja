export function provisionGoogleWorkspace(subscriptionId: string, users: number) {
    return `Provisioned ${users} users for ${subscriptionId}`;
}

export function suspendGoogleWorkspace(subscriptionId: string) {
    return `Suspended Google Workspace for ${subscriptionId}`;
}

