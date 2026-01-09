import { InputErrorMessage } from '@/components/input-error-message';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';
import { Head, useForm } from '@inertiajs/react';
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
            <Head title="Masuk">
                <meta name="description" content="Halaman untuk masuk ke aplikasi PPID Kabupaten Donggala." />
            </Head>

            <form onSubmit={hitLoginButton} className="space-y-6">
                <div>
                    <Label htmlFor="username">Nama Pengguna</Label>
                    <Input
                        id="username"
                        type="text"
                        name="username"
                        className="mt-2.5"
                        tabIndex={1}
                        value={form.data.username}
                        autoComplete="username"
                        autoFocus
                        onChange={(e) => form.setData('username', e.target.value)}
                    />
                    <InputErrorMessage message={form.errors.username} className="mt-2" />
                </div>

                <div>
                    <Label htmlFor="password">Katasandi</Label>
                    <Input
                        id="password"
                        name="password"
                        type="password"
                        className="mt-2.5"
                        tabIndex={2}
                        value={form.data.password}
                        autoComplete="current-password"
                        onChange={(e) => form.setData('password', e.target.value)}
                    />
                    <InputErrorMessage message={form.errors.password} className={'mt-2'} />
                </div>

                <div className="flex items-center justify-between">
                    <Button variant="brand" disabled={form.processing}>
                        Masuk
                    </Button>
                </div>
            </form>
        </AuthLayout>
    );
}
