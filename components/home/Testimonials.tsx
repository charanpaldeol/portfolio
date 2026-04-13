import type { Testimonial } from "@/lib/testimonials-data"
import { cn } from "@/lib/utils"

type TestimonialsProps = {
  testimonials: Testimonial[]
}

type NoteTone = "primary" | "tertiary" | "secondary"

const NOTE_TONES: Record<
  NoteTone,
  { base: string; text: string; fold: string; quote: string; initials: string }
> = {
  primary: {
    base: "bg-primary-fixed",
    text: "text-on-primary-fixed",
    fold: "bg-primary/25",
    quote: "text-on-primary-fixed/60",
    initials: "bg-on-primary-fixed/15 text-on-primary-fixed",
  },
  tertiary: {
    base: "bg-tertiary-fixed",
    text: "text-on-tertiary-fixed",
    fold: "bg-tertiary/25",
    quote: "text-on-tertiary-fixed/60",
    initials: "bg-on-tertiary-fixed/15 text-on-tertiary-fixed",
  },
  secondary: {
    base: "bg-secondary-fixed/75",
    text: "text-on-secondary-fixed",
    fold: "bg-secondary/25",
    quote: "text-on-secondary-fixed/60",
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
        "relative flex h-full min-h-[220px] flex-col rounded-2xl p-6 shadow-editorial transition-transform duration-300",
        "overflow-hidden",
        styles.base,
        styles.text,
        "hover:-translate-y-1",
        className
      )}
    >
      <div
        className={cn(
          "pointer-events-none absolute right-0 top-0 size-12 origin-top-right rotate-45",
          styles.fold
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
  const featured = testimonials.slice(0, 3)
  return (
    <section id="testimonials" className="scroll-mt-28" aria-labelledby="testimonials-heading">
      <div className="-mx-6 bg-surface-container-low px-6 py-14 md:-mx-8 md:px-8 md:py-20">
        <header className="mx-auto mb-12 max-w-4xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
            What collaborators say
          </p>
          <h2
            id="testimonials-heading"
            className="font-display mt-3 text-3xl font-extrabold tracking-tight text-on-surface md:text-4xl"
          >
            Hear from teams I’ve worked with
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-on-surface-variant md:text-base">
            Real stories about what it’s like to ship together.
          </p>
        </header>
        <div className="mx-auto max-w-5xl">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3 md:gap-6">
            <TestimonialNote
              testimonial={featured[0] ?? testimonials[0]!}
              tone="primary"
              className="md:-rotate-6 md:translate-y-4"
            />
            <TestimonialNote testimonial={featured[1] ?? testimonials[1]!} tone="tertiary" className="md:rotate-2" />
            <TestimonialNote
              testimonial={featured[2] ?? testimonials[2]!}
              tone="secondary"
              className="md:rotate-6 md:translate-y-4"
            />
          </div>
          {testimonials.length > 3 ? (
            <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {testimonials.slice(3).map((t, idx) => (
                <TestimonialNote
                  key={t.id}
                  testimonial={t}
                  tone={idx % 3 === 0 ? "secondary" : idx % 3 === 1 ? "primary" : "tertiary"}
                />
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}
