import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://kakalinks.com";

  // In a real production app, you could fetch dynamic 
  // blog posts or services from your API here.
  // const posts = await fetch('https://api.kakalinks.com/posts').then(res => res.json());

  const routes = [
    "",
    "/login",
    "/register",
    "/forgot-password", 
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'daily' as const,
    priority: route === "" ? 1 : 0.8,
  }));

  return [...routes];
}