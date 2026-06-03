// Purpose: Shared Tailwind classes for the weather location search UI.
export const weatherSearchCompoundClass =
  "flex min-w-0 items-stretch overflow-visible rounded-2xl bg-surface-container-lowest shadow-md ring-1 ring-outline-variant/10 transition-[box-shadow,ring-color] duration-200 focus-within:shadow-lg focus-within:ring-2 focus-within:ring-primary/30"

export const weatherSearchInputClass =
  "h-12 w-full min-w-0 flex-1 rounded-none border-0 bg-transparent py-0 text-base text-on-surface placeholder:text-on-surface-variant/45 outline-none ring-0 focus:ring-0 sm:h-[52px] sm:text-[15px]"

export const weatherSearchOptionClass =
  "mx-1.5 rounded-xl px-3 py-2.5 text-left text-sm transition-colors duration-150"

export const weatherSearchOptionActiveClass = "bg-primary/10 text-on-surface"

export const weatherSearchOptionIdleClass = "text-on-surface-variant hover:bg-surface-container-low"

export const weatherSearchDropdownClass =
  "absolute top-[calc(100%+0.5rem)] z-30 max-h-72 w-full overflow-y-auto rounded-2xl bg-surface-container-lowest p-1.5 shadow-xl ring-1 ring-outline-variant/10"
