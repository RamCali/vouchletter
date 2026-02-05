"use client";

import { useState, useEffect } from "react";
import { Box, Paper, Typography, Stack, ToggleButtonGroup, ToggleButton, TextField, Button, Divider, Chip, CircularProgress } from "@mui/material";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { BiasHighlighter } from "./BiasHighlighter";

type LetterTone = "WARM" | "ACADEMIC" | "ADVOCACY";
type LetterAngle = "RESILIENCE" | "STEM" | "COMMUNITY";

interface CanvasPanelProps {
  studentName: string;
  initialContent?: string;
  initialTone?: LetterTone;
  initialAngle?: LetterAngle;
  onGenerate?: (tone: LetterTone, angle: LetterAngle) => Promise<string>;
  onSave?: (content: string, tone: LetterTone, angle: LetterAngle) => void;
  onExport?: () => void;
}

const toneOptions: { value: LetterTone; label: string }[] = [
  { value: "WARM", label: "Warm" },
  { value: "ACADEMIC", label: "Academic" },
  { value: "ADVOCACY", label: "Advocacy" },
];

const angleOptions: { value: LetterAngle; label: string }[] = [
  { value: "RESILIENCE", label: "Resilience" },
  { value: "STEM", label: "STEM" },
  { value: "COMMUNITY", label: "Community" },
];

export function CanvasPanel({ studentName, initialContent = "", initialTone = "WARM", initialAngle = "RESILIENCE", onGenerate, onSave, onExport }: CanvasPanelProps) {
  const [content, setContent] = useState(initialContent);
  const [tone, setTone] = useState<LetterTone>(initialTone);
  const [angle, setAngle] = useState<LetterAngle>(initialAngle);
  const [isGenerating, setIsGenerating] = useState(false);
  const [ferpaChecked, setFerpaChecked] = useState(false);
  const [showBias, setShowBias] = useState(true);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const handleGenerate = async () => {
    if (!onGenerate) return;
    setIsGenerating(true);
    try {
      const generated = await onGenerate(tone, angle);
      setContent(generated);
      setFerpaChecked(false);
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (content && onSave) { onSave(content, tone, angle); setLastSaved(new Date()); }
    }, 2000);
    return () => clearTimeout(timer);
  }, [content, tone, angle, onSave]);

  return (
    <Paper sx={{ height: "100%", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      {/* Header */}
      <Box sx={{ px: 2, pt: 2, pb: 1, flexShrink: 0 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={1}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>The Canvas</Typography>
            <Typography variant="caption" color="text.secondary">Letter for {studentName}</Typography>
          </Box>
          {lastSaved && <Typography variant="caption" color="text.secondary">Saved {lastSaved.toLocaleTimeString()}</Typography>}
        </Stack>
      </Box>

      {/* Controls - Responsive layout */}
      <Box sx={{ px: 2, py: 1.5, bgcolor: "background.default", flexShrink: 0 }}>
        <Stack spacing={1.5}>
          {/* Tone and Angle row */}
          <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
            <Box sx={{ minWidth: "fit-content" }}>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: "block" }}>Tone</Typography>
              <ToggleButtonGroup value={tone} exclusive onChange={(_, v) => v && setTone(v)} size="small">
                {toneOptions.map((o) => (
                  <ToggleButton key={o.value} value={o.value} sx={{ px: 1.5, fontSize: "0.75rem" }}>
                    {o.label}
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
            </Box>
            <Box sx={{ minWidth: "fit-content" }}>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: "block" }}>Angle</Typography>
              <ToggleButtonGroup value={angle} exclusive onChange={(_, v) => v && setAngle(v)} size="small">
                {angleOptions.map((o) => (
                  <ToggleButton key={o.value} value={o.value} sx={{ px: 1.5, fontSize: "0.75rem" }}>
                    {o.label}
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
            </Box>
          </Stack>

          {/* Generate button - full width on small screens */}
          <Button
            variant="contained"
            fullWidth
            startIcon={isGenerating ? <CircularProgress size={16} color="inherit" /> : <AutoAwesomeIcon />}
            onClick={handleGenerate}
            disabled={isGenerating}
            sx={{ py: 1 }}
          >
            {isGenerating ? "Generating..." : "Generate Draft"}
          </Button>
        </Stack>
      </Box>

      <Divider />

      {/* Text area - flex grow */}
      <Box sx={{ flex: 1, p: 2, overflow: "auto", minHeight: 0 }}>
        {showBias && content && <BiasHighlighter content={content} onDismiss={() => setShowBias(false)} />}
        <TextField
          multiline
          fullWidth
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Click 'Generate Draft' or start writing..."
          sx={{
            height: "100%",
            "& .MuiOutlinedInput-root": {
              height: "100%",
              alignItems: "flex-start",
              fontFamily: "Georgia, serif",
              fontSize: "1rem",
              lineHeight: 1.8,
            },
            "& .MuiOutlinedInput-input": {
              height: "100% !important",
              overflow: "auto !important",
            },
          }}
        />
      </Box>

      {/* Footer */}
      <Box sx={{ px: 2, py: 1.5, bgcolor: "background.default", borderTop: 1, borderColor: "divider", flexShrink: 0 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={1}>
          {ferpaChecked ? (
            <Chip icon={<CheckCircleIcon />} label="FERPA Compliant" color="success" size="small" />
          ) : (
            <Button variant="outlined" size="small" color="warning" startIcon={<WarningAmberIcon />} onClick={() => setFerpaChecked(true)}>
              Check FERPA
            </Button>
          )}
          <Button
            variant="contained"
            color="secondary"
            size="small"
            startIcon={<FileDownloadIcon />}
            onClick={onExport}
            disabled={!ferpaChecked || !content}
          >
            Export to Common App
          </Button>
        </Stack>
      </Box>
    </Paper>
  );
}
