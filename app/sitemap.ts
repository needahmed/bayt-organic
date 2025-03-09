import type { MetadataRoute } from "next"

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://baytorganic.com"

  // Main pages
  const routes = [
    "",
    "/about",
    "/contact",
    "/products/soaps",
    "/products/shampoos",
    "/products/body-care",
    "/products/accessories",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
  }))

  return routes
}

