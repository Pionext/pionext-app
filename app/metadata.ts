export async function generateMetadata() {
  return {
    metadataBase: new URL('https://pionext.org'),
    title: 'Pionext',
    description: 'Pioneering community-driven venture building',
    openGraph: {
      title: 'Pionext',
      description: 'Community-driven venture building',
      url: 'https://pionext.org',
      siteName: 'Pionext',
      images: [
        {
          url: '/images/og-image.jpg',
          width: 1200,
          height: 630,
          alt: 'Pionext',
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Pionext',
      description: 'Pioneering community-driven venture building',
      images: ['/images/og-image.jpg'],
    },
    icons: {
      icon: [
        { url: '/images/favicon/favicon.ico' },
        { url: '/images/favicon/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
        { url: '/images/favicon/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      ],
      apple: [
        { url: '/images/favicon/apple-touch-icon.png' }
      ],
      other: [
        {
          rel: 'android-chrome-192x192',
          url: '/images/favicon/android-chrome-192x192.png',
        },
        {
          rel: 'android-chrome-512x512',
          url: '/images/favicon/android-chrome-512x512.png',
        },
      ],
    },
    manifest: '/images/favicon/site.webmanifest',
  }
} 