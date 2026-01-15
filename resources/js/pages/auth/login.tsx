import { FormInput } from '@/components/form/input';
import { MetaTag } from '@/components/metatag';
import { Button } from '@/components/ui/button';
import AuthLayout from '@/layouts/auth-layout';
import { useForm } from '@inertiajs/react';
import { type FormEventHandler } from 'react';

export default function Login() {
    const form = useForm<{
        username: string;
        password: string;
    }>({
        username: '',
        password: '',
    });

    const hitLoginButton: FormEventHandler = (e) => {
        e.preventDefault();

        form.post(route('login'), {
            onFinish: () => form.reset('password'),
        });
    };

    return (
        <AuthLayout title="Masuk" description="Silakan masukkan kredensial untuk melanjutkan.">
            <MetaTag withAppName title="Masuk" description="Halaman untuk masuk ke aplikasi PPID Kabupaten Donggala.">
                <meta name="robots" content="noindex, nofollow" />

                <meta property="og:url" content={route('login')} />
                <link rel="canonical" href={route('login')} />
            </MetaTag>

            <form onSubmit={hitLoginButton} className="space-y-6">
                <FormInput
                    label="Nama Pengguna"
                    name="username"
                    autoFocus
                    autoComplete="username"
                    value={form.data.username}
                    onChange={(e) => form.setData('username', e.target.value)}
                    error={form.errors.username}
                />

                <FormInput
                    label="Katasandi"
                    type="password"
                    name="password"
                    autoComplete="current-password"
                    value={form.data.password}
                    onChange={(e) => form.setData('password', e.target.value)}
                    error={form.errors.password}
                />

                <div className="flex items-center justify-between">
                    <Button variant="brand" className="h-12 w-full cursor-pointer text-lg" disabled={form.processing}>
                        Masuk
                    </Button>
                </div>
            </form>
        </AuthLayout>
    );
}
