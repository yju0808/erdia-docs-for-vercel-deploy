import type { ReactNode } from 'react';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

import fontkit from 'next/dist/compiled/@next/font/dist/fontkit';

import { getPageImage, source } from '@/lib/source';
import { notFound } from 'next/navigation';
import { ImageResponse } from 'next/og';

export const revalidate = false;

const pretendardPath = join(
  process.cwd(),
  'public/fonts/PretendardVariable.woff2',
);
const fallbackPath = join(
  process.cwd(),
  'node_modules/next/dist/compiled/@vercel/og/noto-sans-v27-latin-regular.ttf',
);

const fontDataPromise: Promise<ArrayBuffer> = (async () => {
  const loadFont = 'default' in fontkit ? fontkit.default : fontkit;
  const [pretendardBuffer] = await Promise.all([readFile(pretendardPath)]);

  const tryConvert = () => {
    const parsedFont = loadFont(pretendardBuffer);
    parsedFont._decompress?.();
    parsedFont._transformGlyfTable?.();
    const streamBuffer = parsedFont?.stream?.buffer;

    const toArrayBuffer = (buffer: Uint8Array | Buffer | undefined) => {
      if (!buffer) return undefined;
      const array = new Uint8Array(
        buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength),
      );
      if (array.length >= 4 && array[0] === 0 && array[1] === 1 && array[2] === 0 && array[3] !== 0) {
        array.set([0x74, 0x72, 0x75, 0x65], 0);
      }
      return array.buffer as ArrayBuffer;
    };

    return streamBuffer instanceof Uint8Array
      ? toArrayBuffer(streamBuffer)
      : Buffer.isBuffer(streamBuffer)
        ? toArrayBuffer(streamBuffer)
        : toArrayBuffer(pretendardBuffer);
  };

  const converted = tryConvert();
  if (converted) {
    try {
      const test = new ImageResponse(<div />, {
        width: 1,
        height: 1,
        fonts: [
          {
            name: 'Pretendard',
            data: converted,
            style: 'normal',
            weight: 400,
          },
        ],
      });
      await test.arrayBuffer();
      return converted;
    } catch (error) {
      console.warn('Pretendard font validation failed, falling back to default font.', error);
    }
  }

  const fallbackBuffer = await readFile(fallbackPath);
  const fallbackView = new Uint8Array(
    fallbackBuffer.buffer.slice(
      fallbackBuffer.byteOffset,
      fallbackBuffer.byteOffset + fallbackBuffer.byteLength,
    ),
  );
  return fallbackView.buffer as ArrayBuffer;
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
