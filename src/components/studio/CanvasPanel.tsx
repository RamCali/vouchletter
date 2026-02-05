"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Box,
  Paper,
  Typography,
  Stack,
  ToggleButtonGroup,
  ToggleButton,
  TextField,
  Button,
  Chip,
  CircularProgress,
  IconButton,
  Tooltip,
  LinearProgress,
  Fade,
} from "@mui/material";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import ShortTextIcon from "@mui/icons-material/ShortText";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import TipsAndUpdatesIcon from "@mui/icons-material/TipsAndUpdates";
import CloudDoneIcon from "@mui/icons-material/CloudDone";
import EditNoteIcon from "@mui/icons-material/EditNote";
import { BiasHighlighter } from "./BiasHighlighter";

type LetterTone = "WARM" | "ACADEMIC" | "ADVOCACY";
type LetterAngle = "RESILIENCE" | "STEM" | "COMMUNITY";

interface CanvasPanelProps {
  studentName: string;
  content: string;
  onContentChange: (content: string) => void;
  initialTone?: LetterTone;
  initialAngle?: LetterAngle;
  onGenerate?: (tone: LetterTone, angle: LetterAngle) => Promise<string>;
  onSave?: (content: string, tone: LetterTone, angle: LetterAngle) => void;
  onExport?: () => void;
}

const toneOptions: { value: LetterTone; label: string; icon: string }[] = [
  { value: "WARM", label: "Warm", icon: "🤝" },
  { value: "ACADEMIC", label: "Academic", icon: "📚" },
  { value: "ADVOCACY", label: "Advocacy", icon: "💪" },
];

const angleOptions: { value: LetterAngle; label: string; icon: string }[] = [
  { value: "RESILIENCE", label: "Resilience", icon: "🌱" },
  { value: "STEM", label: "STEM", icon: "🔬" },
  { value: "COMMUNITY", label: "Community", icon: "🤲" },
];

// Target word count for Common App (typically 400-600 words)
const TARGET_WORDS = 500;
const MIN_WORDS = 350;
const MAX_WORDS = 650;

