"use client";

import Link from "next/link";
import {
  Box,
  Avatar,
  Typography,
  Chip,
  Button,
  LinearProgress,
  Stack,
  IconButton,
  Tooltip,
  Paper,
} from "@mui/material";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import EditNoteIcon from "@mui/icons-material/EditNote";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AssignmentIcon from "@mui/icons-material/Assignment";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

type LetterStatus = "BLOCKED" | "DRAFT" | "REVIEW" | "COMPLETED";

interface StudentWithLetter {
  id: string;
  firstName: string;
  lastName: string;
  photoUrl: string | null;
  grade: number;
  bragSheet: { completionPercent: number } | null;
  letters: { id: string; status: LetterStatus; deadline: string | null }[];
}

interface TriageListProps {
  students: StudentWithLetter[];
  onNudge?: (studentId: string) => void;
}

const statusConfig: Record<
  LetterStatus,
  { label: string; color: "warning" | "info" | "secondary" | "success"; bgColor: string }
> = {
  BLOCKED: { label: "Waiting", color: "warning", bgColor: "warning.50" },
  DRAFT: { label: "Drafting", color: "info", bgColor: "info.50" },
  REVIEW: { label: "Review", color: "secondary", bgColor: "secondary.50" },
  COMPLETED: { label: "Done", color: "success", bgColor: "success.50" },
};

function formatDeadline(deadline: string | null) {
  if (!deadline) return { text: "No deadline", urgent: false, color: "text.secondary" };
  const diffDays = Math.ceil(
    (new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );
  if (diffDays < 0)
    return { text: `${Math.abs(diffDays)}d overdue`, urgent: true, color: "error.main" };
  if (diffDays === 0) return { text: "Due today", urgent: true, color: "error.main" };
  if (diffDays === 1) return { text: "Tomorrow", urgent: true, color: "error.main" };
  if (diffDays <= 7) return { text: `${diffDays}d left`, urgent: true, color: "warning.main" };
  return {
    text: new Date(deadline).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    urgent: false,
    color: "text.secondary",
  };
}

function StudentCard({
  student,
  onNudge,
}: {
  student: StudentWithLetter;
  onNudge?: (id: string) => void;
}) {
  const letter = student.letters[0];
  const status = letter?.status || "BLOCKED";
  const config = statusConfig[status];
  const deadline = formatDeadline(letter?.deadline || null);
  const bragProgress = student.bragSheet?.completionPercent || 0;

  return (
    <Paper
      component={Link}
      href={`/letters/${student.id}`}
      sx={{
        display: "flex",
        alignItems: "center",
        p: 1.5,
        gap: 1.5,
        textDecoration: "none",
        color: "inherit",
        borderRadius: 2,
        border: "1px solid",
        borderColor: deadline.urgent ? "error.200" : "divider",
        bgcolor: deadline.urgent ? "error.50" : "background.paper",
        transition: "all 0.15s ease",
        "&:hover": {
          borderColor: "primary.main",
          bgcolor: "primary.50",
          transform: "translateX(2px)",
        },
      }}
    >
      {/* Avatar */}
      <Avatar
        sx={{
          width: 40,
          height: 40,
          bgcolor: config.bgColor,
          color: `${config.color}.main`,
          fontSize: "0.875rem",
          fontWeight: 600,
        }}
      >
        {student.firstName[0]}
        {student.lastName[0]}
      </Avatar>

      {/* Main Content */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography
            variant="body2"
            sx={{ fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
          >
            {student.firstName} {student.lastName}
          </Typography>
          <Chip
            label={config.label}
            size="small"
            color={config.color}
            sx={{ height: 20, fontSize: "0.65rem", fontWeight: 600 }}
          />
        </Stack>

        {/* Stats Row */}
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mt: 0.5 }}>
          {/* Deadline */}
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <AccessTimeIcon sx={{ fontSize: 14, color: deadline.color }} />
            <Typography
              variant="caption"
              sx={{ fontWeight: deadline.urgent ? 600 : 400, color: deadline.color }}
            >
              {deadline.text}
            </Typography>
          </Stack>

          {/* Brag Sheet Progress */}
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <AssignmentIcon sx={{ fontSize: 14, color: bragProgress === 100 ? "success.main" : "warning.main" }} />
            <Box sx={{ width: 40, display: "flex", alignItems: "center" }}>
              <LinearProgress
                variant="determinate"
                value={bragProgress}
                color={bragProgress === 100 ? "success" : "warning"}
                sx={{ width: "100%", height: 4, borderRadius: 2 }}
              />
            </Box>
            <Typography variant="caption" color="text.secondary">
              {bragProgress}%
            </Typography>
          </Stack>
        </Stack>
      </Box>

      {/* Action */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
        {status === "BLOCKED" && bragProgress < 100 && (
          <Tooltip title="Send reminder">
            <IconButton
              size="small"
              color="warning"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onNudge?.(student.id);
              }}
              sx={{ bgcolor: "warning.50" }}
            >
              <NotificationsActiveIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Tooltip>
        )}

        {(status === "DRAFT" || status === "REVIEW") && (
          <Chip
            icon={<EditNoteIcon sx={{ fontSize: 14 }} />}
            label={status === "DRAFT" ? "Resume" : "Review"}
            size="small"
            color="primary"
            sx={{ height: 24, fontSize: "0.7rem" }}
          />
        )}

        {status === "COMPLETED" && (
          <Chip
            icon={<VisibilityIcon sx={{ fontSize: 14 }} />}
            label="View"
            size="small"
            variant="outlined"
            sx={{ height: 24, fontSize: "0.7rem" }}
          />
        )}

        <ChevronRightIcon sx={{ fontSize: 20, color: "text.disabled" }} />
      </Box>
    </Paper>
  );
}

export function TriageList({ students, onNudge }: TriageListProps) {
  if (students.length === 0) {
    return (
      <Paper sx={{ p: 3, textAlign: "center", borderRadius: 2 }}>
        <Typography variant="body2" color="text.secondary">
          No students match this filter
        </Typography>
      </Paper>
    );
  }

  return (
    <Stack spacing={1}>
      {students.map((student) => (
        <StudentCard key={student.id} student={student} onNudge={onNudge} />
      ))}
    </Stack>
  );
}
