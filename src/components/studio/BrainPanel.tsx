"use client";

import { useState } from "react";
import { Box, Paper, Tabs, Tab, Typography, Chip, Stack, IconButton, Tooltip, Card, CardContent, Divider, Rating } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import AssessmentIcon from "@mui/icons-material/Assessment";

interface BragSheet {
  threeWords: string[];
  intellectualSpark: string | null;
  struggleStory: string | null;
  leadershipMoment: string | null;
  keyAnecdotes: { title: string; description: string }[] | null;
  counselorRating: string | null;
  transcriptNotes: string | null;
  activities: { name: string; role: string; years: number }[] | null;
  awards: { name: string; year: number }[] | null;
}

interface Student { firstName: string; lastName: string; grade: number; gpa: number | null; }

function CopyableSnippet({ title, content, onCopy }: { title: string; content: string; onCopy?: (t: string) => void }) {
  return (
    <Card variant="outlined" sx={{ mb: 2 }}>
      <CardContent sx={{ py: 1.5, "&:last-child": { pb: 1.5 } }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
          <Typography variant="subtitle2" color="text.secondary">{title}</Typography>
          <Tooltip title="Copy"><IconButton size="small" onClick={() => { navigator.clipboard.writeText(content); onCopy?.(content); }}><ContentCopyIcon fontSize="small" /></IconButton></Tooltip>
        </Stack>
        <Typography variant="body2">{content}</Typography>
      </CardContent>
    </Card>
  );
}

const ratingMap: Record<string, number> = { TOP_1_PERCENT: 5, TOP_5_PERCENT: 4.5, TOP_10_PERCENT: 4, TOP_25_PERCENT: 3, TOP_50_PERCENT: 2 };
const ratingLabels: Record<string, string> = { TOP_1_PERCENT: "Top 1%", TOP_5_PERCENT: "Top 5%", TOP_10_PERCENT: "Top 10%", TOP_25_PERCENT: "Top 25%", TOP_50_PERCENT: "Top 50%" };

export function BrainPanel({ student, bragSheet, onCopySnippet }: { student: Student; bragSheet: BragSheet; onCopySnippet?: (t: string) => void }) {
  const [tab, setTab] = useState(0);

  return (
    <Paper sx={{ height: "100%", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <Box sx={{ px: 2, pt: 2, pb: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>The Brain</Typography>
        <Typography variant="caption" color="text.secondary">Context for {student.firstName} {student.lastName}</Typography>
      </Box>
      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ px: 2, borderBottom: 1, borderColor: "divider" }} variant="fullWidth">
        <Tab icon={<LightbulbIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="Hook" sx={{ minHeight: 48, minWidth: 0, px: 1 }} />
        <Tab icon={<EmojiEventsIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="Proof" sx={{ minHeight: 48, minWidth: 0, px: 1 }} />
        <Tab icon={<AssessmentIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="Stats" sx={{ minHeight: 48, minWidth: 0, px: 1 }} />
      </Tabs>
      <Box sx={{ flex: 1, overflow: "auto", px: 2, py: 2 }}>
        {tab === 0 && (
          <>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>Three Words</Typography>
            <Stack direction="row" spacing={1} sx={{ mb: 3 }}>{bragSheet.threeWords.map((w, i) => <Chip key={i} label={w} color="primary" variant="outlined" onClick={() => onCopySnippet?.(w)} />)}</Stack>
            {bragSheet.intellectualSpark && <CopyableSnippet title="Intellectual Spark" content={bragSheet.intellectualSpark} onCopy={onCopySnippet} />}
          </>
        )}
        {tab === 1 && (
          <>
            {bragSheet.struggleStory && <CopyableSnippet title="Struggle Story" content={bragSheet.struggleStory} onCopy={onCopySnippet} />}
            {bragSheet.leadershipMoment && <CopyableSnippet title="Leadership Moment" content={bragSheet.leadershipMoment} onCopy={onCopySnippet} />}
            {bragSheet.keyAnecdotes?.map((a, i) => <CopyableSnippet key={i} title={a.title} content={a.description} onCopy={onCopySnippet} />)}
          </>
        )}
        {tab === 2 && (
          <>
            <Card variant="outlined" sx={{ mb: 2 }}>
              <CardContent>
                <Stack direction="row" justifyContent="space-around" alignItems="center" sx={{ mb: 2 }}>
                  <Box sx={{ textAlign: "center" }}><Typography variant="caption" color="text.secondary">GPA</Typography><Typography variant="h5" sx={{ fontWeight: 700 }}>{student.gpa?.toFixed(2) || "N/A"}</Typography></Box>
                  <Divider orientation="vertical" flexItem />
                  <Box sx={{ textAlign: "center" }}><Typography variant="caption" color="text.secondary">Grade</Typography><Typography variant="h5" sx={{ fontWeight: 700 }}>{student.grade}</Typography></Box>
                </Stack>
                <Typography variant="caption" color="text.secondary">Counselor Rating</Typography>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Rating value={ratingMap[bragSheet.counselorRating || ""] || 3} precision={0.5} readOnly size="small" />
                  <Chip label={ratingLabels[bragSheet.counselorRating || ""] || "N/A"} size="small" color="primary" />
                </Stack>
              </CardContent>
            </Card>
            {bragSheet.transcriptNotes && <CopyableSnippet title="Transcript Highlights" content={bragSheet.transcriptNotes} onCopy={onCopySnippet} />}
          </>
        )}
      </Box>
    </Paper>
  );
}
