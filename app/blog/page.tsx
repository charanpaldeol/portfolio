import { Metadata } from "next"

export const metadata: Metadata = { title: "Blog" }

export default function BlogPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">Blog</h1>
      <p className="text-sm text-slate-600 md:text-base">Coming soon.</p>
    </div>
  )
}

