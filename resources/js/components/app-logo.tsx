import { appAsset } from '@/lib/utils';
import { type ImgHTMLAttributes } from 'react';

export default function AppLogo(props: ImgHTMLAttributes<HTMLImageElement>) {
    return <img {...props} src={appAsset('/assets/img/ppid.png')} />;
}
