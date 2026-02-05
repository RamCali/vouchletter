"use client";

import { useState, useMemo } from "react";
import { Box, Typography, Stack, Snackbar, Alert } from "@mui/material";
import { MetricsRow } from "@/components/dashboard/MetricsRow";
import { TriageList } from "@/components/dashboard/TriageList";

type LetterStatus = "DRAFT" | "BLOCKED" | "REVIEW" | "COMPLETED";

interface DemoLetter {
  id: string;
  status: LetterStatus;
  deadline: string | null;
}

interface DemoStudent {
  id: string;
  firstName: string;
  lastName: string;
  photoUrl: string | null;
  grade: number;
  bragSheet: { completionPercent: number };
  letters: DemoLetter[];
}

// Helper function to calculate days until deadline
function getDaysUntil(deadline: string, now: number): number {
  return Math.ceil((new Date(deadline).getTime() - now) / (1000 * 60 * 60 * 24));
}

// Generate demo data with fixed dates (relative to a base time)
function generateDemoStudents(): DemoStudent[] {
  const now = Date.now();
  return [
    {
      id: "1",
      firstName: "John",
      lastName: "Doe",
      photoUrl: null,
      grade: 12,
      bragSheet: { completionPercent: 100 },
      letters: [
        { id: "l1", status: "DRAFT", deadline: new Date(now + 3 * 24 * 60 * 60 * 1000).toISOString() },
      ],
    },
    {
      id: "2",
      firstName: "Sarah",
      lastName: "Miller",
      photoUrl: null,
      grade: 12,
      bragSheet: { completionPercent: 40 },
      letters: [
        { id: "l2", status: "BLOCKED", deadline: new Date(now + 5 * 24 * 60 * 60 * 1000).toISOString() },
      ],
    },
    {
      id: "3",
      firstName: "Michael",
      lastName: "Chen",
      photoUrl: null,
      grade: 12,
      bragSheet: { completionPercent: 100 },
      letters: [
        { id: "l3", status: "REVIEW", deadline: new Date(now + 2 * 24 * 60 * 60 * 1000).toISOString() },
      ],
    },
    {
      id: "4",
      firstName: "Emily",
      lastName: "Rodriguez",
      photoUrl: null,
      grade: 12,
      bragSheet: { completionPercent: 75 },
      letters: [
        { id: "l4", status: "BLOCKED", deadline: new Date(now + 10 * 24 * 60 * 60 * 1000).toISOString() },
      ],
    },
    {
      id: "5",
      firstName: "David",
      lastName: "Kim",
      photoUrl: null,
      grade: 12,
      bragSheet: { completionPercent: 100 },
      letters: [{ id: "l5", status: "COMPLETED", deadline: null }],
    },
    {
      id: "6",
      firstName: "Jessica",
      lastName: "Patel",
      photoUrl: null,
      grade: 11,
      bragSheet: { completionPercent: 100 },
      letters: [
        { id: "l6", status: "DRAFT", deadline: new Date(now + 7 * 24 * 60 * 60 * 1000).toISOString() },
      ],
    },
    {
      id: "7",
      firstName: "Alex",
      lastName: "Thompson",
      photoUrl: null,
      grade: 12,
      bragSheet: { completionPercent: 20 },
      letters: [
        { id: "l7", status: "BLOCKED", deadline: new Date(now + 1 * 24 * 60 * 60 * 1000).toISOString() },
      ],
    },
  ];
}

export default function LettersPage() {
  const [filter, setFilter] = useState<"urgent" | "pending" | "completed" | null>(null);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string }>({
    open: false,
    message: "",
  });

  // Generate demo data once using useState with lazy initializer
  // This ensures Date.now() is only called once during initial render
  const [{ demoStudents, currentTime }] = useState(() => ({
    demoStudents: generateDemoStudents(),
    currentTime: Date.now(),
  }));

  // Calculate metrics using memoized current time
  const urgentCount = useMemo(() => {
    return demoStudents.filter((s) => {
      const letter = s.letters[0];
      if (!letter?.deadline) return false;
      const daysUntil = getDaysUntil(letter.deadline, currentTime);
      return daysUntil <= 7 && letter.status !== "COMPLETED";
    }).length;
  }, [demoStudents, currentTime]);

  const pendingCount = useMemo(() => {
    return demoStudents.filter((s) => s.letters[0]?.status === "BLOCKED").length;
  }, [demoStudents]);

  const completedCount = useMemo(() => {
    return demoStudents.filter((s) => s.letters[0]?.status === "COMPLETED").length;
  }, [demoStudents]);

  // Filter students based on selected filter
  const filteredStudents = useMemo(() => {
    return demoStudents.filter((student) => {
      if (!filter) return true;

      const letter = student.letters[0];
      if (filter === "urgent") {
        if (!letter?.deadline) return false;
        const daysUntil = getDaysUntil(letter.deadline, currentTime);
        return daysUntil <= 7 && letter.status !== "COMPLETED";
      }
      if (filter === "pending") {
        return letter?.status === "BLOCKED";
      }
      if (filter === "completed") {
        return letter?.status === "COMPLETED";
      }
      return true;
    }).sort((a, b) => {
      // Sort by deadline (earliest first), with no deadline at the end
      const aDeadline = a.letters[0]?.deadline;
      const bDeadline = b.letters[0]?.deadline;
      if (!aDeadline && !bDeadline) return 0;
      if (!aDeadline) return 1;
      if (!bDeadline) return -1;
      return new Date(aDeadline).getTime() - new Date(bDeadline).getTime();
    });
  }, [demoStudents, filter, currentTime]);

  const handleNudge = (studentId: string) => {
    const student = demoStudents.find((s) => s.id === studentId);
    if (student) {
      setSnackbar({
        open: true,
        message: `Reminder sent to ${student.firstName} ${student.lastName}`,
      });
    }
  };

  const handleFilterChange = (newFilter: "urgent" | "pending" | "completed" | null) => {
    setFilter((current) => (current === newFilter ? null : newFilter));
  };

  return (
    <Box>
      {/* Page Header */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 3 }}
      >
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Letters
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage recommendation letters for your students
          </Typography>
        </Box>
      </Stack>

      {/* Metrics Row - "The Pulse" */}
      <MetricsRow
        urgent={urgentCount}
        pending={pendingCount}
        completed={completedCount}
        onFilterChange={handleFilterChange}
      />

      {/* Filter indicator */}
      {filter && (
        <Typography
          variant="body2"
          sx={{ mb: 2, color: "text.secondary" }}
          onClick={() => setFilter(null)}
          style={{ cursor: "pointer" }}
        >
          Showing: {filter === "urgent" ? "Due This Week" : filter === "pending" ? "Waiting on Student" : "Completed"}{" "}
          <span style={{ textDecoration: "underline" }}>(clear)</span>
        </Typography>
      )}

      {/* Triage List */}
      <TriageList students={filteredStudents} onNudge={handleNudge} />

      {/* Snackbar for nudge confirmation */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity="success"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
