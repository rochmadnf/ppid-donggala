import ConsoleLayout from '@/layouts/console-layout';
import type { ReactNode } from 'react';

export default function PublicInformationPage() {
    return <div>Public Information Page</div>;
}

PublicInformationPage.layout = (page: ReactNode) => <ConsoleLayout>{page}</ConsoleLayout>;
