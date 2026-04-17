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
      "Charan walked into a sprawling enterprise rollout — five teams, four time zones, more stakeholder opinions than I care to count — and made it look manageable. He built the playbooks, mapped every dependency, and drove the delivery cadence himself. We cut time-to-deploy by nearly a third. Most analysts hand you documentation. He handed us operational clarity.",
    author: "David Kim",
    title: "Director, Enterprise Programmes",
    company: "Enterprise software company",
    relationship: "Delivery partner on a multi-phase SaaS rollout",
    avatarInitials: "DK",
  },
  {
    id: "t2",
    quote:
      "When regulators change reporting rules, the last thing you want is ambiguity in your data pipeline. Charan untangled our compliance requirements down to the individual data attribute, built the validation framework, and gave our AML team actual confidence going into an audit. He speaks regulatory and technical in the same sentence — that combination is genuinely rare.",
    author: "Rachel Torres",
    title: "VP, Compliance Systems",
    company: "Major Canadian financial institution",
    relationship: "Internal client on a regulatory data and reporting project",
    avatarInitials: "RT",
  },
  {
    id: "t3",
    quote:
      "We needed our CRM to reflect how a sell-side desk actually operates — not how a vendor thinks it should. Charan learned our workflow faster than most of our own analysts, centralized years of fragmented client data, and built dashboards the trading teams actually open every morning. Getting people to use the thing is always the hard part. He figured that out.",
    author: "James Okafor",
    title: "Head of Client Analytics",
    company: "Capital markets firm",
    relationship: "Client stakeholder on a CRM implementation and data migration",
    avatarInitials: "JO",
  },
  {
    id: "t4",
    quote:
      "User adoption is where most implementations quietly die. Charan treated it as a first-class deliverable from week one — structured change management running in parallel with the technical build, honest feedback loops with end users, regular check-ins that actually changed what we shipped. By day 60 post-launch we were above 80% active adoption. He stayed accountable to the outcome, not just the go-live date.",
    author: "Meera Patel",
    title: "Senior Change Lead",
    company: "Financial services organisation",
    relationship: "Change management counterpart on an enterprise platform migration",
    avatarInitials: "MP",
  },
  {
    id: "t5",
    quote:
      "Real-time freight visibility sounds straightforward until you try to wire it into legacy dispatch systems with three different data formats and a team that is deeply sceptical of anything new. Charan ran the requirements workshops, modelled every workflow, and had our drivers and coordinators bought in before a single line of code changed. The implementation went live on schedule — which almost never happens in this industry.",
    author: "Chris Beaumont",
    title: "VP, Operations",
    company: "North American logistics provider",
    relationship: "Executive sponsor on a supply chain visibility implementation",
    avatarInitials: "CB",
  },
]
