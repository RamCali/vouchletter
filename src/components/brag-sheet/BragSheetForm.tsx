"use client";

import { useState, useCallback } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card } from "@/components/ui/card";
import { StepProgress } from "./StepProgress";
import { StepNavigation } from "./StepNavigation";
import { HookStep } from "./steps/HookStep";
import { ProofStep } from "./steps/ProofStep";
import { CounselorStep } from "./steps/CounselorStep";
import { ReviewStep } from "./steps/ReviewStep";
import { completeBragSheetSchema, type CompleteBragSheetData } from "@/lib/validations/brag-sheet";
import { cn } from "@/lib/utils";

interface BragSheetFormProps {
  initialData?: Partial<CompleteBragSheetData>;
  initialStep?: number;
  userRole: "student" | "counselor";
  onSaveDraft?: (data: Partial<CompleteBragSheetData>, step: number) => Promise<void>;
  onSubmit: (data: CompleteBragSheetData) => Promise<void>;
  className?: string;
}

const STUDENT_STEPS = [{ id: 1, title: "The Hook", description: "Theme & Narrative" }, { id: 2, title: "The Proof", description: "Academic & Extracurricular" }, { id: 3, title: "Review", description: "Review & Submit" }];
const COUNSELOR_STEPS = [...STUDENT_STEPS.slice(0, 2), { id: 3, title: "Counselor", description: "Hidden Metadata" }, { id: 4, title: "Review", description: "Review & Submit" }];

export function BragSheetForm({ initialData, initialStep = 1, userRole, onSaveDraft, onSubmit, className }: BragSheetFormProps) {
  const steps = userRole === "counselor" ? COUNSELOR_STEPS : STUDENT_STEPS;
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Always use completeBragSheetSchema - it includes optional counselor fields
  // Students will only fill out the student fields, counselors fill out all
  const form = useForm<CompleteBragSheetData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(completeBragSheetSchema) as any,
    defaultValues: { threeWords: "", intellectualSpark: "", unseenFactor: "", struggleStory: "", leadershipMoment: "", classroomInteraction: "", studentRating: undefined, isFirstGenLowIncome: false, counselorNotes: "", ...initialData },
    mode: "onBlur",
  });

  const getFieldsForStep = useCallback((step: number): (keyof CompleteBragSheetData)[] => {
    if (step === 1) return ["threeWords", "intellectualSpark", "unseenFactor"];
    if (step === 2) return ["struggleStory", "leadershipMoment", "classroomInteraction"];
    if (step === 3 && userRole === "counselor") return ["studentRating", "isFirstGenLowIncome"];
    return [];
  }, [userRole]);

  const validateCurrentStep = useCallback(async () => {
    const fields = getFieldsForStep(currentStep);
    return fields.length === 0 ? true : await form.trigger(fields);
  }, [currentStep, form, getFieldsForStep]);

  const handleNext = useCallback(async () => {
    if (await validateCurrentStep() && currentStep < steps.length) {
      if (onSaveDraft) try { await onSaveDraft(form.getValues(), currentStep + 1); } catch (e) { console.error("Save draft error:", e); }
      setCurrentStep(prev => prev + 1);
    }
  }, [validateCurrentStep, currentStep, steps.length, onSaveDraft, form]);

  const handleBack = useCallback(() => { if (currentStep > 1) setCurrentStep(prev => prev - 1); }, [currentStep]);

  const handleSubmit = async (data: CompleteBragSheetData) => {
    setIsSubmitting(true);
    try { await onSubmit(data); } catch (e) { console.error("Submit error:", e); } finally { setIsSubmitting(false); }
  };

  const renderStep = () => {
    if (currentStep === 1) return <HookStep />;
    if (currentStep === 2) return <ProofStep />;
    if (userRole === "counselor" && currentStep === 3) return <CounselorStep />;
    return <ReviewStep userRole={userRole} />;
  };

  return (
    <FormProvider {...form}>
      <Card className={cn("overflow-hidden", className)}>
        <StepProgress steps={steps} currentStep={currentStep} />
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <div className="p-6">{renderStep()}</div>
          <StepNavigation currentStep={currentStep} totalSteps={steps.length} isSubmitting={isSubmitting} onBack={handleBack} onNext={handleNext} isLastStep={currentStep === steps.length} />
        </form>
      </Card>
    </FormProvider>
  );
}
