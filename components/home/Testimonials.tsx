import type { Testimonial } from "@/lib/testimonials-data"
import { cn } from "@/lib/utils"

type TestimonialsProps = {
  testimonials: Testimonial[]
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  const titleLine = [testimonial.title, testimonial.company].filter(Boolean).join(" · ")

  return (
    <article
      className={cn(
        "flex h-full flex-col rounded-xl bg-surface-container-lowest p-8 shadow-editorial transition-shadow duration-300",
        "hover:shadow-editorial-float",
      )}
    >
      <p className="font-display text-5xl font-extrabold leading-none text-primary" aria-hidden>
        &ldquo;
      </p>
      <blockquote className={cn("mt-4 flex-1 font-sans text-lg leading-relaxed text-on-surface italic")}>
        {testimonial.quote}
      </blockquote>
      <div className="mt-8 flex gap-4">
        <div
          className={cn(
            "flex size-10 shrink-0 items-center justify-center rounded-full bg-primary-fixed",
            "font-semibold text-sm text-on-primary-fixed",
          )}
          aria-hidden
        >
          {testimonial.avatarInitials}
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-on-surface">{testimonial.author}</p>
          <p className="mt-0.5 text-sm text-on-surface-variant">{titleLine}</p>
          <p className="mt-2 text-xs text-on-surface-variant">{testimonial.relationship}</p>
        </div>
      </div>
    </article>
  )
}

export function Testimonials({ testimonials }: TestimonialsProps) {
  return (
    <section id="testimonials" className="scroll-mt-28" aria-labelledby="testimonials-heading">
      <div className="-mx-6 bg-surface-container-low px-6 py-14 md:-mx-8 md:px-8 md:py-20">
        <header className="mb-12 text-center md:text-left">
          <p className="text-sm font-semibold uppercase tracking-widest text-on-surface-variant">
            What collaborators say
          </p>
          <h2
            id="testimonials-heading"
            className="font-display mt-3 text-3xl font-extrabold tracking-tight text-on-surface md:text-4xl"
          >
            Trusted by teams that ship
          </h2>
        </header>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t) => (
            <TestimonialCard key={t.id} testimonial={t} />
          ))}
        </div>
      </div>
    </section>
  )
}
