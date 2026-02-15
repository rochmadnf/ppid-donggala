import { FormInput } from '@/components/form/input';
import { MetaTag } from '@/components/metatag';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';
import { useForm } from '@inertiajs/react';
import { LoaderCircleIcon } from 'lucide-react';
import type { SubmitEventHandler } from 'react';

export default function Login() {
    const form = useForm<{
        username: string;
        password: string;
        remember_me: boolean;
    }>({
        username: '',
        password: '',
        remember_me: false,
    });

    const hitLoginButton: SubmitEventHandler = (e) => {
        e.preventDefault();

        form.post(route('login'), {
            onStart: () => {
                form.clearErrors();
            },
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
                    tabIndex={1}
                    value={form.data.username}
                    onChange={(e) => form.setData('username', e.target.value)}
                    error={form.errors.username}
                />

                <FormInput
                    label="Katasandi"
                    type="password"
                    tabIndex={2}
                    name="password"
                    autoComplete="current-password"
                    value={form.data.password}
                    onChange={(e) => form.setData('password', e.target.value)}
                    error={form.errors.password}
                />

                <div className="flex items-center gap-2.5 md:gap-2">
                    <Checkbox
                        id="remember_me"
                        checked={form.data.remember_me}
                        className="size-5 cursor-pointer rounded-sm border-line-brand data-[state=checked]:border-blue-700 data-[state=checked]:bg-blue-700 md:size-6"
                        onCheckedChange={(checked) => form.setData('remember_me', Boolean(checked))}
                    />
                    <Label htmlFor="remember_me" className="cursor-pointer text-sm hover:text-slate-900/85 lg:text-[17px]">
                        Ingat saya
                    </Label>
                </div>

                <div className="flex items-center justify-between">
                    <Button tabIndex={3} variant="brand" className="h-12 w-full cursor-pointer text-lg" disabled={form.processing}>
                        {form.processing && <LoaderCircleIcon className="pointer-events-none size-5 animate-spin" />} Masuk
                    </Button>
                </div>
            </form>
        </AuthLayout>
    );
}
