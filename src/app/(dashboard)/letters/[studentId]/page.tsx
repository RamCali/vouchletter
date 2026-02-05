"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Box,
  Typography,
  Stack,
  IconButton,
  Breadcrumbs,
  Link as MuiLink,
  Snackbar,
  Alert,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Link from "next/link";
import { BrainPanel } from "@/components/studio/BrainPanel";
import { CanvasPanel } from "@/components/studio/CanvasPanel";

// Types for demo data
interface Student {
  firstName: string;
  lastName: string;
  grade: number;
  gpa: number;
}

interface Activity {
  name: string;
  role: string;
  years: number;
  description: string;
}

interface Award {
  name: string;
  year: number;
  description: string;
}

interface Anecdote {
  title: string;
  description: string;
}

interface BragSheet {
  threeWords: string[];
  intellectualSpark: string;
  struggleStory: string;
  leadershipMoment: string;
  keyAnecdotes: Anecdote[];
  counselorRating: string;
  transcriptNotes: string;
  activities: Activity[];
  awards: Award[];
}

interface Letter {
  content: string;
  tone: "WARM" | "ACADEMIC" | "ADVOCACY";
  angle: "RESILIENCE" | "STEM" | "COMMUNITY";
}

interface DemoDataEntry {
  student: Student;
  bragSheet: BragSheet;
  letter: Letter;
}

