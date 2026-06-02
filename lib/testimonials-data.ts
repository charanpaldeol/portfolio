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
  {
    id: "t1",
    quote:
      "Charan took a complex rollout across five teams and four time zones and made it executable. He mapped dependencies, set delivery cadence, and helped us cut time-to-deploy by nearly a third.",
    author: "David Kim",
    title: "Director, Enterprise Programmes",
    company: "Enterprise software company",
    relationship: "Delivery partner on a multi-phase SaaS rollout",
    avatarInitials: "DK",
  },
  {
    id: "t2",
    quote:
      "Charan translated shifting regulatory requirements into a clear data-validation framework our AML team could trust. We entered audit season with far more confidence because compliance and engineering stayed aligned.",
    author: "Rachel Torres",
    title: "VP, Compliance Systems",
    company: "Major Canadian financial institution",
    relationship: "Internal client on a regulatory data and reporting project",
    avatarInitials: "RT",
  },
  {
    id: "t3",
    quote:
      "Charan reshaped our CRM program around how the sell-side desk actually works, not vendor defaults. He unified fragmented data and shipped dashboards our teams use every morning.",
    author: "James Okafor",
    title: "Head of Client Analytics",
    company: "Capital markets firm",
    relationship: "Client stakeholder on a CRM implementation and data migration",
    avatarInitials: "JO",
  },
  {
    id: "t4",
    quote:
      "Charan treated adoption as a deliverable from day one, running change management in parallel with the build. We were above 80% active adoption by day 60 post-launch.",
    author: "Meera Patel",
    title: "Senior Change Lead",
    company: "Financial services organisation",
    relationship: "Change management counterpart on an enterprise platform migration",
    avatarInitials: "MP",
  },
  {
    id: "t5",
    quote:
      "Charan led requirements across legacy dispatch systems and aligned operations teams before implementation began. The freight visibility rollout launched on schedule with stronger frontline buy-in.",
    author: "Chris Beaumont",
    title: "VP, Operations",
    company: "North American logistics provider",
    relationship: "Executive sponsor on a supply chain visibility implementation",
    avatarInitials: "CB",
  },
]
