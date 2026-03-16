import { Metadata } from "next"
import { Button } from "components/Button/Button"
import { AnimatedGradientText } from "components/magicui/animated-gradient-text"
import { BlurFade } from "components/magicui/blur-fade"
import { ShimmerButton } from "components/magicui/shimmer-button"

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
    <main className="flex min-h-screen items-center justify-center bg-white px-4 dark:bg-gray-900">
      <div className="mx-auto max-w-2xl text-center">
        <AnimatedGradientText className="mb-4">
          Portfolio in progress
        </AnimatedGradientText>

        <BlurFade>
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white md:text-5xl xl:text-6xl">
            Coming Soon
          </h1>
        </BlurFade>

        <BlurFade delay={0.05}>
          <p className="mb-2 text-lg text-gray-600 dark:text-gray-300 md:text-xl">
            I&apos;m working on something new for this space.
          </p>
        </BlurFade>

        <BlurFade delay={0.1}>
          <p className="text-sm text-gray-500 dark:text-gray-400 md:text-base">
            Check back shortly to see the full portfolio.
          </p>
        </BlurFade>

        <BlurFade delay={0.18}>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <ShimmerButton href="/contact">
              Get in touch
            </ShimmerButton>
            <Button intent="secondary" href="mailto:hello@cpdeol.com">
              Contact me
            </Button>
          </div>
        </BlurFade>
      </div>
    </main>
  )
}
