import type { DeliveryPhaseDefinition, DeliveryPhaseId } from "@/lib/delivery-taxonomy"
import { deliveryPhases } from "@/lib/delivery-taxonomy"
import { cn } from "@/lib/utils"

type DeliveryPhaseGlossaryProps = {
  title?: string
  phaseIds?: readonly DeliveryPhaseId[]
  className?: string
  itemClassName?: string
  titleClassName?: string
  termClassName?: string
  definitionClassName?: string
}

export function DeliveryPhaseGlossary({
  title = "Delivery glossary",
  phaseIds,
  className,
  itemClassName,
  titleClassName,
  termClassName,
  definitionClassName,
}: DeliveryPhaseGlossaryProps) {
  const phaseLookup = new Map<DeliveryPhaseId, DeliveryPhaseDefinition>(
    deliveryPhases.map((phase) => [phase.id, phase])
  )
  const phases = phaseIds
    ? phaseIds.map((phaseId) => phaseLookup.get(phaseId)).filter((phase): phase is DeliveryPhaseDefinition => Boolean(phase))
    : deliveryPhases

  return (
    <div className={className}>
      <p className={cn("mb-3 text-xs font-semibold tracking-wide text-primary uppercase", titleClassName)}>{title}</p>
      <dl className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {phases.map((phase) => (
          <div key={phase.id} className={cn("rounded-xl bg-surface-container-lowest px-3 py-2.5", itemClassName)}>
            <dt className={cn("text-xs font-semibold tracking-wide text-on-surface uppercase", termClassName)}>{phase.label}</dt>
            <dd className={cn("mt-1 text-xs leading-relaxed text-on-surface-variant", definitionClassName)}>
              {phase.shortDefinition}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
