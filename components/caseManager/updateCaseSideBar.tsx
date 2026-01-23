"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUpdateCaseRoutes } from "@/hooks/useUpdateCaseRoutes";

export default function UpdateCaseSidebar() {
  const steps = useUpdateCaseRoutes();

  return (
    <aside className="w-[210px] border-r bg-white p-4">
      <h2 className="mb-6 text-lg font-semibold">Update Case</h2>

      <ul className="space-y-2">
        {steps.map((step, index) => (
          <li key={step.href}>
            <Link
              href={step.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition",
                step.isActive
                  ? "bg-primary text-white"
                  : "text-gray-700 hover:bg-gray-100",
              )}
            >
              {step.isCompleted ? (
                <span className="h-5 w-5 rounded-full bg-green-600 flex items-center justify-center">
                  <Check className="h-3 w-3 text-white" />
                </span>
              ) : (
                <span className="h-5 w-5 rounded-full border flex items-center justify-center">
                  {index + 1}
                </span>
              )}

              <span>{step.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
