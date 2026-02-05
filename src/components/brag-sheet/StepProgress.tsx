"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step { id: number; title: string; description: string; }

export function StepProgress({ steps, currentStep }: { steps: Step[]; currentStep: number }) {
  return (
    <div className="flex items-center justify-center gap-2 p-4 border-b bg-muted/30">
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center">
          <div className="flex flex-col items-center">
            <div className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
              step.id < currentStep && "bg-green-100 text-green-700",
              step.id === currentStep && "bg-primary text-primary-foreground",
              step.id > currentStep && "bg-muted text-muted-foreground"
            )}>
              {step.id < currentStep ? <Check className="h-5 w-5" /> : step.id}
            </div>
            <span className={cn("text-xs mt-1 text-center max-w-[80px] hidden sm:block", step.id === currentStep ? "text-primary font-medium" : "text-muted-foreground")}>{step.title}</span>
          </div>
          {index < steps.length - 1 && <div className={cn("w-8 sm:w-12 h-0.5 mx-2", step.id < currentStep ? "bg-green-400" : "bg-muted")} />}
        </div>
      ))}
    </div>
  );
}
