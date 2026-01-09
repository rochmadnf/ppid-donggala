import { type ImgHTMLAttributes } from 'react';

export default function AppLogo(props: ImgHTMLAttributes<HTMLImageElement>) {
    return <img {...props} src="/assets/img/ppid.png" />;
}
