import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://tenaxvtu.com";
 
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