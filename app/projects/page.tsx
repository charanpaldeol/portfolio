import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Selected projects by Charan Deol — product strategy, design systems, and full-stack engineering work. Coming soon.",
  alternates: { canonical: "https://cpdeol.com/projects" },
  openGraph: {
    title: "Projects — Charan Deol",
    description:
      "Selected projects by Charan Deol — product strategy, design systems, and full-stack engineering work. Coming soon.",
    url: "https://cpdeol.com/projects",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Projects — Charan Deol",
    description:
      "Selected projects by Charan Deol — product strategy, design systems, and full-stack engineering work. Coming soon.",
  },
}

export default function ProjectsPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">Projects</h1>
      <p className="text-sm text-slate-600 md:text-base">Coming soon.</p>
    </div>
  )
}

