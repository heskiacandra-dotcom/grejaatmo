// src/app/sitemap.ts
import { MetadataRoute } from "next";

const BASE_URL = "https://paroki-keluargakudus.id"; // update with production URL

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    { url: BASE_URL, priority: 1.0, changeFrequency: "weekly" as const },
    { url: `${BASE_URL}/berita`, priority: 0.9, changeFrequency: "daily" as const },
    { url: `${BASE_URL}/jadwal`, priority: 0.8, changeFrequency: "weekly" as const },
    { url: `${BASE_URL}/warta`, priority: 0.7, changeFrequency: "weekly" as const },
    { url: `${BASE_URL}/tentang`, priority: 0.6, changeFrequency: "monthly" as const },
    { url: `${BASE_URL}/kontak`, priority: 0.6, changeFrequency: "monthly" as const },
  ];

  return staticPages.map(({ url, priority, changeFrequency }) => ({
    url,
    lastModified: new Date(),
    changeFrequency,
    priority,
  }));
}
