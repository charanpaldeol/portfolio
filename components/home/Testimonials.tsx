import type { Testimonial } from "@/lib/testimonials-data"
import { cn } from "@/lib/utils"

type TestimonialsProps = {
  testimonials: Testimonial[]
}

type NoteTone = "primary" | "tertiary" | "secondary"

const NOTE_TONES: Record<
  NoteTone,
  { base: string; text: string; quote: string; initials: string }
> = {
  primary: {
    base: "bg-primary-fixed",
    text: "text-on-primary-fixed",
    quote: "text-on-primary-fixed/70",
    initials: "bg-on-primary-fixed/15 text-on-primary-fixed",
  },
  tertiary: {
    base: "bg-tertiary-fixed",
    text: "text-on-tertiary-fixed",
    quote: "text-on-tertiary-fixed/70",
    initials: "bg-on-tertiary-fixed/15 text-on-tertiary-fixed",
  },
  secondary: {
    base: "bg-secondary-fixed",
    text: "text-on-secondary-fixed",
    quote: "text-on-secondary-fixed/70",
    initials: "bg-on-secondary-fixed/15 text-on-secondary-fixed",
  },
}

function TestimonialNote({
  testimonial,
  tone,
  className,
}: {
  testimonial: Testimonial
  tone: NoteTone
  className?: string
}) {
  const titleLine = [testimonial.title, testimonial.company].filter(Boolean).join(" · ")
  const styles = NOTE_TONES[tone]

  return (
    <article
      className={cn(
        "relative flex w-[19.5rem] flex-col rounded-2xl p-6 shadow-editorial transition-transform duration-300",
        "overflow-hidden",
        "shadow-[0_32px_56px_-12px_color-mix(in_srgb,var(--color-on-surface)_7%,transparent)]",
        "ring-1 ring-inset ring-outline-variant/15",
        styles.base,
        styles.text,
        "hover:-translate-y-1 hover:rotate-0",
        className
      )}
    >
      <div
        className={cn(
          "pointer-events-none absolute inset-0 opacity-[0.28]",
          "bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.55),transparent_58%)]"
        )}
        aria-hidden
      />
      <blockquote className={cn("flex-1 font-sans text-sm leading-relaxed")}>
        {testimonial.quote}
      </blockquote>
      <div className="mt-6 flex items-end justify-between gap-4">
        <div
          className={cn(
            "flex size-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
            styles.initials
          )}
          aria-hidden
        >
          {testimonial.avatarInitials}
        </div>
        <div className="min-w-0 text-right">
          <p className="text-sm font-semibold">{testimonial.author}</p>
          <p className={cn("mt-1 text-xs", styles.quote)}>{titleLine}</p>
        </div>
      </div>
    </article>
  )
}

export function Testimonials({ testimonials }: TestimonialsProps) {
  const tones: NoteTone[] = ["primary", "tertiary", "secondary"]
  const deck = testimonials.length > 0 ? testimonials : []

  // Ensure the marquee never shows “dead air” when there are only a few testimonials.
  // We repeat enough notes so each animated lane has plenty of content.
  const repeatCount = deck.length === 0 ? 0 : Math.max(4, Math.ceil(12 / deck.length))
  const lane = deck.length === 0 ? [] : Array.from({ length: repeatCount }, () => deck).flat()

  const noteClass = (i: number) => {
    void i
    return "rotate-0"
  }

  return (
    <section id="testimonials" className="scroll-mt-28" aria-labelledby="testimonials-heading">
      <div className="-mx-6 relative overflow-hidden bg-surface-container-low px-6 py-14 md:-mx-8 md:px-8 md:py-20">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_120%_90%_at_50%_0%,color-mix(in_srgb,var(--color-primary)_8%,transparent),transparent_58%),radial-gradient(ellipse_120%_90%_at_50%_100%,color-mix(in_srgb,var(--color-secondary)_7%,transparent),transparent_62%)] opacity-70"
          aria-hidden
        />
        <div className="relative mx-auto max-w-6xl">
          <header className="mx-auto mb-12 max-w-3xl text-center">
            <p className="text-xs font-bold tracking-[0.2em] text-muted-foreground uppercase">
              Our customers
            </p>
          <h2
            id="testimonials-heading"
              className="font-display mt-3 text-3xl font-extrabold tracking-tight text-foreground md:text-4xl"
          >
            Hear from teams I’ve worked with.
          </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
            Real stories about what it’s like to ship together.
          </p>
          </header>

          {deck.length > 0 ? (
            <div
              className={cn(
                "group relative overflow-hidden py-2",
                "[--gap:1.75rem] [--duration:62s] md:[--duration:74s]",
                "[mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]",
              )}
              aria-label="Testimonials marquee"
            >
              <div className="flex w-max items-stretch gap-[var(--gap)]">
                <div
                  className={cn(
                    "flex min-w-max items-stretch gap-[var(--gap)]",
                    "animate-marquee motion-reduce:animate-none",
                    "group-hover:[animation-play-state:paused]",
                  )}
                >
                  {lane.map((t, i) => (
                    <TestimonialNote
                      key={`lane-a-${t.id}-${i}`}
                      testimonial={t}
                      tone={tones[i % tones.length]!}
                      className={cn(noteClass(i), "shrink-0")}
                    />
                  ))}
                </div>
                <div
                  className={cn(
                    "flex min-w-max items-stretch gap-[var(--gap)]",
                    "animate-marquee motion-reduce:animate-none",
                    "group-hover:[animation-play-state:paused]",
                  )}
                  aria-hidden
                >
                  {lane.map((t, i) => (
                    <TestimonialNote
                      key={`lane-b-${t.id}-${i}`}
                      testimonial={t}
                      tone={tones[(i + 1) % tones.length]!}
                      className={cn(noteClass(i + 3), "shrink-0")}
                    />
                  ))}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}
