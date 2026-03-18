import Link from 'next/link'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-slate-200 bg-white/80 text-slate-600 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10 md:flex-row md:justify-between md:px-6">
        {/* Logo and tagline */}
        <div className="max-w-sm">
          <Link href="/" className="text-base font-semibold tracking-tight text-slate-900 sm:text-lg">
            cpdeol.com
          </Link>
          <p className="mt-2 text-sm text-slate-500">
            Building thoughtful software, products, and experiences with a focus on craft and impact.
          </p>
        </div>

        {/* Link columns */}
        <div className="grid flex-1 gap-8 text-sm sm:grid-cols-3">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400">Company</h3>
            <ul className="mt-3 space-y-2">
              <li>
                <Link href="/portfolio/about" className="transition-colors hover:text-slate-900">
                  About
                </Link>
              </li>
              <li>
                <Link href="/blog" className="transition-colors hover:text-slate-900">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/portfolio/projects" className="transition-colors hover:text-slate-900">
                  Projects
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400">Services</h3>
            <ul className="mt-3 space-y-2">
              <li>
                <Link href="/portfolio/services" className="transition-colors hover:text-slate-900">
                  Consulting
                </Link>
              </li>
              <li>
                <Link href="/portfolio/services" className="transition-colors hover:text-slate-900">
                  Product design
                </Link>
              </li>
              <li>
                <Link href="/portfolio/services" className="transition-colors hover:text-slate-900">
                  Engineering
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400">Contact</h3>
            <ul className="mt-3 space-y-2">
              <li>
                <Link href="/contact" className="transition-colors hover:text-slate-900">
                  Contact form
                </Link>
              </li>
              <li>
                <a href="mailto:hello@cpdeol.com" className="transition-colors hover:text-slate-900">
                  hello@cpdeol.com
                </a>
              </li>
              <li>
                <a href="https://www.linkedin.com/in/cdeol" target="_blank" rel="noreferrer" className="transition-colors hover:text-slate-900">
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-slate-200">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 text-xs text-slate-400 md:flex-row md:items-center md:justify-between md:px-6">
          <p>© {year} cpdeol.com. All rights reserved.</p>

          {/* Social icons */}
          <div className="flex items-center gap-4">
            <a
              href="https://www.linkedin.com/in/cdeol"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              className="group transition-colors hover:text-[#0A66C2]"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="h-4 w-4 transition-colors duration-300"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  className="fill-slate-600 group-hover:fill-[#0A66C2]"
                  d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z"
                />
              </svg>
            </a>
            <a
              href="https://twitter.com/cpdeol"
              target="_blank"
              rel="noreferrer"
              aria-label="Twitter"
              className="transition-colors hover:text-slate-900"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="12" cy="12" r="10" fill="currentColor" />
                <path
                  d="M16.75 8.5C16.35 8.7 15.9 8.82 15.43 8.87C15.92 8.58 16.29 8.11 16.47 7.55C16.02 7.82 15.51 8.01 14.97 8.11C14.55 7.65 13.94 7.38 13.29 7.38C11.98 7.38 11 8.43 11 9.77C11 9.97 11.02 10.16 11.06 10.34C9.2 10.25 7.53 9.39 6.41 8.06C6.2 8.43 6.08 8.86 6.08 9.32C6.08 10.19 6.51 10.96 7.17 11.41C6.81 11.41 6.48 11.31 6.18 11.17V11.19C6.18 12.35 6.98 13.32 8.11 13.54C7.9 13.6 7.66 13.63 7.41 13.63C7.25 13.63 7.09 13.62 6.94 13.59C7.25 14.55 8.12 15.25 9.16 15.27C8.36 15.91 7.37 16.3 6.3 16.3C6.11 16.3 5.93 16.29 5.75 16.27C6.8 16.96 8.07 17.37 9.43 17.37C13.28 17.37 15.46 13.66 15.46 10.23C15.46 10.12 15.46 10.01 15.45 9.9C15.9 9.56 16.28 9.14 16.6 8.67L16.75 8.5Z"
                  fill="white"
                />
              </svg>
            </a>
            <a
              href="https://github.com/cpdeol"
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
              className="transition-colors hover:text-slate-900"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 2C6.48 2 2 6.58 2 12.2C2 16.44 4.72 20 8.4 21.38C8.88 21.47 9.06 21.18 9.06 20.93C9.06 20.7 9.05 20.09 9.05 19.43C6.73 19.96 6.19 18.4 6.19 18.4C5.76 17.32 5.14 17.03 5.14 17.03C4.27 16.44 5.2 16.45 5.2 16.45C6.16 16.52 6.66 17.52 6.66 17.52C7.5 19.06 8.97 18.62 9.57 18.38C9.66 17.75 9.91 17.32 10.18 17.09C8.36 16.86 6.44 16.12 6.44 12.85C6.44 11.94 6.76 11.2 7.29 10.63C7.2 10.4 6.91 9.52 7.36 8.29C7.36 8.29 8.05 8.05 9.06 8.86C9.71 8.67 10.39 8.57 11.07 8.57C11.75 8.57 12.43 8.67 13.08 8.86C14.09 8.05 14.78 8.29 14.78 8.29C15.23 9.52 14.94 10.4 14.85 10.63C15.38 11.2 15.7 11.94 15.7 12.85C15.7 16.13 13.77 16.86 11.95 17.08C12.3 17.39 12.59 17.97 12.59 18.85C12.59 20.08 12.58 20.64 12.58 20.93C12.58 21.18 12.76 21.48 13.24 21.38C16.92 20 19.64 16.44 19.64 12.2C19.64 6.58 15.16 2 12 2Z"
                  fill="currentColor"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

