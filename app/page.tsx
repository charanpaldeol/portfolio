import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Coming Soon",
  twitter: {
    card: "summary_large_image",
  },
  openGraph: {
    url: "https://cpdeol.com/",
    images: [
      {
        width: 1200,
        height: 630,
        url: "https://raw.githubusercontent.com/Blazity/next-enterprise/main/.github/assets/project-logo.png",
      },
    ],
  },
}

export default function Web() {
  return (
    <main className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="mb-4 text-4xl md:text-5xl xl:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white">
          Coming Soon
        </h1>
        <p className="mb-2 text-lg md:text-xl text-gray-600 dark:text-gray-300">
          I&apos;m working on something new for this space.
        </p>
        <p className="text-sm md:text-base text-gray-500 dark:text-gray-400">
          Check back shortly to see the full portfolio.
        </p>
      </div>
    </main>
  )
}
