"use client";

import { useFormContext } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { TrendingUp, Users, GraduationCap } from "lucide-react";
import type { StudentBragSheetData } from "@/lib/validations/brag-sheet";

export function ProofStep() {
  const form = useFormContext<StudentBragSheetData>();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-1">The Proof</h3>
        <p className="text-sm text-muted-foreground">Show, don&apos;t tell. These questions help demonstrate your character through specific examples.</p>
      </div>

      <FormField control={form.control} name="struggleStory" render={({ field }) => (
        <FormItem>
          <FormLabel className="flex items-center gap-2"><TrendingUp className="h-4 w-4 text-blue-500" />The Struggle Story</FormLabel>
          <FormDescription>Describe a time you struggled or failed at something. How did you handle it? Be specific.</FormDescription>
          <FormControl><Textarea placeholder="Tell us about a specific challenge you faced..." className="min-h-[140px]" {...field} value={field.value || ""} /></FormControl>
          <FormMessage />
        </FormItem>
      )} />

      <FormField control={form.control} name="leadershipMoment" render={({ field }) => (
        <FormItem>
          <FormLabel className="flex items-center gap-2"><Users className="h-4 w-4 text-green-500" />The Leadership Moment</FormLabel>
          <FormDescription>Don&apos;t list your titles. Describe one specific action you took in a club, sport, or group that made the team better.</FormDescription>
          <FormControl><Textarea placeholder="Instead of 'I was president,' tell us what you DID..." className="min-h-[140px]" {...field} value={field.value || ""} /></FormControl>
          <FormMessage />
        </FormItem>
      )} />

      <FormField control={form.control} name="classroomInteraction" render={({ field }) => (
        <FormItem>
          <FormLabel className="flex items-center gap-2"><GraduationCap className="h-4 w-4 text-orange-500" />The Classroom Connection</FormLabel>
          <FormDescription>Which teacher knows you best, and what is one specific discussion or moment you remember sharing with them?</FormDescription>
          <FormControl><Textarea placeholder="Describe a meaningful interaction with a teacher..." className="min-h-[120px]" {...field} value={field.value || ""} /></FormControl>
          <FormMessage />
        </FormItem>
      )} />
    </div>
  );
}
