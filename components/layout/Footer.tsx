import Link from 'next/link'

const GITHUB_URL = 'https://github.com/charanpaldeol'
const LINKEDIN_URL = 'https://www.linkedin.com/in/cdeol'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-border bg-background text-muted-foreground">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10 md:flex-row md:justify-between md:px-6">
        {/* Logo and tagline */}
        <div className="max-w-sm">
          <Link href="/" className="text-base font-semibold tracking-tight text-foreground sm:text-lg">
            cpdeol.com
          </Link>
          <p className="mt-2 text-sm text-muted-foreground">
            Independent consultant bridging business and engineering — strategy, systems, and shipped software.
          </p>
        </div>

        {/* Link columns */}
        <div className="grid flex-1 gap-8 text-sm sm:grid-cols-3">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Navigation</h3>
            <ul className="mt-3 space-y-2">
              <li>
                <Link href="/portfolio/about" className="transition-colors hover:text-foreground">
                  About
                </Link>
              </li>
              <li>
                <Link href="/blog" className="transition-colors hover:text-foreground">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/portfolio/projects" className="transition-colors hover:text-foreground">
                  Projects
                </Link>
              </li>
              <li>
                <Link href="/portfolio/experience" className="transition-colors hover:text-foreground">
                  Experience
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Services</h3>
            <ul className="mt-3 space-y-2">
              <li>
                <Link href="/portfolio/services" className="transition-colors hover:text-foreground">
                  Consulting
                </Link>
              </li>
              <li>
                <Link href="/portfolio/services" className="transition-colors hover:text-foreground">
                  Product design
                </Link>
              </li>
              <li>
                <Link href="/portfolio/services" className="transition-colors hover:text-foreground">
                  Engineering
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Contact</h3>
            <ul className="mt-3 space-y-2">
              <li>
                <Link href="/contact" className="transition-colors hover:text-foreground">
                  Contact form
                </Link>
              </li>
              <li>
                <a href="mailto:hello@cpdeol.com" className="transition-colors hover:text-foreground">
                  hello@cpdeol.com
                </a>
              </li>
              <li>
                <a href={LINKEDIN_URL} target="_blank" rel="noreferrer" className="transition-colors hover:text-foreground">
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between md:px-6">
          <p>© {year} cpdeol.com. All rights reserved.</p>

          {/* Social icons */}
          <div className="flex items-center gap-4">
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              className="transition-colors hover:text-foreground"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
              </svg>
            </a>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
              className="transition-colors hover:text-foreground"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 2C6.48 2 2 6.58 2 12.2C2 16.44 4.72 20 8.4 21.38C8.88 21.47 9.06 21.18 9.06 20.93C9.06 20.7 9.05 20.09 9.05 19.43C6.73 19.96 6.19 18.4 6.19 18.4C5.76 17.32 5.14 17.03 5.14 17.03C4.27 16.44 5.2 16.45 5.2 16.45C6.16 16.52 6.66 17.52 6.66 17.52C7.5 19.06 8.97 18.62 9.57 18.38C9.66 17.75 9.91 17.32 10.18 17.09C8.36 16.86 6.44 16.12 6.44 12.85C6.44 11.94 6.76 11.2 7.29 10.63C7.2 10.4 6.91 9.52 7.36 8.29C7.36 8.29 8.05 8.05 9.06 8.86C9.71 8.67 10.39 8.57 11.07 8.57C11.75 8.57 12.43 8.67 13.08 8.86C14.09 8.05 14.78 8.29 14.78 8.29C15.23 9.52 14.94 10.4 14.85 10.63C15.38 11.2 15.7 11.94 15.7 12.85C15.7 16.13 13.77 16.86 11.95 17.08C12.3 17.39 12.59 17.97 12.59 18.85C12.59 20.08 12.58 20.64 12.58 20.93C12.58 21.18 12.76 21.48 13.24 21.38C16.92 20 19.64 16.44 19.64 12.2C19.64 6.58 15.16 2 12 2Z"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
