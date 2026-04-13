/**
 * Homepage testimonials — edit this file; layout lives in components/home/Testimonials.tsx.
 */

export type Testimonial = {
  id: string
  quote: string
  author: string
  title: string
  company?: string
  relationship: string
  avatarInitials: string
}

export const testimonials: Testimonial[] = [
  // TODO: replace with real testimonial from Jordan Lee
  {
    id: "t1",
    quote:
      "Charan ran discovery like a product leader and shipped like an engineer — one backlog, one definition of done, and zero handoff theater. Our platform redesign actually landed in production with the design system intact.",
    author: "Jordan Lee",
    title: "VP, Product",
    company: "Series B data infrastructure company",
    relationship: "Cross-functional partner on a platform redesign",
    avatarInitials: "JL",
  },
  // TODO: replace with real testimonial from Priya Nair
  {
    id: "t2",
    quote:
      "He is the rare principal who can frame the narrative for executives, then sit with the team and trace the edge cases. I learned more about AI-native delivery in three sprints with Charan than in a year of tooling experiments.",
    author: "Priya Nair",
    title: "Staff Product Designer",
    company: "Fintech scale-up",
    relationship: "Collaborated as design counterpart on AI-assisted workflows",
    avatarInitials: "PN",
  },
  // TODO: replace with real testimonial from Marcus Chen
  {
    id: "t3",
    quote:
      "We brought Charan in when delivery was fast but incoherent. He reframed the roadmap around measurable outcomes, tightened our design-system governance, and gave engineering a contract they could trust. Velocity went up after we slowed down once.",
    author: "Marcus Chen",
    title: "CTO",
    company: "Healthcare operations SaaS",
    relationship: "Client for modernization and design-system engagement",
    avatarInitials: "MC",
  },
  // TODO: replace with real testimonial from Elena Rossi
  {
    id: "t4",
    quote:
      "Our founders needed a credible story for investors and a build plan that would not embarrass us in diligence. Charan delivered both — narrative, architecture spikes, and a hiring rubric — without turning it into a six-month strategy project.",
    author: "Elena Rossi",
    title: "Co-founder",
    company: "B2B workflow startup",
    relationship: "Client for zero-to-one product strategy and technical plan",
    avatarInitials: "ER",
  },
  // TODO: replace with real testimonial from Sam Okonkwo
  {
    id: "t5",
    quote:
      "He does not treat design systems as a component library problem. It is governance, education, and release discipline — and he stayed until adoption metrics moved, not until the Figma file looked pretty.",
    author: "Sam Okonkwo",
    title: "Director of Engineering",
    company: "Enterprise collaboration product",
    relationship: "Colleague on design-system scale and adoption programme",
    avatarInitials: "SO",
  },
]
