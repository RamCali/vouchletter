"use client";

import { useState } from "react";
import {
  Box,
  Paper,
  Tabs,
  Tab,
  Typography,
  Chip,
  Stack,
  IconButton,
  Tooltip,
  Card,
  CardContent,
  Divider,
  Rating,
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import AssessmentIcon from "@mui/icons-material/Assessment";
import CheckIcon from "@mui/icons-material/Check";

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

interface Student {
  firstName: string;
  lastName: string;
  grade: number;
  gpa: number | null;
}

function InsertableSnippet({
  title,
  content,
  onInsert,
  isAdded,
}: {
  title: string;
  content: string;
  onInsert?: (text: string) => void;
  isAdded?: boolean;
}) {
  const handleInsert = () => {
    if (isAdded) return;
    onInsert?.(content);
  };

  return (
    <Card
      variant="outlined"
      sx={{
        mb: 1.5,
        transition: "all 0.2s ease",
        borderColor: isAdded ? "success.main" : "divider",
        bgcolor: isAdded ? "success.50" : "background.paper",
        opacity: isAdded ? 0.7 : 1,
      }}
    >
      <CardContent sx={{ py: 1.25, px: 1.5, "&:last-child": { pb: 1.25 } }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1}>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant="caption"
              sx={{
                fontWeight: 600,
                color: isAdded ? "success.dark" : "text.secondary",
                fontSize: "0.7rem",
              }}
            >
              {isAdded ? `✓ ${title}` : title}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontSize: "0.85rem",
                lineHeight: 1.5,
                mt: 0.25,
                color: isAdded ? "text.secondary" : "text.primary",
              }}
            >
              {content}
            </Typography>
          </Box>
          <Tooltip title={isAdded ? "Already in letter" : "Add to letter"}>
            <span>
              <IconButton
                size="small"
                onClick={handleInsert}
                disabled={isAdded}
                sx={{
                  bgcolor: isAdded ? "success.main" : "primary.50",
                  color: isAdded ? "white" : "primary.main",
                  width: 28,
                  height: 28,
                  "&:hover": {
                    bgcolor: isAdded ? "success.main" : "primary.100",
                  },
                  "&.Mui-disabled": {
                    bgcolor: "success.main",
                    color: "white",
                  },
                }}
              >
                {isAdded ? (
                  <CheckIcon sx={{ fontSize: 16 }} />
                ) : (
                  <ArrowForwardIcon sx={{ fontSize: 16 }} />
                )}
              </IconButton>
            </span>
          </Tooltip>
        </Stack>
      </CardContent>
    </Card>
  );
}

const ratingMap: Record<string, number> = {
  TOP_1_PERCENT: 5,
  TOP_5_PERCENT: 4.5,
  TOP_10_PERCENT: 4,
  TOP_25_PERCENT: 3,
  TOP_50_PERCENT: 2,
};
const ratingLabels: Record<string, string> = {
  TOP_1_PERCENT: "Top 1%",
  TOP_5_PERCENT: "Top 5%",
  TOP_10_PERCENT: "Top 10%",
  TOP_25_PERCENT: "Top 25%",
  TOP_50_PERCENT: "Top 50%",
};

