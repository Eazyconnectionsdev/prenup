import Image from "next/image";
import { Mail } from "lucide-react";

export type CaseManagerCardProps = {
  name?: string;
  role?: string;
  email?: string;
  avatarUrl?: string;
  status?: "assigned" | "pending";
};

function initialsOf(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return ((parts[0]?.[0] ?? "") + (parts.length > 1 ? parts[parts.length - 1][0] : "")).toUpperCase();
}

const focusRing =
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5B3FD9] focus-visible:ring-offset-2";

/**
 * Who is looking after this case. With no case manager yet it shows an empty
 * state and a disabled button.
 *
 * @example
 * <CaseManagerCard
 *   name="Jennifer Lee"
 *   role="Case Manager"
 *   email="jennifer@letsprenup.com"
 *   status="assigned"
 * />
 *
 * @example Nobody assigned yet
 * <CaseManagerCard status="pending" />
 */
export default function CaseManagerCard({
  name,
  role = "Case Manager",
  email,
  avatarUrl,
  status = "assigned",
}: CaseManagerCardProps) {
  const isAssigned = Boolean(name && email);
  const badgeIsAssigned = isAssigned && status === "assigned";

  return (
    <section
      aria-label="Assigned case manager"
      className="w-full max-w-sm rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
    >
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-sm font-semibold text-gray-900">Assigned Case Manager</h3>
        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
            badgeIsAssigned ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"
          }`}
        >
          {badgeIsAssigned ? "Assigned" : "Pending"}
        </span>
      </div>

      {isAssigned ? (
        <>
          <div className="mt-4 flex items-center gap-3">
            {avatarUrl ? (
              <Image
                src={avatarUrl}
                alt={`Photo of ${name}`}
                width={48}
                height={48}
                unoptimized
                className="h-12 w-12 flex-shrink-0 rounded-full object-cover"
              />
            ) : (
              <div
                aria-hidden="true"
                className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-[#EDE9FE] text-sm font-semibold text-[#5B3FD9]"
              >
                {initialsOf(name!)}
              </div>
            )}
            <div className="min-w-0">
              <p className="truncate text-base font-bold text-gray-800">{name}</p>
              <p className="truncate text-sm text-gray-500">{role}</p>
            </div>
          </div>

          <hr className="my-4 border-gray-200" />

          <p className="flex items-center gap-2 text-sm text-gray-500">
            <Mail className="h-4 w-4 flex-shrink-0 text-gray-400" aria-hidden="true" />
            <span className="truncate" title={email}>
              {email}
            </span>
          </p>

          <a
            href={`mailto:${email}`}
            aria-label={`Contact case manager ${name} by email`}
            className={`mt-4 block w-full rounded-lg bg-[#5B3FD9] py-2.5 text-center text-sm font-medium text-white transition hover:bg-[#4C33B8] ${focusRing}`}
          >
            Contact Case Manager
          </a>
        </>
      ) : (
        <>
          <p className="mt-4 text-sm text-gray-500">A case manager will be assigned soon</p>
          <button
            type="button"
            disabled
            aria-label="Contact case manager (available once one is assigned)"
            className="mt-4 w-full cursor-not-allowed rounded-lg bg-[#5B3FD9] py-2.5 text-sm font-medium text-white opacity-50"
          >
            Contact Case Manager
          </button>
        </>
      )}
    </section>
  );
}
