import type { Metadata } from "next"

import { SITE_URL } from "@/lib/site"

export const SITE_DEFAULT_DESCRIPTION =
  "Independent consultant bridging business and engineering. Product strategy, full-stack development, design systems, and technical leadership."

export const OG_IMAGE_PATH = "/og-default.jpg"

export function absoluteUrl(path: string): string {
  if (path.startsWith("http")) return path
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`
}

export function ogImageMetadata(): NonNullable<Metadata["openGraph"]>["images"] {
  const url = absoluteUrl(OG_IMAGE_PATH)
  return [{ url, width: 1200, height: 630, alt: "Charan Deol — cpdeol.com" }]
}

export function pageMetadata(opts: {
  title: string
  description: string
  path: string
  ogType?: "website" | "article" | "profile"
  robots?: Metadata["robots"]
}): Metadata {
  const url = absoluteUrl(opts.path)
  const images = ogImageMetadata()
  const ogImageUrl = absoluteUrl(OG_IMAGE_PATH)

  return {
    title: opts.title,
    description: opts.description,
    alternates: { canonical: url },
    ...(opts.robots ? { robots: opts.robots } : {}),
    openGraph: {
      title: opts.title,
      description: opts.description,
      url,
      type: opts.ogType ?? "website",
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: opts.title,
      description: opts.description,
      images: [ogImageUrl],
    },
  }
}

export const NOINDEX_ROBOTS: Metadata["robots"] = { index: false, follow: false }
