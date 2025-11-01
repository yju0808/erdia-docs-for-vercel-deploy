import { RootProvider } from 'fumadocs-ui/provider/next';
import type { Metadata } from 'next';
import './global.css';
import localFont from 'next/font/local'

const pretendard = localFont({
  src: '../public/fonts/PretendardVariable.woff2',
  display: 'swap',
  weight: '45 920',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://docs.erdia.app'),
  title: {
    default: 'Erdia 문서',
    template: '%s | Erdia 문서'
  },
  description: 'Erdia - AI 기반 ERD 설계 툴 공식 문서',
};

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="ko" className={pretendard.className} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
