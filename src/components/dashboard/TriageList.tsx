"use client";

import Link from "next/link";
import { Box, Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Avatar, Typography, Chip, Button, LinearProgress, Stack } from "@mui/material";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import EditNoteIcon from "@mui/icons-material/EditNote";
import VisibilityIcon from "@mui/icons-material/Visibility";

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

const statusConfig: Record<LetterStatus, { label: string; color: "warning" | "info" | "secondary" | "success" }> = {
  BLOCKED: { label: "Blocked", color: "warning" },
  DRAFT: { label: "Drafting", color: "info" },
  REVIEW: { label: "Review", color: "secondary" },
  COMPLETED: { label: "Done", color: "success" },
};

function formatDeadline(deadline: string | null) {
  if (!deadline) return { text: "No deadline", urgent: false };
  const diffDays = Math.ceil((new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  if (diffDays < 0) return { text: `${Math.abs(diffDays)}d overdue`, urgent: true };
  if (diffDays === 0) return { text: "Due today", urgent: true };
  if (diffDays <= 7) return { text: `${diffDays}d left`, urgent: true };
  return { text: new Date(deadline).toLocaleDateString("en-US", { month: "short", day: "numeric" }), urgent: false };
}

export function TriageList({ students, onNudge }: TriageListProps) {
  if (students.length === 0) {
    return <Card sx={{ p: 4, textAlign: "center" }}><Typography variant="h6" color="text.secondary">No students to display</Typography></Card>;
  }

  return (
    <Card>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Student</TableCell>
              <TableCell>Deadline</TableCell>
              <TableCell>Brag Sheet</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {students.map((student) => {
              const letter = student.letters[0];
              const status = letter?.status || "BLOCKED";
              const config = statusConfig[status];
              const deadline = formatDeadline(letter?.deadline || null);
              const bragProgress = student.bragSheet?.completionPercent || 0;

              return (
                <TableRow key={student.id} sx={{ "&:hover": { bgcolor: "action.hover" } }}>
                  <TableCell>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar sx={{ bgcolor: "primary.light" }}>{student.firstName[0]}{student.lastName[0]}</Avatar>
                      <Box>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>{student.firstName} {student.lastName}</Typography>
                        <Typography variant="caption" color="text.secondary">Grade {student.grade}</Typography>
                      </Box>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: deadline.urgent ? 600 : 400, color: deadline.urgent ? "error.main" : "text.primary" }}>{deadline.text}</Typography>
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Box sx={{ width: 80 }}><LinearProgress variant="determinate" value={bragProgress} color={bragProgress === 100 ? "success" : "warning"} /></Box>
                      <Typography variant="caption" color="text.secondary">{bragProgress}%</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell><Chip label={config.label} size="small" color={config.color} /></TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      {status === "BLOCKED" && bragProgress < 100 && (
                        <Button variant="outlined" size="small" color="warning" startIcon={<NotificationsActiveIcon />} onClick={(e) => { e.stopPropagation(); onNudge?.(student.id); }}>Nudge</Button>
                      )}
                      {(status === "DRAFT" || status === "REVIEW") && (
                        <Button component={Link} href={`/letters/${student.id}`} variant="contained" size="small" startIcon={<EditNoteIcon />}>{status === "DRAFT" ? "Resume" : "Review"}</Button>
                      )}
                      {status === "COMPLETED" && (
                        <Button component={Link} href={`/letters/${student.id}`} variant="outlined" size="small" startIcon={<VisibilityIcon />}>View</Button>
                      )}
                    </Stack>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
}
