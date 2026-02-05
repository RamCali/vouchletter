"use client";

import { useMemo } from "react";
import { Alert, AlertTitle, Box, Chip, Stack, IconButton, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const BIAS_DICTIONARY: Record<string, { suggestions: string[]; note: string }> = {
  hardworking: { suggestions: ["diligent", "industrious"], note: "Consider achievement language" },
  helpful: { suggestions: ["collaborative", "contributes to team success"], note: "Be specific" },
  quiet: { suggestions: ["thoughtful", "observant", "reflective"], note: "May undervalue introverted strengths" },
  aggressive: { suggestions: ["assertive", "driven", "ambitious"], note: "Can carry negative connotation" },
  bossy: { suggestions: ["demonstrates leadership", "takes initiative"], note: "Consider leadership framing" },
  emotional: { suggestions: ["passionate", "invested", "empathetic"], note: "Consider context" },
};

function findBiasedWords(content: string) {
  const flags: { word: string; suggestions: string[]; note: string }[] = [];
  const lowerContent = content.toLowerCase();
  for (const [word, data] of Object.entries(BIAS_DICTIONARY)) {
    if (lowerContent.includes(word)) {
      flags.push({ word, ...data });
    }
  }
  return flags;
}

export function BiasHighlighter({ content, onDismiss }: { content: string; onDismiss?: () => void }) {
  const biasFlags = useMemo(() => findBiasedWords(content), [content]);
  if (biasFlags.length === 0) return null;

  return (
    <Alert severity="warning" sx={{ mb: 2 }} action={onDismiss && <IconButton size="small" onClick={onDismiss}><CloseIcon fontSize="small" /></IconButton>}>
      <AlertTitle sx={{ fontWeight: 600 }}>Potential Bias Detected ({biasFlags.length})</AlertTitle>
      <Typography variant="body2" sx={{ mb: 1.5 }}>Consider alternatives:</Typography>
      <Stack spacing={1}>
        {biasFlags.map((flag, i) => (
          <Box key={i}>
            <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
              <Chip label={`"${flag.word}"`} size="small" color="warning" />
              <Typography variant="caption">→</Typography>
              {flag.suggestions.map((s, j) => <Chip key={j} label={s} size="small" variant="outlined" onClick={() => navigator.clipboard.writeText(s)} sx={{ cursor: "pointer" }} />)}
            </Stack>
            <Typography variant="caption" color="text.secondary">{flag.note}</Typography>
          </Box>
        ))}
      </Stack>
    </Alert>
  );
}

export { BIAS_DICTIONARY };
