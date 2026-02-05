"use client";

import { Box, Card, CardContent, Typography, Stack } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

interface MetricsRowProps {
  urgent: number;
  pending: number;
  completed: number;
  onFilterChange?: (filter: "urgent" | "pending" | "completed" | null) => void;
}

function MetricCard({ icon, label, count, color, onClick }: { icon: React.ReactNode; label: string; count: number; color: "error" | "warning" | "success"; onClick?: () => void }) {
  const colorMap = {
    error: { bg: "rgba(211, 47, 47, 0.08)", text: "#D32F2F" },
    warning: { bg: "rgba(249, 168, 37, 0.08)", text: "#F57C00" },
    success: { bg: "rgba(46, 125, 50, 0.08)", text: "#2E7D32" },
  };
  const colors = colorMap[color];

  return (
    <Card onClick={onClick} sx={{ flex: 1, cursor: onClick ? "pointer" : "default", bgcolor: colors.bg, "&:hover": onClick ? { transform: "translateY(-2px)" } : {} }}>
      <CardContent sx={{ py: 2, "&:last-child": { pb: 2 } }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Box sx={{ color: colors.text }}>{icon}</Box>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: colors.text, lineHeight: 1 }}>{count}</Typography>
            <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>{label}</Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

export function MetricsRow({ urgent, pending, completed, onFilterChange }: MetricsRowProps) {
  return (
    <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
      <MetricCard icon={<ErrorOutlineIcon sx={{ fontSize: 32 }} />} label="Due This Week" count={urgent} color="error" onClick={() => onFilterChange?.("urgent")} />
      <MetricCard icon={<PendingActionsIcon sx={{ fontSize: 32 }} />} label="Waiting on Student" count={pending} color="warning" onClick={() => onFilterChange?.("pending")} />
      <MetricCard icon={<CheckCircleOutlineIcon sx={{ fontSize: 32 }} />} label="Completed YTD" count={completed} color="success" onClick={() => onFilterChange?.("completed")} />
    </Stack>
  );
}