// Demo data - in production this would come from database
const DEMO_DATA: Record<string, DemoDataEntry> = {
  "1": {
    student: {
      firstName: "John",
      lastName: "Doe",
      grade: 12,
      gpa: 3.85,
    },
    bragSheet: {
      threeWords: ["curious", "resilient", "leader"],
      intellectualSpark:
        "Obsessed with robotics after building a line-following robot in 9th grade that won regional competition",
      struggleStory:
        "When the robotics team lost funding sophomore year, John organized a crowdfunding campaign and corporate sponsorship outreach that raised $15,000, keeping the program alive.",
      leadershipMoment:
        "As robotics team captain, mentored 8 underclassmen and implemented a peer teaching system that improved team skill levels across the board.",
      keyAnecdotes: [
        {
          title: "The Server Room Incident",
          description:
            "Stayed after school for 3 weeks debugging a server issue, eventually discovering a hardware fault that the IT team had missed.",
        },
        {
          title: "Community Impact",
          description:
            "Organized STEM workshops at local elementary schools, reaching 200+ students.",
        },
      ],
      counselorRating: "TOP_5_PERCENT",
      transcriptNotes:
        "4 AP courses (CS, Physics, Calc BC, Stats). Strongest in STEM subjects. Writing has improved significantly.",
      activities: [
        { name: "Robotics Team", role: "Captain", years: 4, description: "Led team to state finals" },
        { name: "Math Club", role: "President", years: 3, description: "Organized competitions" },
        { name: "Tutoring Center", role: "Volunteer", years: 2, description: "Peer tutoring in STEM" },
      ],
      awards: [
        { name: "Regional Robotics Champion", year: 2024, description: "" },
        { name: "AP Scholar with Distinction", year: 2024, description: "" },
        { name: "Principal's Honor Roll", year: 2024, description: "" },
      ],
    },
    letter: {
      content: "",
      tone: "WARM" as const,
      angle: "STEM" as const,
    },
  },
  "2": {
    student: {
      firstName: "Sarah",
      lastName: "Miller",
      grade: 12,
      gpa: 3.72,
    },
    bragSheet: {
      threeWords: ["empathetic", "determined", "creative"],
      intellectualSpark:
        "Became passionate about environmental science after volunteering at a local watershed cleanup",
      struggleStory:
        "Overcame learning differences (dyslexia) to become one of the top students in AP English, developing unique study strategies that she now shares with other students facing similar challenges.",
      leadershipMoment:
        "Founded the school's first Environmental Action Club, growing it from 5 to 45 members in one year.",
      keyAnecdotes: [
        {
          title: "The Policy Change",
          description:
            "Presented to the school board about single-use plastics, resulting in new sustainability policies.",
        },
      ],
      counselorRating: "TOP_10_PERCENT",
      transcriptNotes:
        "Strong upward trend. Started with B average, now straight A student. Exceptional growth in humanities.",
      activities: [
        { name: "Environmental Club", role: "Founder/President", years: 2, description: "Started from scratch" },
        { name: "Debate Team", role: "Member", years: 3, description: "State qualifier" },
      ],
      awards: [
        { name: "Environmental Leadership Award", year: 2024, description: "" },
        { name: "Most Improved Student", year: 2023, description: "" },
      ],
    },
    letter: {
      content: "",
      tone: "ADVOCACY" as const,
      angle: "RESILIENCE" as const,
    },
  },
  "3": {
    student: {
      firstName: "Michael",
      lastName: "Chen",
      grade: 12,
      gpa: 4.0,
    },
    bragSheet: {
      threeWords: ["analytical", "compassionate", "dedicated"],
      intellectualSpark:
        "Developed a machine learning model to predict hospital readmission rates during a summer research internship",
      struggleStory:
        "As a first-generation college student, navigated the application process largely independently while supporting younger siblings.",
      leadershipMoment:
        "Created a peer counseling program for first-gen students, personally mentoring 12 students through their college applications.",
      keyAnecdotes: [
        {
          title: "Research Breakthrough",
          description:
            "Research paper accepted to a regional science conference - youngest presenter in the healthcare track.",
        },
      ],
      counselorRating: "TOP_1_PERCENT",
      transcriptNotes:
        "Perfect GPA. 6 AP courses. Research experience at university level. Strongest candidate in recent memory.",
      activities: [
        { name: "Science Research", role: "Lead Researcher", years: 2, description: "Published work" },
        { name: "First-Gen Mentors", role: "Founder", years: 1, description: "Peer support program" },
        { name: "Hospital Volunteer", role: "Volunteer", years: 3, description: "200+ hours" },
      ],
      awards: [
        { name: "National Merit Finalist", year: 2024, description: "" },
        { name: "Science Fair 1st Place", year: 2024, description: "" },
        { name: "Community Service Award", year: 2024, description: "" },
      ],
    },
    letter: {
      content:
        "I am writing to offer my strongest possible recommendation for Michael Chen, a truly exceptional student who represents the very best of our school community.\n\nIn my 15 years as a guidance counselor, I have rarely encountered a student who combines Michael's intellectual gifts with such genuine compassion for others. His 4.0 GPA and six AP courses tell only part of the story – what sets Michael apart is how he uses his talents to lift others.\n\nAs a first-generation college student, Michael has navigated challenges that many of his peers cannot imagine. Rather than letting these obstacles define him, he has transformed them into opportunities for growth and service. He founded our school's First-Gen Mentors program, personally guiding 12 students through the college application process. His empathy for fellow first-gen students stems from his own experience, and his program has become a model that other schools in our district are now adopting.\n\nMichael's research accomplishments are equally impressive. During a summer internship at the university hospital, he developed a machine learning model to predict patient readmission rates – work that was presented at a regional science conference where he was the youngest speaker in the healthcare track. His analytical abilities are matched only by his work ethic and his genuine desire to use technology to help people.\n\nI place Michael in the top 1% of students I have counseled. He will make an immediate and lasting contribution to any university community fortunate enough to welcome him.",
      tone: "WARM" as const,
      angle: "COMMUNITY" as const,
    },
  },
};

