import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "w-full bg-transparent border-0 border-b border-gray-300 focus:border-blue-500 focus:ring-0 outline-none text-black px-0 py-2",
        className
      )}
      {...props}
    />
  )
}

export { Input }
