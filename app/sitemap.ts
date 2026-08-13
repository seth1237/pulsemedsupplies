import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/site'

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()
  const routes = ['', '/products', '/about', '/contact']

  return routes.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified,
    changeFrequency: route === '/products' ? 'daily' : 'weekly',
    priority: route === '' ? 1 : route === '/products' ? 0.9 : 0.7,
  }))
}