export function BrainPanel({
  student,
  bragSheet,
  onInsertToCanvas,
}: {
  student: Student;
  bragSheet: BragSheet;
  onInsertToCanvas?: (text: string) => void;
}) {
  const [tab, setTab] = useState(0);
  const [addedContent, setAddedContent] = useState<Set<string>>(new Set());

  // Track and insert content - prevents duplicate insertions
  const handleInsert = (content: string) => {
    if (addedContent.has(content)) return;
    setAddedContent((prev) => new Set(prev).add(content));
    onInsertToCanvas?.(content);
  };

  // Handle word chip click - insert with formatting
  const handleWordInsert = (word: string) => {
    handleInsert(word);
  };

  return (
    <Paper
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        border: "1px solid",
        borderColor: "divider",
      }}
    >
      {/* Header */}
      <Box sx={{ px: 2, py: 1.25, borderBottom: 1, borderColor: "divider", bgcolor: "grey.50" }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, fontSize: "0.95rem" }}>
              The Brain
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.7rem" }}>
              Click → to add to letter
            </Typography>
          </Box>
        </Stack>
      </Box>

      {/* Tabs */}
      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        sx={{
          minHeight: 40,
          borderBottom: 1,
          borderColor: "divider",
          "& .MuiTab-root": { minHeight: 40, py: 0 },
        }}
        variant="fullWidth"
      >
        <Tab
          icon={<LightbulbIcon sx={{ fontSize: 16 }} />}
          iconPosition="start"
          label="Hook"
          sx={{ fontSize: "0.75rem", minWidth: 0, px: 1 }}
        />
        <Tab
          icon={<EmojiEventsIcon sx={{ fontSize: 16 }} />}
          iconPosition="start"
          label="Proof"
          sx={{ fontSize: "0.75rem", minWidth: 0, px: 1 }}
        />
        <Tab
          icon={<AssessmentIcon sx={{ fontSize: 16 }} />}
          iconPosition="start"
          label="Stats"
          sx={{ fontSize: "0.75rem", minWidth: 0, px: 1 }}
        />
      </Tabs>

      {/* Content */}
      <Box sx={{ flex: 1, overflow: "auto", p: 1.5 }}>
        {tab === 0 && (
          <>
            <Typography
              variant="caption"
              sx={{
                fontWeight: 600,
                color: "text.secondary",
                fontSize: "0.65rem",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Three Words
            </Typography>
            <Stack direction="row" spacing={0.75} sx={{ mb: 2, mt: 0.75, flexWrap: "wrap", gap: 0.75 }}>
              {bragSheet.threeWords.map((w, i) => {
                const isWordAdded = addedContent.has(w);
                return (
                  <Chip
                    key={i}
                    label={isWordAdded ? `✓ ${w}` : w}
                    size="small"
                    color={isWordAdded ? "success" : "primary"}
                    variant={isWordAdded ? "filled" : "outlined"}
                    onClick={isWordAdded ? undefined : () => handleWordInsert(w)}
                    deleteIcon={isWordAdded ? <CheckIcon sx={{ fontSize: 14 }} /> : <ArrowForwardIcon sx={{ fontSize: 14 }} />}
                    onDelete={isWordAdded ? undefined : () => handleWordInsert(w)}
                    sx={{
                      fontSize: "0.75rem",
                      height: 26,
                      cursor: isWordAdded ? "default" : "pointer",
                      opacity: isWordAdded ? 0.7 : 1,
                      "&:hover": isWordAdded ? {} : { bgcolor: "primary.50" },
                    }}
                  />
                );
              })}
            </Stack>
            {bragSheet.intellectualSpark && (
              <InsertableSnippet
                title="Intellectual Spark"
                content={bragSheet.intellectualSpark}
                onInsert={handleInsert}
                isAdded={addedContent.has(bragSheet.intellectualSpark)}
              />
            )}
          </>
        )}

        {tab === 1 && (
          <>
            {bragSheet.struggleStory && (
              <InsertableSnippet
                title="Struggle Story"
                content={bragSheet.struggleStory}
                onInsert={handleInsert}
                isAdded={addedContent.has(bragSheet.struggleStory)}
              />
            )}
            {bragSheet.leadershipMoment && (
              <InsertableSnippet
                title="Leadership Moment"
                content={bragSheet.leadershipMoment}
                onInsert={handleInsert}
                isAdded={addedContent.has(bragSheet.leadershipMoment)}
              />
            )}
            {bragSheet.keyAnecdotes?.map((a, i) => (
              <InsertableSnippet
                key={i}
                title={a.title}
                content={a.description}
                onInsert={handleInsert}
                isAdded={addedContent.has(a.description)}
              />
            ))}
          </>
        )}

        {tab === 2 && (
          <>
            <Card variant="outlined" sx={{ mb: 1.5 }}>
              <CardContent sx={{ py: 1.25, "&:last-child": { pb: 1.25 } }}>
                <Stack direction="row" justifyContent="space-around" alignItems="center" sx={{ mb: 1.5 }}>
                  <Box sx={{ textAlign: "center" }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.65rem" }}>
                      GPA
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                      {student.gpa?.toFixed(2) || "N/A"}
                    </Typography>
                  </Box>
                  <Divider orientation="vertical" flexItem />
                  <Box sx={{ textAlign: "center" }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.65rem" }}>
                      Grade
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                      {student.grade}
                    </Typography>
                  </Box>
                </Stack>
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.65rem" }}>
                  Counselor Rating
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
                  <Rating
                    value={ratingMap[bragSheet.counselorRating || ""] || 3}
                    precision={0.5}
                    readOnly
                    size="small"
                  />
                  <Chip
                    label={ratingLabels[bragSheet.counselorRating || ""] || "N/A"}
                    size="small"
                    color="primary"
                    sx={{ height: 22, fontSize: "0.7rem" }}
                  />
                </Stack>
              </CardContent>
            </Card>
            {bragSheet.transcriptNotes && (
              <InsertableSnippet
                title="Transcript Highlights"
                content={bragSheet.transcriptNotes}
                onInsert={handleInsert}
                isAdded={addedContent.has(bragSheet.transcriptNotes)}
              />
            )}
          </>
        )}
      </Box>
    </Paper>
  );
}
