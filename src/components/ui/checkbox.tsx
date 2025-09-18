import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
  // Usar a cor principal do projeto (#4F2517) para borda e estado checked
  "peer h-4 w-4 shrink-0 rounded-sm border border-[#4F2517] ring-offset-background data-[state=checked]:bg-[#4F2517] data-[state=checked]:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F2517] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
      className,
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator className={cn("flex items-center justify-center text-current") }>
      {/* Tornar o ícone responsivo ao tamanho do root usando h-full w-full */}
      <Check className="h-full w-full" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
