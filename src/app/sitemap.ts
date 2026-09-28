import type { MetadataRoute } from "next";
import { careCategories, guides, states } from "@/lib/content";
import { getDirectoryFacets, getSitemapProviders } from "@/lib/providers";
import { absoluteUrl } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages = ["", "/directory", "/care", "/locations", "/guides", "/about", "/how-we-verify", "/emergency-help", "/providers/apply", "/corrections", "/contact", "/privacy", "/terms"];
  const [facets, providers] = await Promise.all([getDirectoryFacets(), getSitemapProviders()]);
  const now = new Date();
  const populatedCategories = careCategories.filter((item) => facets.categories.includes(item.name));
  const populatedStates = states.filter((state) => facets.states.includes(state.code));
  return [
    ...staticPages.map((path) => ({ url: absoluteUrl(path || "/"), lastModified: now, changeFrequency: path === "" ? "weekly" as const : "monthly" as const, priority: path === "" ? 1 : .7 })),
    ...populatedCategories.map((item) => ({ url: absoluteUrl(`/care/${item.slug}`), lastModified: now, changeFrequency: "weekly" as const, priority: .7 })),
    ...populatedStates.map((state) => ({ url: absoluteUrl(`/locations/${state.slug}`), lastModified: now, changeFrequency: "weekly" as const, priority: .7 })),
    ...guides.map((guide) => ({ url: absoluteUrl(`/guides/${guide.slug}`), lastModified: new Date(guide.reviewedOn), changeFrequency: "monthly" as const, priority: .8 })),
    ...providers.map((provider) => ({ url: absoluteUrl(`/providers/${provider.organizationSlug}/${provider.locationSlug}`), lastModified: new Date(provider.updatedAt), changeFrequency: "weekly" as const, priority: .8 })),
  ];
}
