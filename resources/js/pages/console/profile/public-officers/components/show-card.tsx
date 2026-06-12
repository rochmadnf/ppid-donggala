import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { type ReactNode } from 'react';

export function ShowCard({ title, children }: { title?: string | false; children: ReactNode }) {
    return (
        <Card>
            {title ? (
                <CardHeader>
                    <CardTitle>{title}</CardTitle>
                </CardHeader>
            ) : null}

            <CardContent>{children}</CardContent>
        </Card>
    );
}
