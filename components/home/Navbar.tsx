import Link from "next/link"

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
      <div className="flex items-center justify-between py-3">
        {/* Left: logo mark + name */}
        <div className="flex items-center gap-3">
          <div
            className="h-8 w-8 rounded-lg bg-[#2C2C2A] flex items-center justify-center"
            aria-hidden="true"
          >
            <span className="text-xs font-bold text-[#EEEDFE]">CPD</span>
          </div>
          <div className="text-sm font-medium text-foreground">Charan Deol</div>
        </div>

        {/* Right: nav links + CTA */}
        <nav className="flex items-center gap-5">
          <div className="flex items-center gap-5">
            <Link href="/portfolio/projects" className="text-sm text-muted-foreground">
              Work
            </Link>
            <Link href="/portfolio/about" className="text-sm text-muted-foreground">
              About
            </Link>
            <Link href="/blog" className="text-sm text-muted-foreground">
              Blog
            </Link>
          </div>

          <Link
            href="/contact"
            className="text-sm font-medium border border-border rounded-md px-3 py-1.5"
          >
            Let's talk
          </Link>
        </nav>
      </div>
    </header>
  )
}

