export function toggleGcpProject(projectId: string, active: boolean) {
    return `${active ? 'Activated' : 'Suspended'} GCP project ${projectId}`;
}

