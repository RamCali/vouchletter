"use client";

import { useFormContext } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Lightbulb, Eye, TrendingUp, Users, GraduationCap, Star, Heart, Lock } from "lucide-react";
import { RATING_OPTIONS, type CompleteBragSheetData } from "@/lib/validations/brag-sheet";

// Move Section component outside to avoid recreating it during render
function Section({ icon: Icon, title, content, iconColor }: { icon: React.ElementType; title: string; content: string | undefined; iconColor: string }) {
  return (
    <div className="border-b pb-4 last:border-b-0 last:pb-0">
      <div className="flex items-center gap-2 mb-2"><Icon className={`h-4 w-4 ${iconColor}`} /><h4 className="font-medium text-sm">{title}</h4></div>
      <p className="text-sm text-muted-foreground whitespace-pre-wrap">{content || <span className="italic">Not provided</span>}</p>
    </div>
  );
}

export function ReviewStep({ userRole }: { userRole: "student" | "counselor" }) {
  const form = useFormContext<CompleteBragSheetData>();
  const values = form.getValues();

  return (
    <div className="space-y-6">
      <div><h3 className="text-lg font-semibold mb-1">Review Your Responses</h3><p className="text-sm text-muted-foreground">Please review your answers before submitting.</p></div>

      <Card>
        <CardHeader className="pb-3"><CardTitle className="text-base">Section 1: The Hook</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <Section icon={Sparkles} title="Three Words" content={values.threeWords} iconColor="text-amber-500" />
          <Section icon={Lightbulb} title="Intellectual Spark" content={values.intellectualSpark} iconColor="text-yellow-500" />
          <Section icon={Eye} title="Unseen Factor" content={values.unseenFactor} iconColor="text-purple-500" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3"><CardTitle className="text-base">Section 2: The Proof</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <Section icon={TrendingUp} title="Struggle Story" content={values.struggleStory} iconColor="text-blue-500" />
          <Section icon={Users} title="Leadership Moment" content={values.leadershipMoment} iconColor="text-green-500" />
          <Section icon={GraduationCap} title="Classroom Connection" content={values.classroomInteraction} iconColor="text-orange-500" />
        </CardContent>
      </Card>

      {userRole === "counselor" && (
        <Card className="border-amber-200 bg-amber-50/50">
          <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><Lock className="h-4 w-4 text-amber-600" />Section 3: Counselor Metadata</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="border-b pb-4">
              <div className="flex items-center gap-2 mb-2"><Star className="h-4 w-4 text-yellow-500" /><h4 className="font-medium text-sm">Student Rating</h4></div>
              <span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">{RATING_OPTIONS.find(o => o.value === values.studentRating)?.label || "Not set"}</span>
            </div>
            <div className="border-b pb-4">
              <div className="flex items-center gap-2 mb-2"><Heart className="h-4 w-4 text-red-500" /><h4 className="font-medium text-sm">First Gen / Low Income</h4></div>
              <p className="text-sm text-muted-foreground">{values.isFirstGenLowIncome ? "Yes" : "No"}</p>
            </div>
            {values.counselorNotes && <div><h4 className="font-medium text-sm mb-2">Internal Notes</h4><p className="text-sm text-muted-foreground whitespace-pre-wrap">{values.counselorNotes}</p></div>}
          </CardContent>
        </Card>
      )}

      <div className="p-4 bg-muted rounded-lg"><p className="text-sm text-muted-foreground text-center">By submitting, you confirm that the information provided is accurate and complete.</p></div>
    </div>
  );
}
