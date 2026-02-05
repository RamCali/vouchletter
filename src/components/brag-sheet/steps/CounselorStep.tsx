"use client";

import { useFormContext } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Lock, Star, Heart } from "lucide-react";
import { RATING_OPTIONS, type CompleteBragSheetData } from "@/lib/validations/brag-sheet";

export function CounselorStep() {
  const form = useFormContext<CompleteBragSheetData>();

  const ratingToSlider = (rating: string | undefined): number => {
    switch (rating) { case "top_1_percent": return 100; case "top_5_percent": return 66; case "top_10_percent": return 33; default: return 0; }
  };

  const sliderToRating = (pos: number): "top_1_percent" | "top_5_percent" | "top_10_percent" | "average" => {
    if (pos >= 83) return "top_1_percent"; if (pos >= 50) return "top_5_percent"; if (pos >= 17) return "top_10_percent"; return "average";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 p-3 bg-amber-50 rounded-lg border border-amber-200">
        <Lock className="h-5 w-5 text-amber-600 shrink-0" />
        <div>
          <p className="font-medium text-amber-800">Counselor&apos;s Secret Sauce</p>
          <p className="text-sm text-amber-700">This information is only visible to counselors and is never shared with students.</p>
        </div>
      </div>

      <FormField control={form.control} name="studentRating" render={({ field }) => (
        <FormItem>
          <FormLabel className="flex items-center gap-2"><Star className="h-4 w-4 text-yellow-500" />Student Rating</FormLabel>
          <FormDescription>Where does this student rank compared to others you have worked with?</FormDescription>
          <FormControl>
            <div className="pt-4 pb-2">
              <Slider value={[ratingToSlider(field.value)]} onValueChange={([v]) => field.onChange(sliderToRating(v))} max={100} step={1} />
              <div className="flex justify-between mt-2 text-xs text-muted-foreground"><span>Average</span><span>Top 10%</span><span>Top 5%</span><span>Top 1%</span></div>
              <div className="text-center mt-3">
                <span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                  {RATING_OPTIONS.find(o => o.value === field.value)?.label || "Select rating"}
                </span>
              </div>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )} />

      <FormField control={form.control} name="isFirstGenLowIncome" render={({ field }) => (
        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
          <div className="space-y-0.5">
            <FormLabel className="flex items-center gap-2"><Heart className="h-4 w-4 text-red-500" />First Generation / Low Income</FormLabel>
            <FormDescription>Is this student first generation to attend college or from a low-income background?</FormDescription>
          </div>
          <FormControl><Switch checked={field.value || false} onCheckedChange={field.onChange} /></FormControl>
        </FormItem>
      )} />

      <FormField control={form.control} name="counselorNotes" render={({ field }) => (
        <FormItem>
          <FormLabel>Internal Notes (Optional)</FormLabel>
          <FormDescription>Any additional context for letter generation.</FormDescription>
          <FormControl><Textarea placeholder="Add any additional context..." className="min-h-[100px]" {...field} value={field.value || ""} /></FormControl>
          <FormMessage />
        </FormItem>
      )} />
    </div>
  );
}
