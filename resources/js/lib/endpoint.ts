const endpoints = [
    { name: 'home', href: '/' },
    { name: 'login', href: '/console/login' },
    { name: 'dashboard', href: '/console' },
    { name: 'officers.public', href: '/profile/public-officers' },
] as const;

export type EndpointName = (typeof endpoints)[number]['name'];

export function getEndpoint(endpointName: EndpointName): string {
    const endpoint = endpoints.find((e) => e.name === endpointName);

    if (!endpoint) {
        throw new Error(`Endpoint with name "${endpointName}" not found.`);
    }

    return endpoint.href;
}
