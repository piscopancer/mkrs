import { MetadataRoute, Route } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return (['/', '/info' as Route, '/recent', '/saved', '/shortcuts'] satisfies Route[]).map((route) => ({
    url: process.env.NEXT_PUBLIC_URL + route,
    lastModified: new Date(),
  }))
}
