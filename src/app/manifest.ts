import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Gereja Katolik Paroki Keluarga Kudus Atmodirono',
    short_name: 'Paroki Atmodirono',
    description: 'Aplikasi resmi Gereja Katolik Paroki Keluarga Kudus Atmodirono Semarang',
    start_url: '/',
    display: 'standalone',
    background_color: '#FDFAF4',
    theme_color: '#1A1614',
    icons: [
      {
        src: '/logo.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/logo.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
