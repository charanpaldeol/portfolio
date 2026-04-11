import { PageShell } from "@/components/layout/PageShell"

import PortfolioProjectsContent from "./PortfolioProjectsContent"

export default function ProjectsPage() {
  return (
    <PageShell
      containerClassName="mx-auto w-full max-w-screen-2xl flex-1 px-6 pb-24 pt-12 md:px-14 md:pb-32 md:pt-20"
    >
      <PortfolioProjectsContent />
    </PageShell>
  )
}
