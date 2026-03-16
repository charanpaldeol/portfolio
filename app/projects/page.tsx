import { Metadata } from "next"

export const metadata: Metadata = { title: "Projects" }

export default function ProjectsPage() {
  return (
    <main className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-6xl flex-col gap-6 px-4 py-8 md:px-6 md:py-10">
      <h1 className="text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">Projects</h1>
      <p className="text-sm text-slate-600 md:text-base">Coming soon.</p>
    </main>
  )
}

