"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Send, Loader2 } from "lucide-react";

interface StepNavigationProps {
  currentStep: number;
  totalSteps: number;
  isSubmitting: boolean;
  onBack: () => void;
  onNext: () => void;
  isLastStep: boolean;
}

export function StepNavigation({ currentStep, totalSteps, isSubmitting, onBack, onNext, isLastStep }: StepNavigationProps) {
  return (
    <div className="flex items-center justify-between p-4 border-t bg-muted/30">
      <Button type="button" variant="outline" onClick={onBack} disabled={currentStep === 1 || isSubmitting}>
        <ChevronLeft className="h-4 w-4 mr-1" />Back
      </Button>
      <span className="text-sm text-muted-foreground">Step {currentStep} of {totalSteps}</span>
      {isLastStep ? (
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? <><Loader2 className="h-4 w-4 mr-1 animate-spin" />Submitting...</> : <><Send className="h-4 w-4 mr-1" />Submit</>}
        </Button>
      ) : (
        <Button type="button" onClick={onNext} disabled={isSubmitting}>Next<ChevronRight className="h-4 w-4 ml-1" /></Button>
      )}
    </div>
  );
}