// Demo AI generation function
async function generateLetter(
  student: Student,
  bragSheet: BragSheet,
  tone: string,
  angle: string
): Promise<string> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const toneIntro: Record<string, string> = {
    WARM: "I am delighted to recommend",
    ACADEMIC: "I write to provide my assessment of",
    ADVOCACY: "I am writing with my strongest possible recommendation for",
  };

  const angleEmphasis: Record<string, string> = {
    RESILIENCE: `What sets ${student.firstName} apart is their remarkable resilience. ${bragSheet.struggleStory}`,
    STEM: `${student.firstName}'s technical abilities are exceptional. ${bragSheet.intellectualSpark}`,
    COMMUNITY: `${student.firstName} demonstrates extraordinary commitment to community. ${bragSheet.leadershipMoment}`,
  };

  return `${toneIntro[tone] || toneIntro.WARM} ${student.firstName} ${student.lastName}, a student who exemplifies the qualities we value most highly.

${student.firstName} can be described in three words: ${bragSheet.threeWords.join(", ")}. These aren't mere descriptors – they reflect who ${student.firstName} truly is.

${angleEmphasis[angle] || angleEmphasis.RESILIENCE}

With a GPA of ${student.gpa} and demonstrated leadership in ${bragSheet.activities?.[0]?.name || "multiple activities"}, ${student.firstName} has proven themselves academically and personally.

I rank ${student.firstName} in the ${bragSheet.counselorRating?.replace("_", " ").toLowerCase() || "top tier"} of students I have counseled. They will make an immediate contribution to any campus community.`;
}

export default function VouchStudioPage() {
  const params = useParams();
  const router = useRouter();
  const studentId = params.studentId as string;

  // Get demo data
  const data = DEMO_DATA[studentId];

  // All hooks must be called before any early returns
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "info" | "warning" | "error";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  const [letterContent, setLetterContent] = useState(data?.letter?.content || "");

  // Now we can do early returns after all hooks
  if (!data) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Typography variant="h5" color="text.secondary">
          Student not found
        </Typography>
        <Link href="/letters">
          <MuiLink sx={{ mt: 2, display: "inline-block" }}>Back to Letters</MuiLink>
        </Link>
      </Box>
    );
  }

  const { student, bragSheet, letter } = data;

  const handleCopySnippet = (text: string) => {
    navigator.clipboard.writeText(text);
    setSnackbar({
      open: true,
      message: "Copied to clipboard",
      severity: "info",
    });
  };

  const handleGenerate = async (tone: string, angle: string): Promise<string> => {
    const generated = await generateLetter(student, bragSheet, tone, angle);
    setLetterContent(generated);
    setSnackbar({
      open: true,
      message: "Letter generated successfully",
      severity: "success",
    });
    return generated;
  };

  const handleSave = (content: string, tone: string, angle: string) => {
    // In production, this would save to database
    console.log("Saving:", { content, tone, angle });
  };

  const handleExport = () => {
    setSnackbar({
      open: true,
      message: "Letter exported to Common App format",
      severity: "success",
    });
  };

  return (
    <Box sx={{ height: "calc(100vh - 64px - 48px)", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <Stack
        direction="row"
        alignItems="center"
        spacing={2}
        sx={{ mb: 2 }}
      >
        <IconButton onClick={() => router.push("/letters")}>
          <ArrowBackIcon />
        </IconButton>
        <Breadcrumbs>
          <Link href="/letters" passHref legacyBehavior>
            <MuiLink color="inherit" underline="hover">
              Letters
            </MuiLink>
          </Link>
          <Typography color="text.primary">
            {student.firstName} {student.lastName}
          </Typography>
        </Breadcrumbs>
      </Stack>

      {/* Split Screen */}
      <Box
        sx={{
          flex: 1,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 2,
          minHeight: 0,
        }}
      >
        {/* Left Panel - The Brain */}
        <BrainPanel
          student={student}
          bragSheet={bragSheet}
          onCopySnippet={handleCopySnippet}
        />

        {/* Right Panel - The Canvas */}
        <CanvasPanel
          studentName={`${student.firstName} ${student.lastName}`}
          initialContent={letterContent}
          initialTone={letter.tone}
          initialAngle={letter.angle}
          onGenerate={handleGenerate}
          onSave={handleSave}
          onExport={handleExport}
        />
      </Box>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