export function CanvasPanel({
  studentName,
  content,
  onContentChange,
  initialTone = "WARM",
  initialAngle = "RESILIENCE",
  onGenerate,
  onSave,
  onExport,
}: CanvasPanelProps) {
  const [tone, setTone] = useState<LetterTone>(initialTone);
  const [angle, setAngle] = useState<LetterAngle>(initialAngle);
  const [isGenerating, setIsGenerating] = useState(false);
  const [ferpaChecked, setFerpaChecked] = useState(false);
  const [showBias, setShowBias] = useState(true);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Word count and stats
  const stats = useMemo(() => {
    const words = content.trim() ? content.trim().split(/\s+/).length : 0;
    const chars = content.length;
    const paragraphs = content.trim() ? content.trim().split(/\n\n+/).length : 0;
    const progress = Math.min((words / TARGET_WORDS) * 100, 100);
    const status =
      words === 0
        ? "empty"
        : words < MIN_WORDS
          ? "short"
          : words > MAX_WORDS
            ? "long"
            : "good";
    return { words, chars, paragraphs, progress, status };
  }, [content]);

  const handleGenerate = async () => {
    if (!onGenerate) return;
    setIsGenerating(true);
    try {
      const generated = await onGenerate(tone, angle);
      onContentChange(generated);
      setFerpaChecked(false);
    } finally {
      setIsGenerating(false);
    }
  };

  // Auto-save with visual feedback
  useEffect(() => {
    if (!content || !onSave) return;
    setIsSaving(true);
    const timer = setTimeout(() => {
      onSave(content, tone, angle);
      setLastSaved(new Date());
      setIsSaving(false);
    }, 1500);
    return () => {
      clearTimeout(timer);
      setIsSaving(false);
    };
  }, [content, tone, angle, onSave]);

  const firstName = studentName.split(" ")[0];

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
      {/* Compact Header Bar */}
      <Box
        sx={{
          px: 2,
          py: 1,
          bgcolor: "grey.50",
          borderBottom: 1,
          borderColor: "divider",
          flexShrink: 0,
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          flexWrap="wrap"
          gap={1}
        >
          {/* Left: Controls */}
          <Stack direction="row" alignItems="center" spacing={1.5} flexWrap="wrap" useFlexGap>
            <ToggleButtonGroup
              value={tone}
              exclusive
              onChange={(_, v) => v && setTone(v)}
              size="small"
            >
              {toneOptions.map((o) => (
                <ToggleButton
                  key={o.value}
                  value={o.value}
                  sx={{ px: 1, py: 0.5, fontSize: "0.7rem" }}
                >
                  <span style={{ marginRight: 4 }}>{o.icon}</span>
                  {o.label}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>

            <Box sx={{ width: 1, height: 20, bgcolor: "divider", display: { xs: "none", sm: "block" } }} />

            <ToggleButtonGroup
              value={angle}
              exclusive
              onChange={(_, v) => v && setAngle(v)}
              size="small"
            >
              {angleOptions.map((o) => (
                <ToggleButton
                  key={o.value}
                  value={o.value}
                  sx={{ px: 1, py: 0.5, fontSize: "0.7rem" }}
                >
                  <span style={{ marginRight: 4 }}>{o.icon}</span>
                  {o.label}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </Stack>

          {/* Right: Generate Button */}
          <Button
            variant="contained"
            size="small"
            startIcon={
              isGenerating ? (
                <CircularProgress size={14} color="inherit" />
              ) : (
                <AutoAwesomeIcon sx={{ fontSize: 16 }} />
              )
            }
            onClick={handleGenerate}
            disabled={isGenerating}
            sx={{ px: 2, py: 0.75, fontSize: "0.8rem", fontWeight: 600 }}
          >
            {isGenerating ? "Writing..." : "Generate"}
          </Button>
        </Stack>
      </Box>

      {/* Main Writing Area */}
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
        {/* Bias alert if present */}
        {showBias && content && (
          <Box sx={{ px: 2, pt: 1 }}>
            <BiasHighlighter content={content} onDismiss={() => setShowBias(false)} />
          </Box>
        )}

        {/* Text Editor or Empty State */}
        <Box sx={{ flex: 1, p: 2, pb: 1, overflow: "auto", minHeight: 0 }}>
          {!content && !isGenerating ? (
            // Empty State - Helpful prompts
            <Fade in>
              <Box
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                  color: "text.secondary",
                }}
              >
                <EditNoteIcon sx={{ fontSize: 48, mb: 2, opacity: 0.3 }} />
                <Typography variant="h6" sx={{ mb: 1, fontWeight: 500 }}>
                  Ready to write for {firstName}
                </Typography>
                <Typography variant="body2" sx={{ mb: 3, maxWidth: 320 }}>
                  Click <strong>Generate</strong> to create an AI draft, or start typing below
                </Typography>

                <Stack spacing={1} sx={{ width: "100%", maxWidth: 400 }}>
                  <Typography variant="caption" sx={{ fontWeight: 600, textTransform: "uppercase", letterSpacing: 1 }}>
                    Quick Starts
                  </Typography>
                  {[
                    `I am pleased to recommend ${firstName}...`,
                    `In my ${Math.floor(Math.random() * 10) + 10} years as a counselor, few students have impressed me like ${firstName}...`,
                    `${firstName} is the rare student who...`,
                  ].map((prompt, i) => (
                    <Button
                      key={i}
                      variant="outlined"
                      size="small"
                      sx={{
                        justifyContent: "flex-start",
                        textAlign: "left",
                        textTransform: "none",
                        fontFamily: "Georgia, serif",
                        fontSize: "0.85rem",
                        py: 1,
                        color: "text.secondary",
                        borderColor: "divider",
                        "&:hover": { borderColor: "primary.main", bgcolor: "primary.50" },
                      }}
                      onClick={() => onContentChange(prompt)}
                    >
                      {prompt}
                    </Button>
                  ))}
                </Stack>
              </Box>
            </Fade>
          ) : (
            // Text Editor
            <TextField
              multiline
              fullWidth
              value={content}
              onChange={(e) => onContentChange(e.target.value)}
              placeholder={`Writing recommendation for ${firstName}...`}
              variant="standard"
              InputProps={{
                disableUnderline: true,
              }}
              sx={{
                height: "100%",
                "& .MuiInputBase-root": {
                  height: "100%",
                  alignItems: "flex-start",
                },
                "& .MuiInputBase-input": {
                  height: "100% !important",
                  overflow: "auto !important",
                  fontFamily: "Georgia, serif",
                  fontSize: "1.05rem",
                  lineHeight: 1.9,
                  color: "text.primary",
                },
              }}
            />
          )}
        </Box>

        {/* Writing Stats Bar - Always visible when content exists */}
        {content && (
          <Box sx={{ px: 2, py: 1, borderTop: 1, borderColor: "divider", bgcolor: "grey.50" }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              {/* Word count with progress */}
              <Stack direction="row" alignItems="center" spacing={2}>
                <Box sx={{ minWidth: 120 }}>
                  <Stack direction="row" alignItems="baseline" spacing={0.5}>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 700,
                        color:
                          stats.status === "good"
                            ? "success.main"
                            : stats.status === "long"
                              ? "warning.main"
                              : "text.primary",
                      }}
                    >
                      {stats.words}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      / {TARGET_WORDS} words
                    </Typography>
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    value={stats.progress}
                    sx={{
                      height: 3,
                      borderRadius: 1,
                      bgcolor: "grey.200",
                      "& .MuiLinearProgress-bar": {
                        bgcolor:
                          stats.status === "good"
                            ? "success.main"
                            : stats.status === "long"
                              ? "warning.main"
                              : "primary.main",
                      },
                    }}
                  />
                </Box>

                {stats.status === "short" && (
                  <Chip
                    size="small"
                    label={`${MIN_WORDS - stats.words} more needed`}
                    sx={{ fontSize: "0.7rem", height: 22 }}
                  />
                )}
                {stats.status === "long" && (
                  <Chip
                    size="small"
                    color="warning"
                    label={`${stats.words - MAX_WORDS} over limit`}
                    sx={{ fontSize: "0.7rem", height: 22 }}
                  />
                )}
                {stats.status === "good" && (
                  <Chip
                    size="small"
                    color="success"
                    icon={<CheckCircleIcon sx={{ fontSize: 14 }} />}
                    label="Good length"
                    sx={{ fontSize: "0.7rem", height: 22 }}
                  />
                )}
              </Stack>

              {/* Quick AI Actions */}
              <Stack direction="row" spacing={0.5}>
                <Tooltip title="Make it shorter">
                  <IconButton size="small" sx={{ color: "text.secondary" }}>
                    <ShortTextIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Strengthen language">
                  <IconButton size="small" sx={{ color: "text.secondary" }}>
                    <AutoFixHighIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Get suggestions">
                  <IconButton size="small" sx={{ color: "text.secondary" }}>
                    <TipsAndUpdatesIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Stack>
            </Stack>
          </Box>
        )}
      </Box>

      {/* Footer - Compact */}
      <Box
        sx={{
          px: 2,
          py: 1,
          borderTop: 1,
          borderColor: "divider",
          bgcolor: "background.paper",
          flexShrink: 0,
        }}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          {/* Left: Save status + FERPA */}
          <Stack direction="row" alignItems="center" spacing={1.5}>
            {/* Save indicator */}
            {content && (
              <Stack direction="row" alignItems="center" spacing={0.5}>
                {isSaving ? (
                  <CircularProgress size={12} />
                ) : lastSaved ? (
                  <CloudDoneIcon sx={{ fontSize: 14, color: "success.main" }} />
                ) : null}
                <Typography variant="caption" color="text.secondary">
                  {isSaving
                    ? "Saving..."
                    : lastSaved
                      ? `Saved ${lastSaved.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
                      : ""}
                </Typography>
              </Stack>
            )}

            {/* FERPA check */}
            {ferpaChecked ? (
              <Chip
                icon={<CheckCircleIcon sx={{ fontSize: 14 }} />}
                label="FERPA OK"
                color="success"
                size="small"
                sx={{ height: 24, fontSize: "0.7rem" }}
              />
            ) : (
              <Button
                size="small"
                color="warning"
                startIcon={<WarningAmberIcon sx={{ fontSize: 14 }} />}
                onClick={() => setFerpaChecked(true)}
                sx={{ fontSize: "0.75rem", py: 0.25, textTransform: "none" }}
              >
                Check FERPA
              </Button>
            )}
          </Stack>

          {/* Right: Export */}
          <Button
            variant="contained"
            color="secondary"
            size="small"
            startIcon={<FileDownloadIcon sx={{ fontSize: 16 }} />}
            onClick={onExport}
            disabled={!ferpaChecked || !content}
            sx={{ fontSize: "0.75rem", py: 0.5 }}
          >
            Export
          </Button>
        </Stack>
      </Box>
    </Paper>
  );
}
