/**
 * Stand-in for the dashboard home while the case is still being fetched.
 *
 * The dashboard reads almost everything off the case in the store, so before
 * it lands every derived value reads as "nothing yet": 0% progress, no partner,
 * no steps complete. Rendering that and then correcting it a moment later looks
 * like the page changing its mind, so the shapes are held instead and only the
 * real numbers are ever shown.
 *
 * The blocks mirror the live layout — header, three stat cards, the journey
 * list — so the swap shifts nothing on the page.
 */

const shellClasses =
  "flex h-full flex-col rounded-2xl border border-[#EDEDF5] bg-white px-5 py-4 shadow-sm";

/** One grey block. Rounded and tinted like the text or control it stands for. */
function Bar({ className = "" }: { className?: string }) {
  return <div className={`rounded bg-[#EFEFF6] ${className}`} />;
}

function StatCardSkeleton({ withDial = false }: { withDial?: boolean }) {
  return (
    <div className={shellClasses}>
      <div className="flex items-start justify-between gap-3">
        <Bar className="h-3 w-24" />
        <div className="h-5 w-5 flex-shrink-0 rounded bg-[#E6E1FB]" />
      </div>

      <div className="mt-2 flex items-center justify-between gap-3">
        <Bar className="h-6 w-28" />
        {withDial && (
          <div className="h-11 w-11 flex-shrink-0 rounded-full border-4 border-[#EFEFF6]" />
        )}
      </div>

      <div className="mt-auto flex items-center justify-between gap-3 pt-3">
        <Bar className="h-3 w-32" />
        <div className="h-7 w-20 flex-shrink-0 rounded-full bg-[#EFEFF6]" />
      </div>
    </div>
  );
}

export default function DashboardSkeleton() {
  return (
    <div
      className="h-full animate-pulse bg-[#F6F6FB]"
      role="status"
      aria-busy="true"
      aria-live="polite"
    >
      <span className="sr-only">Loading your dashboard…</span>

      <div className="mx-auto max-w-5xl px-8 py-8">
        {/* Greeting + the line about where the case stands */}
        <div>
          <Bar className="h-7 w-64 bg-[#E4E4EF]" />
          <Bar className="mt-3 h-4 w-80 max-w-full" />
        </div>

        {/* Progress · service · partner */}
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <StatCardSkeleton withDial />
          <StatCardSkeleton />
          <StatCardSkeleton />
        </div>

        {/* Your Prenup Journey */}
        <div className="mt-8 rounded-2xl bg-white p-5 shadow-sm">
          <Bar className="h-5 w-44 bg-[#E4E4EF]" />
          <Bar className="mt-3 h-4 w-96 max-w-full" />

          <div className="mt-5 flex flex-col gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-4 rounded-2xl border border-[#EDEDF5] bg-white px-4 py-4"
              >
                <div className="h-12 w-12 flex-shrink-0 rounded-xl bg-[#E6E1FB]" />
                <div className="h-8 w-8 flex-shrink-0 rounded-full bg-[#EDE9FE]" />

                <div className="min-w-0 flex-1 space-y-2">
                  <Bar className="h-3.5 w-48 max-w-full" />
                  <Bar className="h-3 w-72 max-w-full" />
                </div>

                <div className="hidden w-28 flex-shrink-0 justify-end lg:flex">
                  <Bar className="h-3 w-20" />
                </div>

                <div className="ml-4 h-8 w-24 flex-shrink-0 rounded-lg bg-[#EFEFF6]" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
