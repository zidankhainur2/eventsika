import { MetadataRoute } from 'next';
import { createClient } from '@/lib/supabase/server';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://eventsika.vercel.app';

  // Fetch all published events from Supabase to dynamically index detail pages
  const supabase = createClient();
  const { data: events } = await supabase
    .from('events')
    .select('slug, updated_at')
    .eq('status', 'published');

  const eventUrls = (events || []).map((event) => ({
    url: `${baseUrl}/event/${event.slug}`,
    lastModified: new Date(event.updated_at || new Date()),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  const routes = ['', '/explore', '/about', '/faq', '/contact', '/privacy'].map(
    (route) => ({
      url: `${baseUrl}${route}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: route === '' ? 1.0 : 0.8,
    })
  );

  return [...routes, ...eventUrls];
}
