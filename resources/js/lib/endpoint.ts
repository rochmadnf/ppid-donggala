const endpoints = [
    { name: 'home', href: '/' },
    { name: 'login', href: '/console/login' },
    { name: 'dashboard', href: '/console' },
    { name: 'officers.public', href: '/profile/public-officers' },
    { name: 'officers.console', href: '/console/profile/public-officers' },
    { name: 'officers.console.update.photo', href: '/console/profile/public-officers/d/:id/photo' },
    { name: 'officers.console.show', href: '/console/profile/public-officers/d/office?id=:id' },
    { name: 'officers.console.delete', href: '/console/profile/public-officers/:id' },
] as const;

export type EndpointName = (typeof endpoints)[number]['name'];

export function getEndpoint(endpointName: EndpointName, params?: Record<string, string | number>): string {
    const endpoint = endpoints.find((e) => e.name === endpointName);

    if (!endpoint) {
        throw new Error(`Endpoint with name "${endpointName}" not found.`);
    }

    let href: string = endpoint.href;

    if (params) {
        for (const [key, value] of Object.entries(params)) {
            href = href.replace(`:${key}`, encodeURIComponent(String(value)));
        }
    }

    return href;
}
