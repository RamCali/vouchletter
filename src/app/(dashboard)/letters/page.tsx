"use client";

import { useState, useMemo } from "react";
import { Box, Typography, Stack, Snackbar, Alert, TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
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

function getDaysUntil(deadline: string, now: number): number {
  return Math.ceil((new Date(deadline).getTime() - now) / (1000 * 60 * 60 * 24));
}

function generateDemoStudents(): DemoStudent[] {
  const now = Date.now();
  return [
    // === DUE THIS WEEK (2 students) ===
    {
      id: "1",
      firstName: "Marcus",
      lastName: "Demo",
      photoUrl: null,
      grade: 12,
      bragSheet: { completionPercent: 100 },
      letters: [
        {
          id: "l1",
          status: "DRAFT",
          deadline: new Date(now + 2 * 24 * 60 * 60 * 1000).toISOString(),
        },
      ],
    },
    {
      id: "2",
      firstName: "Priya",
      lastName: "Demo",
      photoUrl: null,
      grade: 12,
      bragSheet: { completionPercent: 100 },
      letters: [
        {
          id: "l2",
          status: "REVIEW",
          deadline: new Date(now + 5 * 24 * 60 * 60 * 1000).toISOString(),
        },
      ],
    },
    // === WAITING ON STUDENT (2 students) ===
    {
      id: "3",
      firstName: "Jordan",
      lastName: "Demo",
      photoUrl: null,
      grade: 12,
      bragSheet: { completionPercent: 35 },
      letters: [
        {
          id: "l3",
          status: "BLOCKED",
          deadline: new Date(now + 10 * 24 * 60 * 60 * 1000).toISOString(),
        },
      ],
    },
    {
      id: "4",
      firstName: "Aaliyah",
      lastName: "Demo",
      photoUrl: null,
      grade: 12,
      bragSheet: { completionPercent: 65 },
      letters: [
        {
          id: "l4",
          status: "BLOCKED",
          deadline: new Date(now + 14 * 24 * 60 * 60 * 1000).toISOString(),
        },
      ],
    },
    // === COMPLETED YTD (2 students) ===
    {
      id: "5",
      firstName: "Elena",
      lastName: "Demo",
      photoUrl: null,
      grade: 12,
      bragSheet: { completionPercent: 100 },
      letters: [{ id: "l5", status: "COMPLETED", deadline: null }],
    },
    {
      id: "6",
      firstName: "David",
      lastName: "Demo",
      photoUrl: null,
      grade: 12,
      bragSheet: { completionPercent: 100 },
      letters: [{ id: "l6", status: "COMPLETED", deadline: null }],
    },
  ];
}

export default function LettersPage() {
  const [filter, setFilter] = useState<"urgent" | "pending" | "completed" | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string }>({
    open: false,
    message: "",
  });

  const [{ demoStudents, currentTime }] = useState(() => ({
    demoStudents: generateDemoStudents(),
    currentTime: Date.now(),
  }));

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

  const filteredStudents = useMemo(() => {
    let result = demoStudents;

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (s) =>
          s.firstName.toLowerCase().includes(query) ||
          s.lastName.toLowerCase().includes(query)
      );
    }

    // Apply status filter
    if (filter) {
      result = result.filter((student) => {
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
      });
    }

    // Sort by deadline
    return result.sort((a, b) => {
      const aDeadline = a.letters[0]?.deadline;
      const bDeadline = b.letters[0]?.deadline;
      if (!aDeadline && !bDeadline) return 0;
      if (!aDeadline) return 1;
      if (!bDeadline) return -1;
      return new Date(aDeadline).getTime() - new Date(bDeadline).getTime();
    });
  }, [demoStudents, filter, searchQuery, currentTime]);

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
      {/* Compact Header with Search and Filters */}
      <Stack spacing={1.5} sx={{ mb: 2 }}>
        {/* Title Row */}
        <Stack direction="row" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={1}>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Letters
          </Typography>
          <TextField
            size="small"
            placeholder="Search students..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ fontSize: 20, color: "text.disabled" }} />
                </InputAdornment>
              ),
            }}
            sx={{
              width: { xs: "100%", sm: 220 },
              "& .MuiOutlinedInput-root": {
                bgcolor: "background.paper",
                fontSize: "0.875rem",
              },
            }}
          />
        </Stack>

        {/* Metrics/Filter Row */}
        <MetricsRow
          urgent={urgentCount}
          pending={pendingCount}
          completed={completedCount}
          activeFilter={filter}
          onFilterChange={handleFilterChange}
        />
      </Stack>

      {/* Student List */}
      <TriageList students={filteredStudents} onNudge={handleNudge} />

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
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
