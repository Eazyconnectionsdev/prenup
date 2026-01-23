import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground bg-white placeholder:text-gray-500 border border-primary/30 rounded-md selection:bg-primary selection:text-primary-foreground w-full min-w-0 px-3 py-3 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7  file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",
        className
      )}
      {...props}
    />
  )
}

export { Input }
