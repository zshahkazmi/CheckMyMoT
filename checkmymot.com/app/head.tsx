import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Check My MoT',
  description: 'Check My MoT - Your one-stop platform for checking vehicle MOT status.',
  keywords: ['MOT', 'vehicle', 'check', 'automobile', 'service'],
  authors: [{ name: 'Your Name', url: 'https://yourwebsite.com' }],
  openGraph: {
    title: 'Check My MoT',
    description: 'Check My MoT - Your one-stop platform for checking vehicle MOT status.',
    url: 'https://checkmymot.com',
    siteName: 'Check My MoT',
    images: [
      {
        url: 'https://checkmymot.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Check My MoT Open Graph Image',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@yourtwitterhandle',
    title: 'Check My MoT',
    description: 'Check My MoT - Your one-stop platform for checking vehicle MOT status.',
    images: ['https://checkmymot.com/og-image.png'],
  },
};