import { Metadata } from "next"

export const metadata: Metadata = { title: "Projects" }

export default function ProjectsPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">Projects</h1>
      <p className="text-sm text-slate-600 md:text-base">Coming soon.</p>
    </div>
  )
}

