import { homeJumpNavLinks } from "@/lib/home-page-sections"
import { cn } from "@/lib/utils"

export default function HomeJumpNav() {
  return (
    <nav
      aria-label="On this page"
      className={cn(
        "sticky top-16 z-30 -mx-6 mb-2 bg-surface-container-low/85 py-3 shadow-editorial-float backdrop-blur-md md:-mx-8"
      )}
    >
      <div className="flex snap-x snap-mandatory gap-1 overflow-x-auto px-4 pb-0.5 md:px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {homeJumpNavLinks.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className={cn(
              "snap-start whitespace-nowrap rounded-full px-3 py-1.5 font-sans text-xs font-semibold tracking-wide text-muted-foreground uppercase",
              "ring-1 ring-outline-variant/15 hover:bg-surface-container-high hover:text-foreground"
            )}
          >
            {item.label}
          </a>
        ))}
      </div>
    </nav>
  )
}
