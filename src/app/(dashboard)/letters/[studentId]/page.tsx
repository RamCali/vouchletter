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

// Demo data - 6 students matching the letters list page
const DEMO_DATA: Record<string, DemoDataEntry> = {
  // === DUE THIS WEEK (2 students) ===
  "1": {
    student: {
      firstName: "Marcus",
      lastName: "Demo",
      grade: 12,
      gpa: 3.92,
    },
    bragSheet: {
      threeWords: ["innovative", "persistent", "collaborative"],
      intellectualSpark:
        "Built a solar-powered water purification system for his family's farm in rural Guatemala after witnessing water scarcity during a summer visit. The project evolved into a nonprofit that has installed 15 systems across Central America.",
      struggleStory:
        "When his father was laid off during sophomore year, Marcus took on a part-time job while maintaining his GPA. He learned to manage time ruthlessly and discovered a resilience he didn't know he had.",
      leadershipMoment:
        "Transformed the struggling robotics club from 6 members to 32 by creating a 'build your first robot in a weekend' workshop series. Three of his recruits are now team captains.",
      keyAnecdotes: [
        {
          title: "The 3AM Breakthrough",
          description:
            "During the state robotics competition, their robot's arm failed. While teammates slept, Marcus redesigned and 3D-printed a new mechanism overnight. They placed 2nd.",
        },
        {
          title: "Teaching Moment",
          description:
            "Noticed a freshman struggling with physics concepts and created a peer tutoring system that now serves 40+ students weekly.",
        },
      ],
      counselorRating: "TOP_5_PERCENT",
      transcriptNotes:
        "5 AP courses including Physics C and CS A. Perfect scores in STEM. Strong upward trend in humanities. SAT: 1520.",
      activities: [
        { name: "Robotics Team", role: "President & Lead Engineer", years: 4, description: "State finalists 2 years" },
        { name: "Engineering Club", role: "Founder", years: 2, description: "Started from scratch" },
        { name: "Peer Tutoring", role: "Coordinator", years: 2, description: "40+ students served" },
        { name: "Water4All Nonprofit", role: "Founder", years: 2, description: "15 systems installed" },
      ],
      awards: [
        { name: "State Robotics Finalist", year: 2025, description: "2nd place overall" },
        { name: "AP Scholar with Distinction", year: 2025, description: "" },
        { name: "Community Impact Award", year: 2024, description: "For Water4All project" },
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
      firstName: "Priya",
      lastName: "Demo",
      grade: 12,
      gpa: 3.97,
    },
    bragSheet: {
      threeWords: ["curious", "empathetic", "driven"],
      intellectualSpark:
        "After her grandmother's Alzheimer's diagnosis, Priya became fascinated with neuroscience. She secured a summer research position at the university hospital studying biomarkers for early detection, co-authoring a paper now under peer review.",
      struggleStory:
        "As the first in her family to navigate the US college system, Priya faced constant cultural expectations to prioritize family obligations over academics. She found a way to honor both, becoming a bridge between her traditional family and her ambitious goals.",
      leadershipMoment:
        "Created a 'Science Sisters' mentorship program pairing female STEM students with middle schoolers. The program has served 150 girls and increased female enrollment in AP sciences by 40%.",
      keyAnecdotes: [
        {
          title: "The Research Presentation",
          description:
            "Presented Alzheimer's research findings to a room of 200 medical professionals at a regional conference. Received standing ovation and multiple collaboration offers.",
        },
        {
          title: "Cultural Bridge",
          description:
            "Organized a 'Careers in STEM' workshop in Hindi and Gujarati for immigrant parents, helping families understand and support their children's aspirations.",
        },
      ],
      counselorRating: "TOP_1_PERCENT",
      transcriptNotes:
        "6 AP courses, all 5s. Research published. Perfect score in AP Biology. National Merit Semifinalist. SAT: 1560.",
      activities: [
        { name: "Hospital Research", role: "Research Assistant", years: 2, description: "Co-authored paper" },
        { name: "Science Sisters", role: "Founder & Director", years: 2, description: "150 girls mentored" },
        { name: "Model UN", role: "Secretary General", years: 3, description: "Led delegation to nationals" },
        { name: "Indian Classical Dance", role: "Performer", years: 10, description: "Cultural preservation" },
      ],
      awards: [
        { name: "National Merit Semifinalist", year: 2025, description: "" },
        { name: "Regional Science Fair - 1st Place", year: 2024, description: "Neuroscience category" },
        { name: "STEM Excellence Award", year: 2024, description: "District-wide recognition" },
      ],
    },
    letter: {
      content: "I am writing with my strongest possible endorsement for Priya Demo, an extraordinary young scientist and community leader who represents the very best of what education can produce.\n\nIn my 18 years as a guidance counselor, I have never encountered a student who so seamlessly combines rigorous academic achievement with genuine compassion for others. Priya's 3.97 GPA and six AP courses (all scored 5) merely hint at her intellectual capabilities. What truly distinguishes her is how she channels her brilliance toward solving real human problems.\n\nWhen Priya's grandmother was diagnosed with Alzheimer's disease, most students would have been devastated. Priya was devastated – and then she got to work. She secured a research position at our local university hospital, spending her summer studying biomarkers for early Alzheimer's detection. Her work contributed to a paper now under peer review in a respected medical journal. She was 16 years old.\n\nBut Priya's impact extends far beyond the laboratory. Recognizing the underrepresentation of women in STEM, she founded 'Science Sisters,' a mentorship program that has now served 150 middle school girls. Since the program's inception, female enrollment in our AP science courses has increased by 40%. Priya doesn't just excel – she lifts others as she rises.\n\nI place Priya in the top 1% of students I have ever counseled. She will transform whatever institution is fortunate enough to welcome her.",
      tone: "ADVOCACY" as const,
      angle: "STEM" as const,
    },
  },

  // === WAITING ON STUDENT (2 students - partial brag sheets) ===
  "3": {
    student: {
      firstName: "Jordan",
      lastName: "Demo",
      grade: 12,
      gpa: 3.45,
    },
    bragSheet: {
      threeWords: ["creative", "expressive", "authentic"],
      intellectualSpark:
        "Discovered passion for theater after a middle school production of 'Our Town.' Has since performed in 12 productions and directed 2 student-written plays.",
      struggleStory: "", // Not yet completed
      leadershipMoment: "", // Not yet completed
      keyAnecdotes: [
        {
          title: "Standing Ovation",
          description:
            "Lead role in 'The Crucible' earned a standing ovation and a review in the local newspaper praising 'remarkable emotional depth.'",
        },
      ],
      counselorRating: "TOP_10_PERCENT",
      transcriptNotes:
        "Strong in humanities and arts. 3 AP courses. Active in drama and music programs. Shows exceptional emotional intelligence.",
      activities: [
        { name: "Drama Club", role: "President", years: 4, description: "Lead roles in 8 productions" },
        { name: "A Cappella Group", role: "Vocal Director", years: 3, description: "Arranged 15 songs" },
      ],
      awards: [
        { name: "Best Actor - Regional Theater", year: 2024, description: "" },
        { name: "Arts Excellence Award", year: 2024, description: "" },
      ],
    },
    letter: {
      content: "",
      tone: "WARM" as const,
      angle: "COMMUNITY" as const,
    },
  },
  "4": {
    student: {
      firstName: "Aaliyah",
      lastName: "Demo",
      grade: 12,
      gpa: 3.78,
    },
    bragSheet: {
      threeWords: ["passionate", "articulate", "fearless"],
      intellectualSpark:
        "Became interested in social justice after witnessing housing discrimination against her family. Now interns with a civil rights law firm and has testified before the city council on housing equity.",
      struggleStory:
        "Growing up in a single-parent household with three younger siblings, Aaliyah often had to be the adult in the room. She managed household responsibilities while excelling academically.",
      leadershipMoment: "", // Not yet completed
      keyAnecdotes: [
        {
          title: "City Council Testimony",
          description:
            "At 16, testified before the city council about housing discrimination. Her testimony helped pass new tenant protection ordinances.",
        },
      ],
      counselorRating: "TOP_5_PERCENT",
      transcriptNotes:
        "4 AP courses with strong performance in History and Government. Exceptional public speaker. Editor of school newspaper.",
      activities: [
        { name: "Civil Rights Law Firm", role: "Intern", years: 1, description: "Research and advocacy" },
        { name: "School Newspaper", role: "Editor-in-Chief", years: 2, description: "Investigative journalism" },
        { name: "Debate Team", role: "Captain", years: 3, description: "State qualifier" },
      ],
      awards: [
        { name: "Young Advocate Award", year: 2024, description: "City recognition" },
        { name: "State Debate Finalist", year: 2024, description: "" },
      ],
    },
    letter: {
      content: "",
      tone: "ADVOCACY" as const,
      angle: "RESILIENCE" as const,
    },
  },

  // === COMPLETED YTD (2 students) ===
  "5": {
    student: {
      firstName: "Elena",
      lastName: "Demo",
      grade: 12,
      gpa: 3.88,
    },
    bragSheet: {
      threeWords: ["resilient", "warm", "determined"],
      intellectualSpark:
        "Fascinated by the intersection of business and social impact. Started a small business selling handmade jewelry, donating 50% of profits to scholarship funds for first-generation college students like herself.",
      struggleStory:
        "As a first-generation American whose parents work multiple jobs, Elena has translated documents, attended parent-teacher conferences for her younger siblings, and navigated systems entirely unfamiliar to her family. She does this while maintaining near-perfect grades and working 15 hours a week.",
      leadershipMoment:
        "Founded the First-Gen Student Alliance at her school, creating a support network that has helped 45 first-gen students navigate college applications and financial aid.",
      keyAnecdotes: [
        {
          title: "The Scholarship Essay Workshop",
          description:
            "Organized free essay workshops for first-gen students after realizing many had never seen a personal statement. 28 participants earned over $150,000 in combined scholarships.",
        },
        {
          title: "Business for Good",
          description:
            "Her jewelry business has donated $4,200 to scholarship funds while teaching her valuable entrepreneurship skills.",
        },
      ],
      counselorRating: "TOP_5_PERCENT",
      transcriptNotes:
        "4 AP courses. Strong across all subjects. Balances work, family responsibilities, and academics remarkably well. Natural leader. SAT: 1480.",
      activities: [
        { name: "First-Gen Alliance", role: "Founder & President", years: 2, description: "45 students supported" },
        { name: "Jewelry Business", role: "Owner", years: 3, description: "$4,200 donated to scholarships" },
        { name: "Part-time Job", role: "Retail Associate", years: 2, description: "15 hrs/week" },
        { name: "Spanish Honor Society", role: "Vice President", years: 2, description: "Heritage language" },
      ],
      awards: [
        { name: "Community Leadership Award", year: 2025, description: "District recognition" },
        { name: "Young Entrepreneur Award", year: 2024, description: "Chamber of Commerce" },
        { name: "AP Scholar", year: 2024, description: "" },
      ],
    },
    letter: {
      content: "I am honored to recommend Elena Demo, a remarkable young woman whose resilience, warmth, and determination have made her one of the most impactful students I have encountered in my career.\n\nElena's story is one of quiet heroism. As a first-generation American, she has served as her family's navigator through unfamiliar systems – translating documents, attending meetings for her working parents, and guiding her younger siblings through school. She does all of this while maintaining a 3.88 GPA, working 15 hours a week, and somehow finding time to lift others alongside her.\n\nRecognizing that other first-generation students faced similar challenges, Elena founded the First-Gen Student Alliance. What started as informal peer support has become an institutionalized program serving 45 students. Her essay workshops alone have helped participants earn over $150,000 in combined scholarships. Elena saw a need and built a solution.\n\nHer entrepreneurial spirit extends beyond advocacy. Elena started a jewelry business, donating 50% of profits to first-gen scholarship funds. She has contributed $4,200 while learning valuable business skills. This is who Elena is: someone who finds ways to help others even while facing her own challenges.\n\nElena doesn't describe herself as remarkable – she would say she's simply doing what needs to be done. But that humility, combined with her extraordinary capability, is precisely what makes her exceptional. I rank her in the top 5% of students I have counseled.\n\nAny institution would be fortunate to welcome Elena. She will not just succeed – she will make everyone around her better.",
      tone: "WARM" as const,
      angle: "COMMUNITY" as const,
    },
  },
  "6": {
    student: {
      firstName: "David",
      lastName: "Demo",
      grade: 12,
      gpa: 3.75,
    },
    bragSheet: {
      threeWords: ["disciplined", "supportive", "thoughtful"],
      intellectualSpark:
        "Became fascinated with sports psychology after reading about mental performance in athletics. Now studies how mindset affects performance and has implemented mental training programs for three school sports teams.",
      struggleStory:
        "After a severe knee injury ended his soccer career junior year, David had to rebuild his identity beyond athletics. He channeled his competitive drive into academics and discovered a passion for psychology that he never knew he had.",
      leadershipMoment:
        "As team captain, implemented 'mental performance Mondays' – weekly sessions on visualization, stress management, and team cohesion. The basketball team's free-throw percentage improved 15% and players reported feeling more confident under pressure.",
      keyAnecdotes: [
        {
          title: "The Comeback Story",
          description:
            "After his injury, coached the JV soccer team to their first winning season in 5 years while completing his own rehabilitation. Players say he taught them more about resilience than technique.",
        },
        {
          title: "Psychology in Action",
          description:
            "Designed and led a study on pre-game anxiety with 60 student-athletes, presented findings to the athletic department, resulting in new warm-up protocols.",
        },
      ],
      counselorRating: "TOP_10_PERCENT",
      transcriptNotes:
        "3 AP courses. Strong in sciences and psychology. Excellent team player. Character reference from three coaches. SAT: 1420.",
      activities: [
        { name: "Varsity Soccer", role: "Former Captain / JV Coach", years: 4, description: "Injury ended playing career" },
        { name: "Sports Psychology Club", role: "Founder", years: 1, description: "Mental performance training" },
        { name: "Peer Counseling", role: "Counselor", years: 2, description: "Athletic department liaison" },
        { name: "National Honor Society", role: "Member", years: 2, description: "" },
      ],
      awards: [
        { name: "Coaches Award", year: 2024, description: "For leadership after injury" },
        { name: "Student-Athlete of Character", year: 2024, description: "" },
        { name: "Psychology Research Recognition", year: 2024, description: "Athletic department" },
      ],
    },
    letter: {
      content: "I write to enthusiastically recommend David Demo, a young man whose character has been revealed not in moments of triumph, but in how he responded to adversity.\n\nDavid was on track to be one of our strongest soccer players – a varsity captain with college recruitment interest. Then, midway through his junior year, a severe knee injury ended his playing career. What happened next says everything about who David is.\n\nRather than retreat, David transformed. He became a JV coach, leading the team to their first winning season in five years. His players speak not about tactics, but about how David taught them to handle pressure, to support teammates, and to find joy in competition regardless of outcomes. He gave them what he had lost – and found something new in the process.\n\nDavid's injury sparked an intellectual curiosity about sports psychology. He founded our school's first Sports Psychology Club, implementing mental performance training for three varsity teams. His 'Mental Performance Mondays' sessions improved the basketball team's free-throw percentage by 15%. He also designed and conducted a study on pre-game anxiety with 60 student-athletes, presenting findings that changed our athletic department's warm-up protocols.\n\nDavid's 3.75 GPA reflects his academic abilities, but his real transcript is written in the lives he's touched. Three coaches independently submitted character references calling him 'the most mature high schooler they've worked with.'\n\nI place David in the top 10% of students I have counseled. He has already demonstrated the kind of character that many adults never develop. Any institution would benefit from his presence.",
      tone: "WARM" as const,
      angle: "RESILIENCE" as const,
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

${bragSheet.keyAnecdotes?.[0] ? `One story captures ${student.firstName}'s essence: ${bragSheet.keyAnecdotes[0].description}` : ""}

I rank ${student.firstName} in the ${bragSheet.counselorRating?.replace(/_/g, " ").toLowerCase() || "top tier"} of students I have counseled. They will make an immediate contribution to any campus community.`;
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

      {/* Split Screen - Responsive: stack on mobile, side-by-side on desktop */}
      <Box
        sx={{
          flex: 1,
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          gap: 2,
          minHeight: 0,
          overflow: { xs: "auto", md: "hidden" },
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
