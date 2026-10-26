import { cn } from "@/lib/utils"

/*
 * Official VTS logo, exported from Figma:
 * VTS-Redesign / Frame 11 (node 7466:2125).
 *
 * The source is a single boolean Union; its subpaths are split here into the
 * mark (two chevrons) and the wordmark (the V, T and S letterforms) so the
 * rail can show the mark alone. Coordinates are verbatim from the export —
 * don't hand-edit them. Both use `currentColor` so the logo inherits whatever
 * text color it sits in (e.g. `text-sidebar-foreground`).
 */

const MARK_LOWER_CHEVRON =
  "M26.4512 11.2422L13.2256 19.4981L13.2236 19.5L0 11.2442V5.73831L13.2236 13.9942L13.2256 13.9912L26.4512 5.73636V11.2422Z"

const MARK_UPPER_CHEVRON =
  "M20.8545 5.53909L17.6152 7.67484L13.2354 4.77737L13.2256 4.78323L8.84375 7.68069L5.60449 5.54691L13.2256 0.507843L13.2354 0.500031L20.8545 5.5391Z"

const WORDMARK_V =
  "M40.7822 13.0938L43.8457 3.35941H47.0391L42.5244 16.5996H38.8555L34.3799 3.35941H37.7197L40.7822 13.0938Z"

const WORDMARK_T =
  "M63.5107 6.09866H59.2373V16.5996H56.0801V6.09866H51.8252V3.35941H63.5107V6.09866Z"

const WORDMARK_S =
  "M74.083 3.12991C76.6881 3.13003 79.1643 4.26309 79.6221 7.18362H76.5215C76.2102 6.19884 75.2381 5.63187 73.8975 5.63187L73.668 5.64651C72.5762 5.69973 71.7805 6.15029 71.7803 6.91995C71.7803 7.57729 72.405 8.05316 73.3223 8.25296L75.1387 8.61819C77.2842 9.05773 79.9997 9.71548 80 12.4903C80 15.2655 77.1898 16.8379 74.4219 16.8379C71.0097 16.8379 68.7717 15.1381 68.2959 12.2891H71.415C71.7623 13.6875 72.8623 14.3164 74.4961 14.3164C75.5599 14.3164 76.7705 13.9689 76.7705 12.8741C76.7703 12.0151 75.7421 11.5951 74.293 11.2754L72.6875 10.9463C70.5238 10.4908 68.5605 9.46733 68.5605 7.09378C68.5608 4.39077 71.4778 3.12991 74.083 3.12991Z"

/** The mark alone — two chevrons, no wordmark. */
function VtsMark({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <svg
      viewBox="0 0 26.4512 20"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={cn("h-5 w-auto shrink-0", className)}
      {...props}
    >
      <path d={MARK_LOWER_CHEVRON} />
      <path d={MARK_UPPER_CHEVRON} />
    </svg>
  )
}

/** The full horizontal lockup — mark plus the VTS wordmark. */
function VtsLockup({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <svg
      viewBox="0 0 80 20"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={cn("h-5 w-auto shrink-0", className)}
      {...props}
    >
      <path d={MARK_LOWER_CHEVRON} />
      <path d={MARK_UPPER_CHEVRON} />
      <path d={WORDMARK_V} />
      <path d={WORDMARK_T} />
      <path d={WORDMARK_S} />
    </svg>
  )
}

interface VtsLogoProps extends React.ComponentProps<"div"> {
  /** Drop the wordmark and show the mark alone — used in the collapsed rail. */
  markOnly?: boolean
}

function VtsLogo({ markOnly = false, className, ...props }: VtsLogoProps) {
  return (
    <div
      className={cn("flex items-center justify-center", className)}
      {...props}
    >
      {markOnly ? <VtsMark /> : <VtsLockup />}
      <span className="sr-only">VTS</span>
    </div>
  )
}

export { VtsLogo, VtsLockup, VtsMark }
