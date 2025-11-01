import type { ReactNode } from 'react';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

import { getPageImage, source } from '@/lib/source';
import { notFound } from 'next/navigation';
import { ImageResponse } from 'next/og';

export const revalidate = false;

const pretendardPath = join(
  process.cwd(),
  'public/fonts/Pretendard-Regular.otf',
);

const fontDataPromise: Promise<ArrayBuffer> = (async () => {
  const pretendardBuffer = await readFile(pretendardPath);
  const pretendardView = new Uint8Array(
    pretendardBuffer.buffer.slice(
      pretendardBuffer.byteOffset,
      pretendardBuffer.byteOffset + pretendardBuffer.byteLength,
    ),
  );
  return pretendardView.buffer as ArrayBuffer;
})();

type OgImageProps = {
  title: string;
  description?: string;
  site?: string;
  icon?: ReactNode;
  primaryColor?: string;
  primaryTextColor?: string;
};

function OgImage({
  title,
  description,
  site,
  icon,
  primaryColor = 'rgba(255,150,255,0.3)',
  primaryTextColor = 'rgb(255,150,255)',
}: OgImageProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        color: 'white',
        padding: '4rem',
        backgroundColor: '#0c0c0c',
        backgroundImage: `linear-gradient(to top right, ${primaryColor}, transparent)`,
        fontFamily: 'Pretendard',
      }}
    >
      {(site || icon) && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '12px',
            color: primaryTextColor,
          }}
        >
          {icon}
          {site && (
            <p
              style={{
                fontSize: '56px',
                fontWeight: 600,
              }}
            >
              {site}
            </p>
          )}
        </div>
      )}
      <p
        style={{
          fontWeight: 800,
          fontSize: '82px',
        }}
      >
        {title}
      </p>
      {description && (
        <p
          style={{
            fontSize: '52px',
            color: 'rgba(240,240,240,0.8)',
          }}
        >
          {description}
        </p>
      )}
    </div>
  );
}

export async function GET(
  _req: Request,
  { params }: RouteContext<'/og/docs/[...slug]'>,
) {
  const { slug } = await params;
  const page = source.getPage(slug.slice(0, -1));
  if (!page) notFound();

  const fontData = await fontDataPromise;

  return new ImageResponse(
    (
      <OgImage
        title={page.data.title}
        description={page.data.description}
        site="Erdia"
      />
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'Pretendard',
          data: fontData,
          style: 'normal',
          weight: 400,
        },
      ],
    },
  );
}

export function generateStaticParams() {
  return source.getPages().map((page) => ({
    lang: page.locale,
    slug: getPageImage(page).segments,
  }));
}
