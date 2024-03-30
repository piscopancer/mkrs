import { project } from '@/project'
import { MetadataRoute, Route } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return (['/', '/info' as Route, '/recent', '/saved', '/hotkeys'] satisfies Route[]).map((route) => ({
    url: project.url + route,
    lastModified: new Date(),
  }))
}
