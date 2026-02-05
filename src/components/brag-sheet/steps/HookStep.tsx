"use client";

import { useFormContext } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Lightbulb, Sparkles, Eye } from "lucide-react";
import type { StudentBragSheetData } from "@/lib/validations/brag-sheet";

export function HookStep() {
  const form = useFormContext<StudentBragSheetData>();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-1">The Hook</h3>
        <p className="text-sm text-muted-foreground">These questions help establish your unique theme and narrative.</p>
      </div>

      <FormField control={form.control} name="threeWords" render={({ field }) => (
        <FormItem>
          <FormLabel className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-amber-500" />Three Words Constraint</FormLabel>
          <FormDescription>If your best friend had to describe you in exactly three words, what would they be?</FormDescription>
          <FormControl><Input placeholder="e.g., Curious, Resilient, Creative" {...field} value={field.value || ""} /></FormControl>
          <FormMessage />
        </FormItem>
      )} />

      <FormField control={form.control} name="intellectualSpark" render={({ field }) => (
        <FormItem>
          <FormLabel className="flex items-center gap-2"><Lightbulb className="h-4 w-4 text-yellow-500" />Intellectual Spark</FormLabel>
          <FormDescription>What is one specific topic, assignment, or project in high school that made you lose track of time because you were so interested in it?</FormDescription>
          <FormControl><Textarea placeholder="Describe a moment when you were completely absorbed in learning something..." className="min-h-[120px]" {...field} value={field.value || ""} /></FormControl>
          <FormMessage />
        </FormItem>
      )} />

      <FormField control={form.control} name="unseenFactor" render={({ field }) => (
        <FormItem>
          <FormLabel className="flex items-center gap-2"><Eye className="h-4 w-4 text-purple-500" />The Unseen Factor</FormLabel>
          <FormDescription>What is one thing about you that will definitely NOT be on your transcript or resume?</FormDescription>
          <FormControl><Textarea placeholder="Share something personal that reveals your character..." className="min-h-[120px]" {...field} value={field.value || ""} /></FormControl>
          <FormMessage />
        </FormItem>
      )} />
    </div>
  );
}
