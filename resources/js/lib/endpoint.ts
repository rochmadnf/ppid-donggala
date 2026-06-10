interface EndpointsProps {
    name: string;
    href: string;
}

const endpoints: EndpointsProps[] = [
    {
        name: 'home',
        href: '/',
    },
    {
        name: 'login',
        href: '/console/login',
    },
    {
        name: 'dashboard',
        href: '/console/dashboard',
    },
    {
        name: 'officer.public',
        href: '/profile/public-officers',
    },
];

export type EndpointName = (typeof endpoints)[number]['name'];

export function getEndpoint(endpointName: EndpointName): string {
    const endpoint = endpoints.find((e) => e.name === endpointName);

    if (!endpoint) {
        throw new Error(`Endpoint with name "${endpointName}" not found.`);
    }

    return endpoint.href;
}
