"use client";

import { Box, Chip, Stack, Typography } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

interface MetricsRowProps {
  urgent: number;
  pending: number;
  completed: number;
  activeFilter?: "urgent" | "pending" | "completed" | null;
  onFilterChange?: (filter: "urgent" | "pending" | "completed" | null) => void;
}

export function MetricsRow({
  urgent,
  pending,
  completed,
  activeFilter,
  onFilterChange,
}: MetricsRowProps) {
  const total = urgent + pending + completed;

  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={1}
      sx={{ flexWrap: "wrap", gap: 1 }}
    >
      <Typography variant="body2" color="text.secondary" sx={{ mr: 0.5 }}>
        {total} students
      </Typography>

      <Chip
        icon={<ErrorOutlineIcon sx={{ fontSize: 16 }} />}
        label={`${urgent} urgent`}
        size="small"
        color={activeFilter === "urgent" ? "error" : "default"}
        variant={activeFilter === "urgent" ? "filled" : "outlined"}
        onClick={() => onFilterChange?.(activeFilter === "urgent" ? null : "urgent")}
        sx={{
          fontWeight: urgent > 0 ? 600 : 400,
          borderColor: urgent > 0 ? "error.main" : "divider",
          color: urgent > 0 && activeFilter !== "urgent" ? "error.main" : undefined,
          "&:hover": { bgcolor: "error.50" },
        }}
      />

      <Chip
        icon={<HourglassEmptyIcon sx={{ fontSize: 16 }} />}
        label={`${pending} waiting`}
        size="small"
        color={activeFilter === "pending" ? "warning" : "default"}
        variant={activeFilter === "pending" ? "filled" : "outlined"}
        onClick={() => onFilterChange?.(activeFilter === "pending" ? null : "pending")}
        sx={{
          fontWeight: pending > 0 ? 600 : 400,
          borderColor: pending > 0 ? "warning.main" : "divider",
          color: pending > 0 && activeFilter !== "pending" ? "warning.dark" : undefined,
          "&:hover": { bgcolor: "warning.50" },
        }}
      />

      <Chip
        icon={<CheckCircleIcon sx={{ fontSize: 16 }} />}
        label={`${completed} done`}
        size="small"
        color={activeFilter === "completed" ? "success" : "default"}
        variant={activeFilter === "completed" ? "filled" : "outlined"}
        onClick={() => onFilterChange?.(activeFilter === "completed" ? null : "completed")}
        sx={{
          borderColor: completed > 0 ? "success.main" : "divider",
          color: completed > 0 && activeFilter !== "completed" ? "success.main" : undefined,
          "&:hover": { bgcolor: "success.50" },
        }}
      />
    </Stack>
  );
}
